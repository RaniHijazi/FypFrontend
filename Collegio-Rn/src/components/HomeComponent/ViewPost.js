import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CSafeAreaView from '../common/CSafeAreaView';
import CHeader from '../common/CHeader';
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import CText from '../common/CText';
import { moderateScale, API_BASE_URL } from '../../common/constants';
import { SendIcon, GoldBadge, BlueBadge, GreenBadge, PinkBadge, RedBadge } from '../../assets/svgs';

export default function ViewPost({ route }) {
  const item = route?.params?.item;
  const colors = useSelector((state) => state.theme.theme);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState({});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/post/${item.id}`);
      const data = await response.json();
      console.log('Fetched comments:', data); // Debugging log
      setComments(data);

      const updatedLiked = {};
      for (const comment of data) {
        const hasLikedResponse = await fetch(
          `${API_BASE_URL}/api/Post/${comment.id}/hasCommented?userId=${userId}`
        );
        const hasLiked = await hasLikedResponse.json();
        updatedLiked[comment.id] = hasLiked;
      }

      setLiked(updatedLiked);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

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
    if (userId !== null) {
      fetchComments();
    }
  }, [item.id, userId]);

  const handleLikePress = async (comment) => {
    try {
      const url = liked[comment.id]
        ? `${API_BASE_URL}/api/Post/DislikeComment?comment_id=${comment.id}&user_id=${userId}`
        : `${API_BASE_URL}/api/Post/LikeComment?comment_id=${comment.id}&user_id=${userId}`;
      await fetch(url, { method: 'POST' });

      setLiked((prevLiked) => ({
        ...prevLiked,
        [comment.id]: !prevLiked[comment.id],
      }));

      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === comment.id ? { ...c, likesCount: c.likesCount + (liked[comment.id] ? -1 : 1) } : c
        )
      );
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const onChangeTextComment = (text) => {
    setComment(text);
  };

  const sendComment = async () => {
    if (comment.trim() === '') {
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/Post/CommentOnPost?post_id=${item.id}&user_id=${userId}`;
      const body = {
        description: comment,
        imageUrl: comment.trim() !== '' ? comment.trim() : null,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComment('');

      fetchComments(); // Call fetchComments to update the comments list after adding a new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const rightAccessory = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <TouchableOpacity onPress={sendComment}>
          <Octicons
            name={'plus'}
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={sendComment}>
          <SendIcon />
        </TouchableOpacity>
      </View>
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

  const renderItem = ({ item }) => {
    const isLiked = liked[item.id];
    console.log('Comment item:', item); // Debugging log
    return (
      <TouchableOpacity
        style={[
          localStyles.containerStyle,
          { backgroundColor: colors.placeholderColor },
        ]}
      >
        <View style={styles.flexRow}>
          <Image
            source={{ uri: item.userProfilePath }}
            style={localStyles.imgContainer}
          />
          <View style={{ gap: moderateScale(5) }}>
            <View style={styles.flexRow}>
              <CText type={'b13'} color={colors.mainColor} numberOfLines={1}>
                {item.userName}
              </CText>
              {renderBadge(item.level)}
            </View>
            <CText type={'r13'} color={colors.mainColor} numberOfLines={1}>
              {item.description}
            </CText>
            <View style={localStyles.contentStyle}>
              <CText
                type={'r12'}
                color={colors.grayScale5}
                numberOfLines={1}
              >
                {item.time}
              </CText>
              <View
                style={[
                  localStyles.dotStyle,
                  { backgroundColor: colors.grayScale5 },
                ]}
              />
              <CText type={'r12'} color={colors.primary} numberOfLines={1}>
                {item.likesCount}
              </CText>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleLikePress(item)}>
          <AntDesign
            name={isLiked ? 'like1' : 'like2'}
            size={moderateScale(20)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const HeaderComponent = () => {
    return (
      <View>
        <View style={localStyles.topContainer}>
          <CText
            color={colors.mainColor}
            type={'r12'}
            numberOfLines={1}
          >{`${strings.comments}(${comments.length})`}</CText>
          <View style={styles.rowCenter}>
            <CText
              type={'s13'}
              style={styles.mr10}
              numberOfLines={1}
            >
              {strings.recent}
            </CText>
            <SimpleLineIcons
              name={'arrow-down'}
              size={moderateScale(16)}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.viewPost} style={[styles.ph20, styles.mr20]} />
      <KeyboardAvoidingView
        style={localStyles.contentContainerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={comments}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          ListHeaderComponent={HeaderComponent}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={localStyles.inputWrapper}>
          <TextInput
            placeholder={strings.chatPlaceholder}
            style={localStyles.input}
            placeholderTextColor={colors.grayScale5}
            value={comment}
            onChangeText={onChangeTextComment}
          />
          {rightAccessory()}
        </View>
      </KeyboardAvoidingView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  containerStyle: {
    ...styles.mv10,
    ...styles.p15,
    borderRadius: moderateScale(15),
    ...styles.justifyBetween,
    ...styles.flexRow,
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
  imgContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    ...styles.mr10,
  },
  contentStyle: {
    ...styles.flexRow,
    gap: moderateScale(10),
    ...styles.itemsCenter,
  },
  dotStyle: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  topContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv20,
  },
  bottomContainer: {
    ...styles.ph20,
    ...styles.flexGrow1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(50),
    height: moderateScale(52),
    ...styles.mb20,
    ...styles.selfCenter,
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(15),
  },
  input: {
    flex: 1,
    color: 'black',
  },
  mainContentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  contentContainerStyle: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  badge: {
    marginLeft: moderateScale(5),
  },
});
