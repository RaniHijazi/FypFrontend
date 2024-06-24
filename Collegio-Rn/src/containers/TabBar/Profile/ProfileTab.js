import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import { moderateScale, API_BASE_URL  } from '../../../common/constants';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import ProfileComponent from '../../../components/ProfileComponent/ProfileComponent';
import { styles, colors } from '../../../themes';

export default function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          console.log('Retrieved userId:', userIdInt);
          fetchProfilePosts(userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  const fetchProfilePosts = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (userId !== null) {
      fetchProfilePosts(userId);
    }
  };

  const renderItemPostData = ({ item }) => (
    <View style={styles.ph20}>
      <PostComponent item={item} userId={userId} updatePostLikes={updatePostLikes} />
    </View>
  );

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

  const ListHeaderComponent = () => (
    <View>
      <CHeader title="Your Profile" />
      <ProfileComponent />
    </View>
  );

  return (
    <CSafeAreaView>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItemPostData}
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
  contentContainerStyle: {
    paddingBottom: moderateScale(80),
  },
});
