import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Modal, Text } from 'react-native';
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
import images from '../../../assets/images';
import AddPost from '../../TabBar/AddPost/AddPost';
import CInput from '../../../components/common/CInput';  // Import CInput

export default function AddCommunityTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  const [post, setPost] = useState('');
  const [communityName, setCommunityName] = useState(''); // New state for community name
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Success modal visibility
  const [communityId, setCommunityId] = useState();

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          setUserId(userIdInt);
          console.log('Retrieved userId:', userIdInt);
          fetchUserById(userIdInt);
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
      const userData = await response.json(); // Change to .json() for JSON response
      setCommunityId(userData.communityId); // Ensure userData has the correct structure
      console.log('Retrieved communityId:', userData.communityId);
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

  const onChangeTextCommunityName = text => {
    setCommunityName(text);
  };

  const onImageSelected = selectedImage => {
    setImage(selectedImage);
    setImagePreviewVisible(true); // Show the modal when an image is selected
  };

  const onSubmitPost = async () => {
    console.log('User ID:', userId);
    console.log('Community ID:', communityId);

    if (!userId || !communityId) {
      Alert.alert('Error', 'User ID or Community ID not found');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (image) {
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: 'photo.jpg',
      });
    }
    formData.append('preId', communityId);
    formData.append('userId', userId);
    formData.append('name', communityName);
    formData.append('description', post);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Community/CreateSubCommunity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text();

      if (response.ok) {
        console.log('Success response:', responseText); // Log response
        setSuccessModalVisible(true); // Show the success modal
        setImage(null);
        setImagePreviewVisible(false);
      } else {
        try {
          const errorData = JSON.parse(responseText);
          Alert.alert('Error', errorData.message || 'Failed to create subcommunity');
        } catch (jsonError) {
          Alert.alert('Error', responseText || 'Failed to create subcommunity');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create subcommunity');
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
      <CKeyBoardAvoidWrapper contentContainerStyle={localStyles.wrapper}>
        <View style={localStyles.container}>
          <CHeader
            isHideBack={true}
            isLeftIcon={<IsLeftIcon />}
            rightIcon={<RightIcon />}
            title={strings.create}
          />
          <CText style={localStyles.title} type={'b24'}>Create Sub Community</CText>
          <View style={localStyles.inputContainer}>
            <CInput
              label="Community Name"
              _value={communityName}
              toGetTextFieldValue={onChangeTextCommunityName}
              inputContainerStyle={localStyles.textInput}
            />
            <CInput
              label="Description"
              _value={post}
              toGetTextFieldValue={onChangeTextPost}
              inputContainerStyle={localStyles.largeTextInput}
              multiline={true}

            />
          </View>
          <View style={localStyles.addPostContainer}>
            <View style={localStyles.row}>
              <AddPost onImageSelected={onImageSelected} />
            </View>
          </View>
        </View>
        {loading && (
          <View style={localStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <Modal
          visible={successModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={localStyles.successModalContainer}>
            <CText style={localStyles.successMessage} type={'b18'}>
              The community has been created, wait for the admission to activate it
            </CText>
            <TouchableOpacity
              style={localStyles.nextButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <CText style={localStyles.nextButtonText} type={'b16'}>OK</CText>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          visible={imagePreviewVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setImagePreviewVisible(false)}
        >
          <View style={localStyles.fullScreenModalContainer}>
            {image && (
              <Image
                source={{ uri: image.path }}
                style={localStyles.fullScreenImage}
              />
            )}
            <TouchableOpacity
              style={localStyles.fullScreenNextButton}
              onPress={() => setImagePreviewVisible(false)}
            >
              <CText style={localStyles.fullScreenNextButtonText} type={'b16'}>Next</CText>
            </TouchableOpacity>
          </View>
        </Modal>
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',  // Adjust the width as needed
    maxWidth: 500,  // Set a maximum width for larger screens
    backgroundColor: 'white',  // Optional: add a background color
    borderRadius: 10,  // Optional: add border radius
    padding: moderateScale(20),
    ...styles.shadow,  // Add shadow for iOS and elevation for Android
  },
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
  headerContainer: {
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(23),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: moderateScale(10),
  },
  inputContainer: {
    marginBottom: moderateScale(20),
  },
  labelContainer: {
    marginTop: moderateScale(15),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateScale(5),
  },
  textInput: {
    height: moderateScale(50),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(16),
  },
  largeTextInput: {
    height: moderateScale(100),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(16),
    textAlignVertical: 'top',
  },
  addPostContainer: {
    marginBottom: moderateScale(15),

    marginTop:moderateScale(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgContainer: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(15),
  },
  loadingOverlay: {
    ...styles.flex1,
    ...styles.justifyCenter,
    ...styles.alignItemsCenter,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },


  successModalContainer: {
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    width: '80%',
    maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(300), // Optional, adjust as needed
  },
  successMessage: {
    color: 'black',
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  nextButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
  },
  nextButtonText: {
    color: 'black',
    fontSize: moderateScale(16),
  },


  fullScreenModalContainer: {
    backgroundColor: 'black', // Optional, use black for full-screen image view
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Maintain aspect ratio
  },
  fullScreenNextButton: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker background for button
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
  },
  fullScreenNextButtonText: {
    color: 'white', // White text color for better visibility
    fontSize: moderateScale(16),
  },
});
