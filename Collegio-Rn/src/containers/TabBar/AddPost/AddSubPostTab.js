import { Image, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Modal, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { TabNav } from '../../../navigation/NavigationKeys';
import { styles } from '../../../themes';
import { moderateScale, API_BASE_URL } from '../../../common/constants';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../../components/common/CInput';
import images from '../../../assets/images';
import AddPost from './AddPost';

export default function AddSubPostTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const route = useRoute();
  const { communityId: routeCommunityId } = route.params || {};
  const [post, setPost] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [routeCommunityIdState, setRouteCommunityIdState] = useState(routeCommunityId); // New state for route communityId
  const [loading, setLoading] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [MaincommunityId, setMainCommunityId] = useState();
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

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();

      setMainCommunityId(userData.communityId );
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const onPressDiscard = () => {
    navigation.navigate(TabNav.HomeTab);
  };

  const onChangeTextPost = text => {
    setPost(text);
  };

  const onImageSelected = selectedImage => {
    setImage(selectedImage);
    setImagePreviewVisible(true); // Show the modal when an image is selected
  };

  const onSubmitPost = async () => {
    if (!userId || !routeCommunityIdState) {
      Alert.alert('Error', 'User ID or Community ID not found');
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
    formData.append('CommunityId', MaincommunityId); // Community ID from route params
    formData.append('presubcommunity_id', routeCommunityIdState); // Include presubcommunity_id
    formData.append('UserId', userId); // User ID from AsyncStorage
    formData.append('Description', post); // Post description

    try {
      const response = await fetch(`${API_BASE_URL}/api/Post/CreateSubPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Subpost created successfully');
        setImage(null);
        setImagePreviewVisible(false);
        navigation.navigate(TabNav.HomeTab, { refresh: true }); // Add refresh param
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create subpost');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create subpost');
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = () => {
    onSubmitPost();
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
        onPress={onSubmit}
        style={[
                  localStyles.publishContainer
                ]}>
        <Text style={{ color: colors.black, fontWeight: '400', fontSize: moderateScale(16) }}>
                  {strings.publish}
                </Text>
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
        {loading && (
          <View style={localStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <Modal
          visible={imagePreviewVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setImagePreviewVisible(false)}
        >
          <View style={localStyles.modalContainer}>
            {image && (
              <Image
                source={{ uri: image.path }}
                style={localStyles.fullScreenImage}
              />
            )}
            <TouchableOpacity
              style={localStyles.nextButton}
              onPress={() => setImagePreviewVisible(false)}
            >
              <Text style={localStyles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  publishContainer: {
      borderRadius: moderateScale(14),
      width :60,
      padding:5
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  nextButton: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
  },
  nextButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
  },
});