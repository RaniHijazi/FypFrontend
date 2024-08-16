import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList,LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import { moderateScale, API_BASE_URL  } from '../../../common/constants';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import ProfileComponent from '../../../components/ProfileComponent/ProfileComponent';
import { styles, colors } from '../../../themes';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  'Failed to complete negotiation with the server: TypeError: Network request failed',
  'Failed to start the connection: Error: Failed to complete negotiation with the server: TypeError: Network request failed',
  'Warning: Error from HTTP request. TypeError: Network request failed',
  'No data received from the server' // Ignoring this specific warning
]);
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
   setLoading(true);
   try {
     const response = await fetch(`http://192.168.1.182:7210/api/Post/user/${userId}`);
     if (response.ok) {
       const text = await response.text();
       if (text) {
         const data = JSON.parse(text);
         setPosts(data);
       } else {
         console.warn('No data received from the server');
         setPosts([]);
       }
     } else {
       console.error('Failed to fetch posts:', response.status);
       setPosts([]); // Ensure posts are reset in case of an error
     }
   } catch (error) {
     console.error('Error fetching posts:', error);
   } finally {
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

  const updatePostLikes = async (postId, newLikeCount) => {
    try {
      // Assuming there's an API to update likes on the server
      const response = await fetch(`${API_BASE_URL}/api/Post/updateLikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, newLikeCount }),
      });

      if (response.ok) {
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post.id === postId) {
              return { ...post, likesCount: newLikeCount };
            }
            return post;
          })
        );
      } else {
        console.error('Failed to update likes:', response.status);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
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
