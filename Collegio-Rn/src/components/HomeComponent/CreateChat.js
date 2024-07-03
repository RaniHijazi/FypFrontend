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
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function CreateChat({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const retrieveCurrentUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setCurrentUserId(userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveCurrentUserId();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('http://192.168.1.7:7210/api/User/all');
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

  const onPressUser = item => {
    navigation.navigate(StackNav.ChatScreen, { data: item });
  };

  const onPressCreateGroup = () => {
    navigation.navigate(StackNav.CreateGroupScreen, { users });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressUser(item)}
        style={[
          localStyles.wrapContainer,
          { backgroundColor: colors.pinnedColor },
        ]}>
        <Image source={{ uri: item.profilePath }} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText
            type={'m12'}
            numberOfLines={1}
            color={colors.dark ? colors.white : colors.grayScale5}
            align={'center'}>
            {item.fullName}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredUsers = users.filter(user =>
    user.id !== currentUserId && user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const rightAccessory = () => (
    <Ionicons name="search" size={20} color={colors.grayScale4} />
  );

  return (
    <CSafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={localStyles.container}
      >
        <View style={localStyles.innerContainer}>
          <CHeader title="Create Chat" />
          <CInput
            inputContainerStyle={[
              localStyles.inputContainerStyle,
              { shadowColor: colors.dark ? colors.black : colors.white },
            ]}
            placeHolder="Search for the user"
            placeholderTextColor={colors.grayScale4}
            rightAccessory={rightAccessory}
            value={search}
            onChangeText={onChangeTextSearch}
          />
          <TouchableOpacity style={localStyles.createGroupButton} onPress={onPressCreateGroup}>
            <CText type={'b14'} color={colors.white}>
              Create Group
            </CText>
          </TouchableOpacity>
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={localStyles.flatListContent}
          />
        </View>
      </KeyboardAvoidingView>
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
    width: '100%',
    alignSelf: 'center',
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
  },
  inputContainerStyle: {
    borderRadius: moderateScale(32),
  },
  createGroupButton: {
    backgroundColor: '#0F5CA8',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    margin: moderateScale(15),
  },
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: moderateScale(20),
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(20), // Add padding to the sides
  },
});
