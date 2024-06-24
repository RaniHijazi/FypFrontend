import {Image, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {TabNav} from '../../../navigation/NavigationKeys';
import {styles} from '../../../themes';
import { moderateScale, screenWidth, API_BASE_URL } from '../../../common/constants';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../../components/common/CInput';
import images from '../../../assets/images';
import AddPost from './AddPost';

export default function AddPostTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [post, setPost] = useState('');
  const [selectPost, setSelectPost] = useState(true);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const onPressDiscard = () => {
    navigation.navigate(TabNav.HomeTab);
  };

  const onChangeTextPost = text => {
    setPost(text);
  };

  const onPressPost = () => {
    setSelectPost(true);
  };

  const onPressStory = () => {
    setSelectPost(false);
  };

  const onImageSelected = selectedImage => {
    setImage(selectedImage);
  };

  const onSubmitPost = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (image) {
      formData.append('Image', {
        uri: image.path,
        type: image.mime,
        name: 'photo.jpg',
      });
    }
    formData.append('CommunityId', 1); // Set CommunityId to 1
    formData.append('UserId', userId); // Use retrieved UserId
    formData.append('Description', post);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created successfully');
        navigation.navigate(TabNav.HomeTab, { refresh: true }); // Add refresh param
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const IsLeftIcon = () => {
    return (
      <TouchableOpacity onPress={onPressDiscard}>
        <CText type={'b14'} numberOfLines={1}>
          {strings.discard}
        </CText>
      </TouchableOpacity>
    );
  };

  const InsideLeftIcon = () => {
    return (
      <Image source={images.profilePhoto} style={localStyles.imgContainer} />
    );
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        onPress={onSubmitPost}
        style={[
          localStyles.publishContainer,
          {backgroundColor: colors.dark ? colors.primary : colors.black},
        ]}>
        <CText type={'b14'} numberOfLines={1} color={colors.white}>
          {strings.publish}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={localStyles.mainContainer}>
        <View>
          <CHeader
            isHideBack={true}
            isLeftIcon={<IsLeftIcon />}
            rightIcon={<RightIcon />}
            title={strings.create}
          />
          <CInput
            placeholder={strings.whatOnYourMind}
            insideLeftIcon={InsideLeftIcon}
            inputContainerStyle={localStyles.inputContainerStyle}
            placeholderTextColor={colors.grayScale5}
            value={post}
            onChangeText={onChangeTextPost}
            multiline={true}
          />
          <AddPost onImageSelected={onImageSelected} />
        </View>
        <View
          style={[
            localStyles.topContainer,
            {backgroundColor: colors.placeholderColor},
          ]}>
          <TouchableOpacity
            style={[
              localStyles.contentStyle,
              {
                backgroundColor: selectPost
                  ? colors.dark
                    ? colors.primary
                    : colors.black
                  : null,
              },
            ]}
            onPress={onPressPost}>
            <CText
              align={'center'}
              type={'b13'}
              numberOfLines={1}
              color={selectPost ? colors.white : colors.mainColor}>
              {strings.post}
            </CText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              localStyles.contentStyle,
              {
                backgroundColor: !selectPost
                  ? colors.dark
                    ? colors.primary
                    : colors.black
                  : null,
              },
            ]}
            onPress={onPressStory}>
            <CText
              align={'center'}
              type={'b13'}
              numberOfLines={1}
              color={!selectPost ? colors.white : colors.mainColor}>
              {strings.story}
            </CText>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={localStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  publishContainer: {
    ...styles.pv5,
    ...styles.ph10,
    borderRadius: moderateScale(24),
  },
  mainContainer: {
    ...styles.ph20,
    ...styles.flexGrow1,
    ...styles.justifyBetween,
  },
  imgContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
  },
  inputContainerStyle: {
    height: moderateScale(180),
    ...styles.pv15,
    borderRadius: moderateScale(15),
    ...styles.itemsStart,
  },
  topContainer: {
    ...styles.flexRow,
    width: '64%',
    borderRadius: moderateScale(50),
    ...styles.p10,
    ...styles.center,
    ...styles.selfCenter,
    marginBottom: '25%',
  },
  contentStyle: {
    width: moderateScale(85),
    ...styles.mr5,
    ...styles.pv10,
    borderRadius: moderateScale(16),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
