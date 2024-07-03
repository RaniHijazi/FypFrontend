import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';


import { styles } from '../../themes';

import { moderateScale, screenWidth, API_BASE_URL } from '../../common/constants';
import CText from '../common/CText';
import { Comment, Like, Share } from '../../assets/svgs';
import { StackNav } from '../../navigation/NavigationKeys';

export default function PostComponent({ item, onPress, userId, updatePostLikes }) {
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(false); // Initialize isSaved with false
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const colors = useSelector(state => state.theme.theme);

  const checkIfLiked = async () => {
    try {
      console.log(userId);
       console.log(item);
      const response = await fetch(`${API_BASE_URL}/api/Post/${item.id}/hasLiked?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to check if post is liked');
      }
      const hasLiked = await response.json();
      setLiked(hasLiked);
      setLoading(false);
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      setLoading(false);
    }
  };

  const likePost = async () => {
    try {
          const response = await fetch(`${API_BASE_URL}/api/Post/LikePost?post_id=${item.id}&user_id=${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      updatePostLikes(item.id, item.likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const dislikePost = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/DislikePost?post_id=${item.id}&user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error('Failed to dislike post');
      }
      updatePostLikes(item.id, item.likesCount - 1);
    } catch (error) {
      console.error('Error disliking post:', error);

    }
  };

  useEffect(() => {
    checkIfLiked();
  }, []);

  const onPressIsSaved = () => {
    setIsSaved(!isSaved);
  };

  const onPressLiked = async () => {
    setLoading(true);
    if (liked) {
      await dislikePost();
      setLiked(false);
    } else {
      await likePost();
      setLiked(true);
    }
    setLoading(false);
  };

  const onPressViewPost = () => {
    navigation.navigate(StackNav.ViewPost, { item, userId });
  };

  const RenderComment = ({ icon, text, onPress }) => {
    return (
      <TouchableOpacity style={localStyles.contentStyle} onPress={onPress}>
        {icon}
        <CText
          type={'s12'}
          numberOfLines={1}
          color={colors.dark ? colors.white : colors.black}>
          {text}
        </CText>
      </TouchableOpacity>
    );
  };

  const RenderLikeComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLiked} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <AntDesign
            name={liked ? 'like1' : 'like2'}
            size={moderateScale(16)}
            color={colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        localStyles.topContainerStyle,
        { backgroundColor: colors.placeholderColor },
      ]}
    >
      <View style={localStyles.mainContainer}>
        <TouchableOpacity style={styles.flexRow} onPress={onPress}>
          <Image source={{ uri: item.userProfileImageUrl }} style={localStyles.postImgStyle} />
          <View>
            <CText
              type={'b14'}
              color={colors.dark ? colors.white : colors.black}
              numberOfLines={1}
            >
              {item.userFullName}
            </CText>
            <CText color={colors.grayScale5} numberOfLines={1} type={'m12'}>
              {item.timestamp}
            </CText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressViewPost}>
          <MaterialCommunityIcons
            name={'dots-vertical'}
            size={moderateScale(30)}
            color={colors.dark ? colors.primary : colors.black}
          />
        </TouchableOpacity>
      </View>
      {item.description ? (
        <CText
          type={'r16'}
          style={styles.mv10}
          numberOfLines={3}
          color={colors.dark ? colors.white : colors.black}
        >
          {item.description}
        </CText>
      ) : null}
      {item.imageUrl && (
        <View>
          <Image
            source={{ uri: item.imageUrl }}
            style={localStyles.postMainImgStyle}
          />
          <View style={styles.rowCenter}>
            <View
              style={[
                localStyles.bottomIndicatorStyle,
                {
                  width: moderateScale(4),
                  backgroundColor: colors.dark ? colors.primary : colors.black,
                },
              ]}
            />
          </View>
        </View>
      )}
      <View style={styles.rowSpaceBetween}>
        <View style={localStyles.contentStyle}>
          <RenderComment icon={<RenderLikeComponent />} text={item.likesCount} />
          <RenderComment
            icon={<Comment />}
            text={item.commentsCount}
            onPress={onPressViewPost}
          />
          <RenderComment icon={<Share />} text={item.shareCount} />
        </View>
        <TouchableOpacity onPress={onPressIsSaved}>
          <MaterialCommunityIcons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={moderateScale(22)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  topContainerStyle: {
    ...styles.p15,
    borderRadius: moderateScale(10),
    ...styles.mb20,
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
  contentStyle: {
    ...styles.flexRow,
    gap: moderateScale(10),
    ...styles.mt10,
  },
  postMainImgStyle: {
    width: screenWidth - moderateScale(80),
    height: moderateScale(158),
    borderRadius: moderateScale(16),
    ...styles.mr10,
    ...styles.mv10,
  },
  mainContainer: {
    ...styles.flexRow,
    ...styles.justifyBetween,
    ...styles.mv10,
  },
  postImgStyle: {
    height: moderateScale(32),
    width: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.mr10,
  },
  bottomIndicatorStyle: {
    height: moderateScale(4),
    borderRadius: moderateScale(10),
    ...styles.mh5,
    ...styles.mt10,
  },
});
