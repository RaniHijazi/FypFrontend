import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { styles } from '../../../themes';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import CText from '../../../components/common/CText';
import CButton from '../../../components/common/CButton';
import PopularCategory from '../../../components/HomeComponent/PopularCategory';
import CHeader from '../../../components/common/CHeader';
import { profileListData, userImageData } from '../../../api/constant';
import { moderateScale, screenWidth, API_BASE_URL } from '../../../common/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtherPersonProfile({ route }) {
  const { item, postUserId } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const [follow, setFollow] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          console.log('Retrieved userId:', userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    const fetchUserProfileById = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/User/${postUserId}/profile`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserProfile(data);
        console.log('Fetched user profile:', data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    const checkIfFollowing = async () => {
      try {
        console.log(`Checking if user ${userId} is following user ${postUserId}...`);
        const response = await fetch(`${API_BASE_URL}/api/User/${userId}/isFollowing/${postUserId}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const isFollowing = await response.json();
        setFollow(isFollowing);
        console.log('Follow status:', isFollowing);
      } catch (error) {
        console.error('There was a problem checking the follow status:', error);
      }
    };

    const fetchProfilePosts = async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Post/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
        console.log('Fetched posts:', data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (userId) {
      fetchUserProfileById();
      checkIfFollowing();
      fetchProfilePosts(postUserId);
    }
  }, [userId, postUserId]);

  const onPressFollow = async () => {
    try {
      const url = follow
        ? `${API_BASE_URL}/api/User/unfollow`
        : `${API_BASE_URL}/api/User/follow`;

      const requestBody = { followerId: userId, followedId: postUserId };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Update the local userProfile state
        setUserProfile(prevProfile => ({
          ...prevProfile,
          totalFollowers: follow ? prevProfile.totalFollowers - 1 : prevProfile.totalFollowers + 1,
        }));

        // Toggle follow state
        setFollow(!follow);
        console.log('Follow/unfollow operation successful:', !follow);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('There was a problem with the follow/unfollow operation:', error);
    }
  };

  const renderImgContainer = ({ item, index }) => (
    <View
      style={{
        zIndex: 10,
        left: moderateScale(index * -20),
      }}>
      <LinearGradient
        colors={[colors.primaryLight, colors.linearColor1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={localStyles.imgContainer}>
        <Image source={item} style={[localStyles.userImgContainerStyle]} />
      </LinearGradient>
    </View>
  );

  const RenderComponent = ({ title, text }) => (
    <TouchableOpacity
      style={[
        localStyles.mainContentStyle,
        { backgroundColor: colors.placeholderColor },
      ]}>
      <CText
        type={'m14'}
        align={'center'}
        style={styles.mv5}
        numberOfLines={1}>
        {title}
      </CText>
      <CText
        type={'m14'}
        align={'center'}
        style={styles.mb10}
        color={colors.mainColor}
        numberOfLines={1}>
        {text}
      </CText>
    </TouchableOpacity>
  );

  if (!userProfile) {
    return (
      <CSafeAreaView>
        <CText>Loading...</CText>
      </CSafeAreaView>
    );
  }

  return (
    <CSafeAreaView>
      <ScrollView
        contentContainerStyle={styles.pb20}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <ImageBackground
          source={images.profileBanner}
          style={localStyles.bannerStyle}>
          <CHeader style={styles.p15} />
          <LinearGradient
            colors={[colors.primaryLight, colors.linearColor1]}
            start={{ x: 0, y: 0 }}
            style={localStyles.itemInnerContainer}>
            <Image source={{ uri: userProfile.profilePath }} style={localStyles.userImgStyle} />
          </LinearGradient>
        </ImageBackground>
        <View style={styles.ph20}>
          <CText
            type={'b18'}
            align={'center'}
            style={localStyles.contentStyle}
            numberOfLines={1}
            color={colors.mainColor}>
            {userProfile.fullName}
          </CText>
          <CText
            type={'m14'}
            align={'center'}
            style={styles.mv10}
            numberOfLines={1}
            color={colors.grayScale5}>
            {userProfile.bio}
          </CText>
          <CText
            type={'m14'}
            align={'center'}
            style={styles.mb10}
            numberOfLines={1}
            color={colors.mainColor}>
            {userProfile.role}
          </CText>
          <View style={styles.rowSpaceBetween}>
            <RenderComponent title={userProfile.totalFollowers} text={'Followers'} />
            <RenderComponent title={userProfile.totalFollowing} text={'Following'} />
            <CButton
              title={follow ? strings.following : strings.follow}
              textType={'s14'}
              containerStyle={styles.ph25}
              onPress={onPressFollow}
            />
          </View>
          <View
            style={[
              localStyles.eventStyle,
              { backgroundColor: colors.placeholderColor },
            ]}>
            <FlatList
              data={userImageData}
              renderItem={renderImgContainer}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={5}
            />
            <View>
              <CText type={'r12'} numberOfLines={1} color={colors.mainColor}>
                {strings.followedBy} <CText>{strings.sofiaJon}</CText>
                <CText color={colors.mainColor}>{strings.and}</CText>
                <CText>{strings.others}</CText>
              </CText>
            </View>
          </View>
          <PopularCategory
            chipsData={profileListData}
            textColor={colors.primaryLight}
            bgColor={colors.placeholderColor}
          />
          <FlatList
            data={posts}
            renderItem={({ item }) => <PostComponent item={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  bannerStyle: {
    width: screenWidth,
    height: moderateScale(170),
  },
  userImgStyle: {
    width: moderateScale(150),
    height: moderateScale(150),
    borderWidth: moderateScale(5),
    borderRadius: moderateScale(100),
  },
  itemInnerContainer: {
    padding: moderateScale(3),
    borderRadius: moderateScale(100),
    position: 'absolute',
    left: '30%',
    top: '50%',
  },
  contentStyle: {
    marginTop: '22%',
  },
  mainContentStyle: {
    borderRadius: moderateScale(15),
    ...styles.ph15,
    ...styles.pv5,
  },
  userImgContainerStyle: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(15),
  },
  eventStyle: {
    borderRadius: moderateScale(50),
    ...styles.p10,
    ...styles.rowCenter,
  },
  imgContainer: {
    borderRadius: moderateScale(15),
    padding: moderateScale(2),
  },
});
