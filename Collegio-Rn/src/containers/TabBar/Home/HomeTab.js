import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// Custom imports
import { TabNav } from '../../../navigation/NavigationKeys.js';
import { StackNav } from '../../../navigation/NavigationKeys';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import CProgressbar from '../../../components/common/CProgressbar';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import { SendIcon } from '../../../assets/svgs';
import { moderateScale, screenWidth, API_BASE_URL } from '../../../common/constants';
import images from '../../../assets/images';
import PostComponent from '../../../components/HomeComponent/PostComponent';

export default function HomeTab({ navigation, route }) {
  const colors = useSelector(state => state.theme.theme);
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [groupedStories, setGroupedStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [communityId, setCommunityId] = useState(null);
  const [profilePath, setProfilePath] = useState(null);

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();
      setCommunityId(userData.communityId);
      setProfilePath(userData.profilePath);
      fetchPrePosts(userData.communityId);
      fetchUserStories(id); // Fetch user-specific stories
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPrePosts = async (communityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/PrePosts?PreCommunityId=${communityId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStories = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${userId}/getFollowingStories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
      }
      const data = await response.json();

      // Verify and filter out stories with missing essential fields
      const filteredData = data.filter(story => story.userId && story.userFullName && story.userProfileImageUrl && story.stories);

      setStories(filteredData);
      groupStoriesByUser(filteredData);
    } catch (error) {
      console.error('Error fetching stories:', error.message);
    }
  };

  const fetchUserStories = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${userId}/stories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user stories: ${response.statusText}`);
      }
      const data = await response.json();
      // Add userId and userProfileImageUrl to each story
      const userStoriesWithUserId = data.map(story => ({
        ...story,
        userId: userId,
        userProfileImageUrl: profilePath, // Assuming profilePath is the user's profile image URL
      }));

      setUserStories(userStoriesWithUserId);
    } catch (error) {
      console.error('Error fetching user stories:', error.message);
    }
  };



  const groupStoriesByUser = (stories) => {
    const grouped = stories.reduce((acc, user) => {
      const userId = user.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userId: userId,
          userFullName: user.userFullName,
          userProfileImageUrl: user.userProfileImageUrl,
          stories: [],
        };
      }
      user.stories.forEach(story => {
        acc[userId].stories.push({
          id: story.id,
          storyPath: story.storyPath,
          createdAt: story.createdAt,
        });
      });
      return acc;
    }, {});

    setGroupedStories(Object.values(grouped));
  };

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          fetchUserById(userIdInt);
          fetchStories(userIdInt);
          fetchUserStories(userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (isFocused && userId) {
      if (communityId) {
        fetchPrePosts(communityId);
      } else {
        fetchUserById(userId);
      }
      fetchStories(userId);
      fetchUserStories(userId);
    }
  }, [isFocused, route.params?.refresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (communityId) {
      fetchPrePosts(communityId);
    } else if (userId) {
      fetchUserById(userId);
    }
    if (userId) {
      fetchStories(userId);
      fetchUserStories(userId);
    }
  };

  const updatePostLikes = (postId, newLikeCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return { ...post, likesCount: newLikeCount };
        }
        return post;
      })
    );
  };

  const onPressUserProfile = item => {
    if (userId === item.userId) {
      navigation.navigate(TabNav.ProfileTab);
    } else {
      navigation.navigate(StackNav.OtherPersonProfile, { item: item, postUserId: item.userId });
    }
  };

  const onPressSendIcon = () => {
    navigation.navigate(StackNav.Messages);
  };

  const onPressStory = user => {
    const initialUserIndex = groupedStories.findIndex(u => u.userId === user.userId);
    if (initialUserIndex !== -1 || user.userId === userId) {
      // If it's the current user's story, create a groupedStories entry for them
      const userStoriesEntry = {
        userId,
        userFullName: 'Your story',
        userProfileImageUrl: profilePath,
        stories: userStories,
      };
      const allStories = initialUserIndex !== -1 ? groupedStories : [userStoriesEntry, ...groupedStories];
      const index = initialUserIndex !== -1 ? initialUserIndex : 0;

      navigation.navigate(StackNav.StoryView, {
        users: allStories,
        initialUserIndex: index,
      });
    } else {
      console.error('User not found in groupedStories:', user);
    }
  };


  const AddPostIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.AddPostIconStyle, { backgroundColor: colors.black }]}>
        <Octicons
          name={'plus'}
          size={moderateScale(12)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const renderPostComponent = ({ item }) => {
    return (
      <PostComponent item={item} onPress={() => onPressUserProfile(item)} userId={userId} updatePostLikes={updatePostLikes} />
    );
  };

  const renderItem = ({ item, index }) => {
    if (index === 0) {

      if (userStories.length > 0) {
        return (
          <TouchableOpacity
            onPress={() => onPressStory({ userId, userFullName: "Your story", userProfileImageUrl: profilePath, stories: userStories })}
            style={localStyles.addPostContainer}
          >
            <Image
              source={profilePath ? { uri: profilePath } : images.userImage1}
              style={localStyles.adminImageStyle}
            />
            <Text style={localStyles.userFullName}>Your story</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={localStyles.addPostContainer}>
            <Image
              source={profilePath ? { uri: profilePath } : images.userImage1}
              style={localStyles.adminImageStyle}
            />
            <AddPostIcon />
            <Text style={localStyles.userFullName}>Your story</Text>
          </View>
        );
      }
    }
    return (
      <TouchableOpacity
        style={localStyles.mainStoryStyle}
        onPress={() => onPressStory(item)}
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.linearColor1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.itemInnerContainer}
        >
          <Image
            source={{ uri: item.userProfileImageUrl }}
            style={[
              localStyles.imgContainer,
              {
                borderColor: colors.addPostBtn,
              },
            ]}
          />
        </LinearGradient>
        <Text style={localStyles.userFullName}>{item.userFullName}</Text>
      </TouchableOpacity>
    );
  };

  const progress = 25;

  const ListHeaderComponent = () => {
    const navigateToProfile = () => {
      navigation.navigate(TabNav.ProfileTab);
    };

    return (
      <View>
        <View style={styles.rowSpaceBetween}>
          <Image
            source={images.FullUaLogo}
            style={localStyles.logoContainer}
          />
          <View style={localStyles.progressContainer}>
            <CProgressbar progress={progress} />
          </View>
          <TouchableOpacity onPress={navigateToProfile} style={styles.ml10}>
            <Image
              source={profilePath ? { uri: profilePath } : null}
              style={localStyles.ProfileimgContainer}
            />
          </TouchableOpacity>
          <View style={localStyles.sendIconContainer}>
            <TouchableOpacity onPress={onPressSendIcon}>
              <SendIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            localStyles.storyContainer,
            { backgroundColor: colors.placeholderColor },
          ]}>
          <FlatList
            data={[{}, ...groupedStories]} // Add an empty object to render "Add Post" as the first item
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
          />
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostComponent}
          ListHeaderComponent={<ListHeaderComponent />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.contentContainerStyle}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imgContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(25),
  },
  ProfileimgContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(25),
    marginLeft: moderateScale(3),
  },
  logoContainer: {
    width: moderateScale(125),
    height: moderateScale(65),
    borderWidth: moderateScale(4),
    marginLeft: moderateScale(5),
  },
  storyContainer: {
    height: moderateScale(95),
    borderRadius: moderateScale(10),
    ...styles.ph15,
    ...styles.mv25,
  },
  mainStoryStyle: {
    ...styles.mr10,
    alignItems: 'center',
    marginTop: moderateScale(12),
  },
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(50),
  },
  adminImageStyle: {
    width: moderateScale(58),
    height: moderateScale(58),
    borderRadius: moderateScale(29),
    marginTop: moderateScale(16),
  },
  AddPostIconStyle: {
    height: moderateScale(16),
    width: moderateScale(16),
    borderRadius: moderateScale(20),
    position: 'absolute',
    bottom: 10,
    right: 0,
    ...styles.center,
  },
  addPostContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(58),
    height: moderateScale(80),
    marginRight: moderateScale(10),
    marginBottom: moderateScale(20),
  },
  contentContainerStyle: {
    ...styles.p15,
    paddingBottom: moderateScale(75),
  },
  sendIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressContainer: {
    alignSelf: 'flex-start',
    width: '28%',
    marginTop: 5,
    marginLeft: 15,
  },
  userFullName: {
    marginTop: moderateScale(5),
    color: '#000',
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
});
