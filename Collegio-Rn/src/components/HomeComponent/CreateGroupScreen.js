import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom imports
import { moderateScale , API_BASE_URL } from '../../common/constants';
import CSafeAreaView from '../common/CSafeAreaView';
import CHeader from '../common/CHeader';
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import CKeyBoardAvoidWrapper from '../common/CKeyBoardAvoidWrapper';
import CText from '../common/CText';
import CInput from '../common/CInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateGroupScreen({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('http://192.168.1.182:7210/api/User/all');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await response.json();
      console.log('Users fetched:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const onChangeTextSearch = item => {
    setSearch(item);
  };

  const toggleUserSelection = item => {
    if (selectedUsers.includes(item)) {
      setSelectedUsers(selectedUsers.filter(user => user !== item));
    } else {
      setSelectedUsers([...selectedUsers, item]);
    }
  };

  const createGroup = async () => {
      const creatorUserId = await AsyncStorage.getItem('userId');
      if (!creatorUserId) {
        console.error('No creator user ID found in AsyncStorage');
        return;
      }

      const formData = new FormData();
      formData.append('ChatRoomName', groupName);
      formData.append('CreatorUserId', parseInt(creatorUserId, 10));
      selectedUsers.forEach(user => {
        formData.append('UserIds', user.id);
      });
      formData.append('Image', null); // Assuming you're not uploading an image

      try {
        const response = await fetch('http://192.168.1.182:7210/api/ChatRoom/createandadd', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create chat room');
        }

        const chatRoom = await response.json();
        console.log('Chat room created:', chatRoom);

        navigation.navigate('GroupChatScreen', { data: chatRoom, selectedUserIds: selectedUsers.map(user => user.id) });
      } catch (error) {
        console.error('Error creating chat room:', error.message);
      }
    };


  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleUserSelection(item)}
        style={[
          localStyles.wrapContainer,
          { backgroundColor: isSelected ? colors.primaryLight : colors.pinnedColor },
        ]}>
        <Image source={{ uri: item.profilePath }} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText
            type={'m12'}
            numberOfLines={1}
            color={colors.grayScale5}
            align={'center'}>
            {item.fullName}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredUsers = users.filter(user => user.fullName?.toLowerCase().includes(search.toLowerCase()));

  const rightAccessory = () => (
    <Ionicons name="search" size={20} color={colors.grayScale4} />
  );

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper
        contentContainerStyle={localStyles.contentContainerStyle}>
        <CHeader title="Create Group" />
        <View style={localStyles.createGroupContainer}>
          <CInput
            inputContainerStyle={[
              localStyles.groupNameInputContainer,
              { shadowColor: colors.dark ? colors.black : colors.white },
            ]}
            placeHolder="Enter group name"
            placeholderTextColor={colors.grayScale4}
            value={groupName}
            toGetTextFieldValue={setGroupName}
          />
          <TouchableOpacity style={localStyles.createGroupButton} onPress={createGroup}>
            <CText type={'b14'} color={colors.white}>
              Create Group
            </CText>
          </TouchableOpacity>
        </View>
        <CInput
          inputContainerStyle={[
            localStyles.inputContainerStyle,
            { shadowColor: colors.dark ? colors.black : colors.white },
          ]}
          placeHolder="Search for the user"
          placeholderTextColor={colors.grayScale4}
          rightAccessory={rightAccessory}
          value={search}
          toGetTextFieldValue={onChangeTextSearch}
        />
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          contentContainerStyle={styles.mb20}
        />
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  wrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...styles.p15,
    ...styles.mb10,
    borderRadius: moderateScale(15),
    ...styles.itemsCenter,
  },
  imageContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(10),
  },
  contentStyle: {
    flex: 1,
    ...styles.flexRow,
    ...styles.itemsCenter,
    gap: moderateScale(5),
    ...styles.mt10,
  },
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  createGroupContainer: {
    ...styles.flexRow,
    ...styles.justifyBetween,
    ...styles.alignCenter,
    paddingBottom: moderateScale(10),
  },
  groupNameInputContainer: {
    flex: 1,
    width: moderateScale(200), // Fixed height
    height: moderateScale(45),
  },
  createGroupButton: {
    backgroundColor: '#0F5CA8',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(15),
    height: moderateScale(45),
    margin: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
