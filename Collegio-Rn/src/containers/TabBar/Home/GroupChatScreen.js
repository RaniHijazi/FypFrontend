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
import * as SignalR from '@microsoft/signalr';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import { checkPlatform, moderateScale , API_BASE_URL } from '../../../common/constants';
import strings from '../../../i18n/strings';
import CInput from '../../../components/common/CInput';
import { SendIcon } from '../../../assets/svgs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GroupChatScreen({ route }) {
  const data = route?.params?.data;
  const colors = useSelector(state => state.theme.theme);
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [senderProfile, setSenderProfile] = useState(null);
  const connectionRef = useRef(null);

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
      startSignalRConnection();
      fetchAllMessages();
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [userId, senderProfile]);

  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ChatRoom/${roomId}/messages`);
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
    const roomMessages = await fetchMessages(data.id);
    setMessages(roomMessages);
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
      senderId: userId, // Ensure senderId is included in the new message
      senderName: senderProfile.fullName,
      senderProfilePath: senderProfile.profilePath,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/Message/sendToRoom?senderId=${userId}&roomId=${data.id}&messageContent=${encodeURIComponent(chat)}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setChat('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const onChangeTextChat = text => {
    setChat(text);
  };

  const startSignalRConnection = async () => {
    try {
      const connection = new SignalR.HubConnectionBuilder()
        .withUrl('${API_BASE_URL}/chatHub')
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveRoomMessage', message => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      await connection.start();
      connectionRef.current = connection;
      console.log('SignalR connection established');
    } catch (error) {
      console.error('Error establishing SignalR connection:', error);
    }
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
    const isSender = item.senderId === userId; // Compare senderId with userId
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
            {data.roomName}
          </CText>
          <CText color={colors.grayScale5} type={'r12'} numberOfLines={1}>
            {`Created on ${new Date(data.dateOfCreate).toDateString()}`}
          </CText>
        </View>
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={checkPlatform() === 'ios' ? moderateScale(50) : null}
        style={localStyles.contentMainStyle}
        behavior={checkPlatform() === 'ios' ? 'padding' : null}>
        <View style={styles.flex}>
          <FlatList
            data={messages}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
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
