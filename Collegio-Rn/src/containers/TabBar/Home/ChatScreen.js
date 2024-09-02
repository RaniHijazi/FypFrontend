import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import { checkPlatform, moderateScale, API_BASE_URL } from '../../../common/constants';
import strings from '../../../i18n/strings';
import CInput from '../../../components/common/CInput';
import { SendIcon } from '../../../assets/svgs';

import signalRService from '../../../common/SignalRService';  // Import SignalRService

export default function ChatScreen({ route }) {
  const data = route?.params?.data;
  const colors = useSelector(state => state.theme.theme);
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [senderProfile, setSenderProfile] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          console.log('Retrieved userId:', userIdInt);
          const profile = await fetchUserProfile(userIdInt);
          setSenderProfile(profile);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (userId !== null && senderProfile !== null) {
      fetchAllMessages();
      signalRService.start(handleReceiveMessage);
    }

    return () => {
      if (signalRService.connection) {
        signalRService.connection.off('ReceiveMessage');
      }
    };
  }, [userId, senderProfile]);

  const fetchMessages = async (senderId, receiverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Message/sender/${senderId}?receiverId=${receiverId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const messagesData = await response.json();
      return messagesData;
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      return [];
    }
  };

  const fetchAllMessages = async () => {
    const senderMessages = await fetchMessages(userId, data.id);
    const receiverMessages = await fetchMessages(data.id, userId);

    const combinedMessages = [...senderMessages, ...receiverMessages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    setMessages(combinedMessages);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${userId}/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const profileData = await response.json();
      return profileData;
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
  };

 const handleReceiveMessage = (message) => {
   console.log('Received message:', message);
   if (message.senderId !== userId) {
     setMessages((prevMessages) => {
       const newMessages = [...prevMessages, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
       console.log('Updated Messages:', newMessages);
       return newMessages;
     });
     flatListRef.current?.scrollToEnd({ animated: true });
   }
 };


  const sendMessage = async () => {
    if (chat.trim() === '') {
      return;
    }

    if (!senderProfile) {
      console.error('Sender profile is not set');
      return;
    }

    const newMessage = {
      content: chat,
      senderName: senderProfile.fullName,
      senderProfilePath: senderProfile.profilePath,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', newMessage);

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    flatListRef.current?.scrollToEnd({ animated: true });

    try {
      await signalRService.sendMessage(data.id, chat);
      setChat('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const onChangeTextChat = text => {
    setChat(text);
  };

  const rightAccessory = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <TouchableOpacity>
          <Octicons name={'plus'} size={moderateScale(26)} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <SimpleLineIcons
            name={'microphone'}
            size={moderateScale(26)}
            color={colors.dark ? colors.black : colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage}>
          <SendIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.containerStyle, { backgroundColor: colors.primary }]}>
        <MaterialCommunityIcons name={'dots-vertical'} size={moderateScale(20)} color={colors.white} />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const isSender = item.senderName === senderProfile.fullName;
    return (
      <View>
        <View
          style={[
            localStyles.messageContainer,
            {
              backgroundColor: isSender ? colors.primary : colors.placeholderColor,
              alignSelf: isSender ? 'flex-end' : 'flex-start',
            },
          ]}>
          <View style={styles.flexRow}>
            {!isSender && (
              <Image source={{ uri: item.senderProfilePath }} style={localStyles.containerStyle} />
            )}
            <CText style={[styles.flex, styles.ph10]} color={isSender ? colors.white : colors.mainColor} type="m16">
              {item.content}
            </CText>
          </View>
          <CText color={colors.grayScale5} style={localStyles.timeStyle} type="r12">
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </CText>
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <View style={styles.ph20}>
        <CHeader
          rightIcon={<RightIcon />}
          style={localStyles.headerStyle}
        />
        <View style={localStyles.contentStyle}>
          <Image source={{ uri: data.profilePath }} style={localStyles.profileImageStyle} />
          <CText color={colors.mainColor} type={'b14'} numberOfLines={1}>
            {data.fullName}
          </CText>
          <CText color={colors.grayScale5} type={'r12'} numberOfLines={1}>
            {`Joined on ${new Date(data.joinDate).toDateString()}`}
          </CText>
        </View>
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={checkPlatform() === 'ios' ? moderateScale(50) : null}
        style={localStyles.contentMainStyle}
        behavior={checkPlatform() === 'ios' ? 'padding' : null}>
        <View style={styles.flex}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </View>
        <CInput
          placeholder={strings.chatPlaceholder}
          inputContainerStyle={localStyles.inputContainerStyle}
          placeholderTextColor={colors.grayScale5}
          rightAccessory={rightAccessory}
          value={chat}
          onChangeText={onChangeTextChat}
        />
      </KeyboardAvoidingView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  containerStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
  },
  profileImageStyle: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(10),
  },
  contentStyle: {
    ...styles.itemsCenter,
    gap: moderateScale(5),
  },
  headerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    borderRadius: moderateScale(16),
    ...styles.p15,
    ...styles.mv10,
    ...styles.itemsEnd,
    maxWidth: '85%',
  },
  timeStyle: {
    ...styles.selfEnd,
    ...styles.pr10,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(50),
    height: moderateScale(52),
    ...styles.mv20,
  },
  mainContentStyle: {
    ...styles.rowCenter,
    gap: moderateScale(5),
  },
  contentMainStyle: {
    ...styles.flex,
    ...styles.ph20,
  },
});
