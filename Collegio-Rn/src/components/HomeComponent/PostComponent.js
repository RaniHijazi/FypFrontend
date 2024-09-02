import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { styles } from '../../themes';
import { moderateScale, screenWidth, API_BASE_URL } from '../../common/constants';
import CText from '../common/CText';
import { Comment, Like, Share, GoldBadge, BlueBadge, GreenBadge, PinkBadge, RedBadge } from '../../assets/svgs';
import { StackNav } from '../../navigation/NavigationKeys';

export default function PostComponent({ item, onPress, userId, updatePostLikes, onImagePress, onDelete }) {
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for modal visibility

  const colors = useSelector(state => state.theme.theme);

  const checkIfLiked = async () => {
    try {
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

  const deletePost = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/DeletePost?post_id=${item.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      console.log('Post deleted successfully');
      setShowDeleteModal(false);

      // Call the onDelete callback to refresh the list or page
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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

  const onPressDelete = () => {
    setShowDeleteModal(true); // Show the delete modal
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

  const renderBadge = (level) => {
    switch (level) {
      case 1:
        return (
          <View style={localStyles.badge}>
            <PinkBadge />
          </View>
        );
      case 2:
        return (
          <View style={localStyles.badge}>
            <GreenBadge />
          </View>
        );
      case 3:
        return (
          <View style={localStyles.badge}>
            <RedBadge />
          </View>
        );
      case 4:
        return (
          <View style={localStyles.badge}>
            <GoldBadge />
          </View>
        );
      case 5:
        return (
          <View style={localStyles.badge}>
            <BlueBadge />
          </View>
        );
      default:
        return null;
    }
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
            <View style={styles.flexRow}>
              <CText
                type={'b14'}
                color={colors.dark ? colors.white : colors.black}
                numberOfLines={1}
              >
                {item.userFullName}
              </CText>
              {renderBadge(item.level)}
            </View>
            <CText color={colors.grayScale5} numberOfLines={1} type={'m12'}>
              {item.timestamp}
            </CText>
          </View>
        </TouchableOpacity>
        {item.userId === userId && (
          <TouchableOpacity onPress={onPressDelete}>
            <MaterialCommunityIcons
              name={'dots-vertical'}
              size={moderateScale(30)}
              color={colors.dark ? colors.primary : colors.black}
            />
          </TouchableOpacity>
        )}
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
        <TouchableOpacity onPress={() => onImagePress(item.imageUrl)}>
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
        </TouchableOpacity>
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

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={localStyles.modalContainer}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalText}>Are you sure you want to delete this post?</Text>
            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={localStyles.deleteButton}
                onPress={deletePost}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={moderateScale(24)}
                  color="white"
                />
                <Text style={localStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={localStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  badge: {
    marginLeft: moderateScale(5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    alignItems: 'center',
  },
  modalText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: moderateScale(5),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: 'gray',
  },
  cancelButtonText: {
    color: 'gray',
    marginLeft: moderateScale(5),
  },
});