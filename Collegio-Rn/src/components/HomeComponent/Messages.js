import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

// Custom imports
import { moderateScale } from '../../common/constants';
import CSafeAreaView from '../common/CSafeAreaView';
import CHeader from '../common/CHeader';
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import CText from '../common/CText';
import CInput from '../common/CInput';
import { StackNav } from '../../navigation/NavigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Messages({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chatsFetched, setChatsFetched] = useState(false);
  const [roomsFetched, setRoomsFetched] = useState(false);

  useEffect(() => {
    fetchChatsWithMessages();
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (chatsFetched && roomsFetched) {
      combineData(chats, rooms);
    }
  }, [chatsFetched, roomsFetched]);

  const fetchChatsWithMessages = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        const userIdInt = parseInt(storedUserId, 10);
        const messagesData = await fetchUserMessages(userIdInt);
        const userProfiles = await fetchUserProfiles(messagesData, userIdInt);
        const chatsData = groupMessagesByChat(messagesData, userProfiles, userIdInt);
        setChats(chatsData);
        setChatsFetched(true);
      }
    } catch (error) {
      console.error('Error fetching chats with messages:', error);
    }
  };

  const fetchUserMessages = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.6:7210/api/Message/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const messagesData = await response.json();
      return messagesData;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const fetchUserProfiles = async (messages, userId) => {
    const userIds = new Set();
    messages.forEach(message => {
      if (message.senderId !== userId && message.senderId !== null) {
        userIds.add(message.senderId);
      }
      if (message.recipientId !== userId && message.recipientId !== null) {
        userIds.add(message.recipientId);
      }
    });

    const profiles = {};
    for (const id of userIds) {
      try {
        const response = await fetch(`http://192.168.1.6:7210/api/User/${id}/profile`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const profile = await response.json();
        profiles[id] = profile;
      } catch (error) {
        console.error(`Error fetching user profile for ID ${id}:`, error);
      }
    }
    return profiles;
  };

  const groupMessagesByChat = (messages, profiles, userId) => {
    const chats = {};
    messages.forEach(message => {
      const chatId = message.senderId === userId ? message.recipientId : message.senderId;
      if (!chats[chatId]) {
        chats[chatId] = {
          id: chatId,
          messages: [],
          profile: profiles[chatId],
        };
      }
      chats[chatId].messages.push(message);
    });
    return Object.values(chats);
  };

  const fetchChatRooms = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        const userIdInt = parseInt(storedUserId, 10);
        const response = await fetch(`http://192.168.0.100:7210/api/ChatRoom/user/${userIdInt}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chat rooms');
        }
        const roomsData = await response.json();
        setRooms(roomsData);
        setRoomsFetched(true);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const combineData = (chatsData, roomsData) => {
    const combined = [...chatsData, ...roomsData.map(room => ({...room, isRoom: true}))];
    setCombinedData(combined);
    setFilteredData(combined);
  };

  const onChangeTextSearch = (item) => {
    setSearch(item);
    const filteredChats = combinedData.filter(data => {
      if (data.roomName) {
        return data.roomName.toLowerCase().includes(item.toLowerCase());
      } else if (data.profile) {
        return data.profile.fullName.toLowerCase().includes(item.toLowerCase());
      }
      return false;
    });
    setFilteredData(filteredChats);
  };

  const onPressMessage = (item) => {
    const userProfile = item.profile;
    navigation.navigate(StackNav.ChatScreen, {
      data: {
        id: userProfile.id,
        fullName: userProfile.fullName,
        profilePath: userProfile.profilePath,
        joinDate: userProfile.joinDate,
      },
    });
  };

  const onPressRoom = (room) => {
    navigation.navigate(StackNav.GroupChatScreen, {
      data: room, // Correctly pass the room data to GroupChatScreen
    });
  };

  const onPressAddButton = () => {
    navigation.navigate(StackNav.CreateChat); // Update this with your actual screen name
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        onPress={onPressAddButton}
        style={[localStyles.iconButton]}>
        <Ionicons
          name={'add'}
          size={moderateScale(24)}
          color={'#007BFF'} // Use a blue color directly for the icon
        />
      </TouchableOpacity>
    );
  };

  const rightAccessory = () => {
    return (
      <TouchableOpacity>
        <Ionicons
          name={'search-sharp'}
          size={moderateScale(24)}
          color={colors.dark ? colors.grayScale4 : colors.black}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    if (item.isRoom) {
      // Render chat room item
      return (
        <TouchableOpacity
          onPress={() => onPressRoom(item)}
          style={[
            localStyles.topContainerStyle,
            localStyles.containerTopStyle,
            { backgroundColor: colors.placeholderColor },
          ]}>
          <View style={localStyles.messageContent}>
            <Image source={{ uri: item.profilePath || 'default_profile_path' }} style={localStyles.messageContainer} />
            <View style={{ gap: moderateScale(5) }}>
              <View style={styles.flexRow}>
                <CText color={colors.mainColor} type={'b14'} numberOfLines={1}>
                  {item.roomName || 'Unknown Room'}
                </CText>
                {item.selected ? (
                  <View
                    style={[
                      localStyles.dotStyle,
                      { backgroundColor: colors.dotColor },
                    ]}
                  />
                ) : null}
              </View>
              <CText type={'r14'} numberOfLines={1}>
                {item.nbMembers} members
              </CText>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Render individual chat item
      const latestMessage = item.messages[item.messages.length - 1];
      return (
        <TouchableOpacity
          onPress={() => onPressMessage(item)}
          style={[
            localStyles.topContainerStyle,
            localStyles.containerTopStyle,
            { backgroundColor: colors.placeholderColor },
          ]}>
          <View style={localStyles.messageContent}>
            <Image source={{ uri: item.profile?.profilePath || 'default_profile_path' }} style={localStyles.messageContainer} />
            <View style={{ gap: moderateScale(5) }}>
              <View style={styles.flexRow}>
                <CText color={colors.mainColor} type={'b14'} numberOfLines={1}>
                  {item.profile?.fullName || 'Unknown'}
                </CText>
                {item.selected ? (
                  <View
                    style={[
                      localStyles.dotStyle,
                      { backgroundColor: colors.dotColor },
                    ]}
                  />
                ) : null}
              </View>
              <CText type={'r14'} numberOfLines={1}>
                {latestMessage.content}
              </CText>
            </View>
          </View>
          <CText type={'r14'} numberOfLines={1} color={colors.grayScale5}>
            {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </CText>
        </TouchableOpacity>
      );
    }
  };

  return (
    <CSafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={localStyles.container}
      >
        <View style={localStyles.innerContainer}>
          <CHeader title={strings.messages} rightIcon={<RightIcon />} />
          <CInput
            inputContainerStyle={[
              localStyles.inputContainerStyle,
              { shadowColor: colors.dark ? colors.black : colors.white },
            ]}
            placeHolder={strings.messagesPlaceHolder}
            placeholderTextColor={colors.grayScale4}
            rightAccessory={rightAccessory}
            value={search}
            onChangeText={onChangeTextSearch}
          />
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            bounces={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.mb20}
          />
        </View>
      </KeyboardAvoidingView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  iconButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(32),
  },
  topContainerStyle: {
    ...styles.p15,
    ...styles.mv10,
    borderRadius: moderateScale(15),
    ...Platform.select({
      ios: {
        shadowColor: '#1E9BD4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
        shadowColor: '#1E9BD4',
      },
    }),
  },
  imageContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  wrapContainer: {
    ...styles.p15,
    ...styles.mr10,
    borderRadius: moderateScale(15),
    ...styles.itemsCenter,
  },
  dotStyle: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  contentStyle: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    gap: moderateScale(5),
    ...styles.mt10,
  },
  messageContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  containerTopStyle: {
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  messageContent: {
    ...styles.flexRow,
    ...styles.flex,
    gap: moderateScale(10),
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(20), // Add padding to the sides
  },
});
