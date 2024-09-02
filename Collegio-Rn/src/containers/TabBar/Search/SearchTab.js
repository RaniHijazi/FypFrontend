import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FlatList, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CInput from '../../../components/common/CInput';
import { styles } from '../../../themes';
import { moderateScale, screenWidth, API_BASE_URL } from '../../../common/constants';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import { popularCategoriesData } from '../../../api/constant';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import { StackNav, TabNav } from '../../../navigation/NavigationKeys';
import PopularCategory from '../../../components/HomeComponent/PopularCategory';
import PostComponent from '../../../components/HomeComponent/PostComponent'; // Adjust the import path as needed

export default function SearchTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(strings.all);
  const [profileResults, setProfileResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [userId, setUserId] = useState(null);
  const [communityId, setCommunityId] = useState(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          fetchUserById(userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    const fetchUserById = async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/User/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setCommunityId(userData.communityId);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (selectedCategory === strings.profiles) {
      handleSearchProfiles();
    } else if (selectedCategory === strings.posts) {
      handleSearchPosts();
    } else if (selectedCategory === strings.all) {
      handleSearchAll();
    }
  }, [selectedCategory]);

  const onChangeTextSearch = text => {
    setSearch(text);
  };

  const onPressUserProfile = item => {
    if (userId === item.userId) {
      navigation.navigate(TabNav.ProfileTab);
    } else {
      navigation.navigate(StackNav.OtherPersonProfile, { item: item, postUserId: item.userId });
    }
  };

  const onPressUserProfileInSearch = item => {
    navigation.navigate(StackNav.OtherPersonProfile, { item: item, postUserId: item.id });
  };

  const rightAccessory = () => {
    return (
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons
          name={'search-sharp'}
          size={moderateScale(24)}
          color={colors.dark ? colors.grayScale4 : colors.black}
        />
      </TouchableOpacity>
    );
  };

  const handleSearch = () => {
    setIsSearched(true);
    if (selectedCategory === strings.profiles) {
      handleSearchProfiles();
    } else if (selectedCategory === strings.posts) {
      handleSearchPosts();
    } else if (selectedCategory === strings.all) {
      handleSearchAll();
    }
  };

  const handleSearchProfiles = async () => {
    try {
      const response = await fetch(`http://172.20.10.3:7210/api/User/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      const data = await response.json();
      const filteredData = data.filter(user =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
      );
      setProfileResults(filteredData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSearchPosts = async () => {
    if (!communityId) {
      console.log('Community ID is not set');
      return;
    }
    try {
      const response = await fetch(`http://172.20.10.3:7210/api/Post/PrePosts?PreCommunityId=${communityId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      const filteredData = data.filter(post =>
        post.userFullName.toLowerCase().includes(search.toLowerCase())
      );
      setPostResults(filteredData);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const handleSearchAll = () => {
    handleSearchProfiles();
    handleSearchPosts();
  };

  const updatePostLikes = (postId, newLikesCount) => {
    const updatedPosts = postResults.map(post => {
      if (post.id === postId) {
        return { ...post, likesCount: newLikesCount };
      }
      return post;
    });
    setPostResults(updatedPosts);
  };

  const renderUserItem = ({ item }) => {
    return (
      <TouchableOpacity style={localStyles.userContainer} onPress={() => onPressUserProfileInSearch(item)}>
        <Image
          source={{ uri: item.profilePath || 'https://via.placeholder.com/40' }}
          style={localStyles.userImage}
        />
        <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
          {item.fullName}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderPostComponent = ({ item }) => {
    return (
      <PostComponent
        item={item}
        onPress={() => onPressUserProfile(item)}
        userId={userId}
        updatePostLikes={updatePostLikes}
      />
    );
  };

  const renderSearchResults = () => {
    if (!isSearched) {
      return (
        <View style={localStyles.noResultsContainer}>
          <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
            Nothing searched
          </CText>
        </View>
      );
    }

    if (selectedCategory === strings.profiles) {
      if (profileResults.length === 0) {
        return (
          <View style={localStyles.noResultsContainer}>
            <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
              Results not found
            </CText>
          </View>
        );
      }
      return (
        <FlatList
          data={profileResults}
          renderItem={renderUserItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.contentContainerStyle}
        />
      );
    }

    if (selectedCategory === strings.posts) {
      if (postResults.length === 0) {
        return (
          <View style={localStyles.noResultsContainer}>
            <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
              Results not found
            </CText>
          </View>
        );
      }
      return (
        <FlatList
          data={postResults}
          renderItem={renderPostComponent}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.contentContainerStyle}
        />
      );
    }

    if (selectedCategory === strings.all) {
      return (
        <View>
          <CText type={'b16'} color={colors.dark ? colors.white : colors.black} style={styles.mb10}>
            Profiles
          </CText>
          {profileResults.length === 0 ? (
            <View style={localStyles.noResultsContainer}>
              <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
                Results not found
              </CText>
            </View>
          ) : (
            <FlatList
              data={profileResults}
              renderItem={renderUserItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={localStyles.contentContainerStyle}
            />
          )}
          <CText type={'b16'} color={colors.dark ? colors.white : colors.black} style={styles.mb10}>
            Posts
          </CText>
          {postResults.length === 0 ? (
            <View style={localStyles.noResultsContainer}>
              <CText type={'b16'} color={colors.dark ? colors.white : colors.black}>
                Results not found
              </CText>
            </View>
          ) : (
            <FlatList
              data={postResults}
              renderItem={renderPostComponent}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={localStyles.contentContainerStyle}
            />
          )}
        </View>
      );
    }
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.p20}>
          <CInput
            inputContainerStyle={[
              localStyles.inputContainerStyle,
              { shadowColor: colors.dark ? colors.black : colors.white },
            ]}
            placeHolder={strings.searchPlaceholder}
            placeholderTextColor={colors.grayScale4}
            rightAccessory={rightAccessory}
            value={search}
            onChangeText={onChangeTextSearch}
            onSubmitEditing={handleSearch} // Trigger search on enter key press
          />
          <CText
            type={'b16'}
            color={colors.dark ? colors.white : colors.black}
            numberOfLines={1}
            style={styles.mt10}>
            {strings.popular}
          </CText>
          <View
            style={[
              localStyles.popularContainer,
              { backgroundColor: colors.placeholderColor },
            ]}>
            <PopularCategory
              chipsData={popularCategoriesData}
              bgColor={colors.mainColor}
              textColor={colors.dark ? colors.black : colors.white}
              onSelectCategory={setSelectedCategory} // Pass the callback function to update selectedCategory
            />
          </View>
          {renderSearchResults()}
        </View>
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(32),
    ...styles.itemsCenter,
  },
  popularContainer: {
    borderRadius: moderateScale(50),
    ...styles.ph10,
    ...styles.mv25,
    width: screenWidth - moderateScale(10),
  },
  contentContainerStyle: {
    paddingBottom: moderateScale(55),
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(10),
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
});
