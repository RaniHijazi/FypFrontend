import { StackNav } from '../../../navigation/NavigationKeys';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import CText from '../../../components/common/CText';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { moderateScale, API_BASE_URL } from '../../../common/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import AddCommunityTab from './AddCommunityTab'; // Import AddCommunityTab component

export default function CommunitiesTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme) || {};
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [communities, setCommunities] = useState([]);
  const [exploreCommunities, setExploreCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showAddCommunityModal, setShowAddCommunityModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          fetchUserById(userIdInt);
          console.log('Retrieved userId:', userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (communityId) {
      fetchCommunities(communityId);
      if (activeTab === 'Explore') {
        fetchPrePosts(communityId);
      }
    }
  }, [communityId, activeTab]);

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

  const fetchCommunities = async (preCommunityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Community/subCommunities?preCommunityId=${preCommunityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchPrePosts = async (communityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/subcommunity-posts?preCommunityId=${communityId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data.reverse()); // Reverse the posts array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setLoading(false);
    }
  };

  const onChangeTextSearch = text => {
    setSearch(text);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(StackNav.SubCommunity, {
          communityId: item.id,
          imageUrl: item.imageUrl,
          name: item.name,
          nbMembers: item.nbMembers,
          description: item.description,
          onJoinLeave: handleJoinLeave // Pass the callback function as a prop
        })}
        style={[
          localStyles.wrapContainer,
          {
            backgroundColor: colors.dark ? colors.pinnedColor : colors.white,
            shadowColor: colors.dark ? colors.black : '#ccc',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3
          },
        ]}
      >
        <Image source={{ uri: item.imageUrl }} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText type="m16" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {item.name}
          </CText>
          <CText type="r14" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {`${item.nbMembers} Members`}
          </CText>
          <CText type="r14" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {item.description}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPostComponent = ({ item, index }) => {
    return (
      <View style={[localStyles.postContainer, index === 0 && localStyles.firstPostContainer]}>
        <PostComponent item={item} onPress={() => { }} userId={userId} updatePostLikes={(postId, newLikeCount) => {
          setPosts(prevPosts =>
            prevPosts.map(post => {
              if (post.id === postId) {
                return { ...post, likesCount: newLikeCount };
              }
              return post;
            })
          );
        }} />
      </View>
    );
  };

  const filteredCommunities = activeTab === 'Home'
    ? communities.filter(community => community.name.toLowerCase().includes(search.toLowerCase()))
    : exploreCommunities.filter(community => community.name.toLowerCase().includes(search.toLowerCase()));

  const navigateToAddPost = () => {
    setShowAddCommunityModal(true); // Show the modal
  };

  // Callback function to refetch communities
  const handleJoinLeave = useCallback(() => {
    if (communityId) {
      fetchCommunities(communityId);
    }
  }, [communityId]);

  return (
    <CSafeAreaView style={[localStyles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Communities"
        navigation={navigation}
        searchQuery={search}
        onSearchChange={onChangeTextSearch}
        colors={colors}
      />
      <View style={localStyles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Home')} style={[localStyles.tab, activeTab === 'Home' && { borderBottomColor: colors.primary }]}>
          <CText type="b16" color={activeTab === 'Home' ? colors.primary : colors.text}>Home</CText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Explore')} style={[localStyles.tab, activeTab === 'Explore' && { borderBottomColor: colors.primary }]}>
          <CText type="b16" color={activeTab === 'Explore' ? colors.primary : colors.text}>Explore</CText>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredCommunities}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={localStyles.flatListContentContainer}
          ListFooterComponent={
            activeTab === 'Explore' && posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderPostComponent}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={localStyles.postsContentContainerStyle}
              />
            ) : null
          }
        />
      )}
      <TouchableOpacity
        style={[localStyles.addPostButton, { backgroundColor: colors.primary }]}
        onPress={navigateToAddPost}>
        <Octicons name={'plus'} size={moderateScale(20)} color={colors.white} />
      </TouchableOpacity>

      <Modal
        visible={showAddCommunityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCommunityModal(false)}
      >
        <View style={localStyles.modalContainer}>
          <AddCommunityTab navigation={navigation} />
        </View>
      </Modal>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: moderateScale(10),
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  wrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    marginVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  flatListContentContainer: {
    paddingBottom: moderateScale(20),
  },
  postsContentContainerStyle: {
    paddingHorizontal: moderateScale(14), // Add padding to the sides
    paddingBottom: moderateScale(20),
  },
  postContainer: {
    marginHorizontal: moderateScale(14), // Add margin to the sides of each post
    marginBottom: moderateScale(7), // Optional: Add margin between posts
  },
  firstPostContainer: {
    marginTop: moderateScale(20), // Add margin to the top of the first post
  },
  addPostButton: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});
