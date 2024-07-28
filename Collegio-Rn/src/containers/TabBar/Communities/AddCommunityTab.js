import { Image, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Modal, Text, TextInput } from 'react-native';
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
import images from '../../../assets/images';
import AddPost from '../../TabBar/AddPost/AddPost';

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
      formData.append('Image', {
        uri: image.path,
        type: image.mime,
        name: 'photo.jpg',
      });
    }
    formData.append('preId', communityId);
    formData.append('name', communityName);
    formData.append('Description', post);

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
          localStyles.publishContainer,
          { backgroundColor: colors.dark ? colors.primary : colors.black },
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
          <Text style={localStyles.title}>Create Sub Community</Text>
          <View style={localStyles.inputContainer}>
            <View style={localStyles.labelContainer}>
              <Text style={localStyles.label}>Community Name</Text>
              <TextInput
                style={localStyles.textInput}
                value={communityName}
                onChangeText={onChangeTextCommunityName}
              />
            </View>
            <View style={localStyles.labelContainer}>
              <Text style={localStyles.label}>Description</Text>
              <TextInput
                style={localStyles.largeTextInput}
                value={post}
                onChangeText={onChangeTextPost}
                multiline={true}
              />
            </View>
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
            <Text style={localStyles.successMessage}>
              The community has been created, wait for the admission to activate it
            </Text>
            <TouchableOpacity
              style={localStyles.nextButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={localStyles.nextButtonText}>OK</Text>
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
              <Text style={localStyles.fullScreenNextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  headerContainer: {
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(24),
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
    marginBottom: moderateScale(20),
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

  // Success Modal Styles
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
    fontSize: moderateScale(10),
  },

  // Full Screen Image Modal Styles
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
