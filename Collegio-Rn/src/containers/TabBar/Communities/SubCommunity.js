import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderComponent from './HeaderComponent'; // Adjust the path if necessary
import PostComponent from '../../../components/HomeComponent/PostComponent';
import Octicons from 'react-native-vector-icons/Octicons';
import { StackNav } from '../../../navigation/NavigationKeys';

const SubCommunity = ({ route, navigation }) => {
  const { communityId, imageUrl, name, nbMembers: initialNbMembers, description, onJoinLeave } = route.params;
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [nbMembers, setNbMembers] = useState(initialNbMembers);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          checkUserMembership(userIdInt, communityId); // Check membership status
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, [communityId]);

  const checkUserMembership = async (userId, communityId) => {
    try {
      const response = await fetch(`http://192.168.1.182:7210/api/Community/IsUserMemberOfSubCommunity?userId=${userId}&subCommunityId=${communityId}`);
      const data = await response.json();
      setIsJoined(data.isMember);
    } catch (error) {
      console.error('Error checking membership status:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://192.168.1.182:7210/api/Post/PreSubPosts?subCommunityId=${communityId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [communityId]);

  const onPressUserProfile = item => {
    if (userId === item.userId) {
      navigation.navigate('ProfileTab'); // Adjust navigation as necessary
    } else {
      navigation.navigate('OtherPersonProfile', { item: item, postUserId: item.userId }); // Adjust navigation as necessary
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

  const handleJoinCommunity = async () => {
    try {
      console.log(`Joining community: userId=${userId}, subCommunityId=${communityId}`);
      const response = await fetch(`http://192.168.1.182:7210/api/Community/AddUserToSubCommunity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          subCommunityId: communityId,
        }),
      });

      if (response.ok) {
        setIsJoined(true);
        setNbMembers(prevCount => prevCount + 1); // Increase member count
        onJoinLeave(); // Call the callback function to refresh communities
      } else {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        Alert.alert('Error', errorText || 'An error occurred while joining the community.');
      }
    } catch (error) {
      console.error('Error joining community:', error);
      Alert.alert('Error', 'An error occurred while joining the community.');
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const apiUrl = `http://192.168.1.182:7210/api/Community/RemoveUserFromSubCommunity?UserId=${userId}&SubCommunityId=${communityId}`;

      console.log('Leaving community with API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setIsJoined(false);
        setNbMembers(prevCount => prevCount - 1); // Decrease member count
        onJoinLeave(); // Call the callback function to refresh communities
        Alert.alert('Success', 'You have successfully left the community.');
      } else {
        console.error('Response error text:', responseData.message);
        Alert.alert('Error', responseData.message || 'An error occurred while leaving the community.');
      }
    } catch (error) {
      console.error('Error leaving community:', error);
      Alert.alert('Error', 'An error occurred while leaving the community.');
    }
  };

  const renderPostComponent = ({ item }) => {
    return (
      <PostComponent item={item} onPress={() => onPressUserProfile(item)} userId={userId} updatePostLikes={updatePostLikes} />
    );
  };

  const navigateToAddPost = () => {
    navigation.navigate(StackNav.AddSubPostTab, { communityId });
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        imageUrl={imageUrl}
        name={name}
        nbMembers={nbMembers}
        description={description}
        isJoined={isJoined}
        onJoinPress={isJoined ? handleLeaveCommunity : handleJoinCommunity} // Toggle join/leave action
      />
      {isJoined ? (
        <FlatList
          data={posts}
          renderItem={renderPostComponent}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.content}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Click on join to explore our community</Text>
        </View>
      )}
      {isJoined && (
        <TouchableOpacity
          style={[styles.addPostButton, { backgroundColor: '#007BFF' }]}
          onPress={navigateToAddPost}
        >
          <Octicons name={'plus'} size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
});

export default SubCommunity;
