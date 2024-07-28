import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Button,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../assets/images';
import { styles } from '../../themes';
import CText from '../common/CText';
import CButton from '../common/CButton';
import PopularCategory from '../HomeComponent/PopularCategory';
import { moderateScale, screenWidth, API_BASE_URL } from '../../common/constants';
import { profileListData } from '../../api/constant';
import { StackNav } from '../../navigation/NavigationKeys';

export default function ProfileComponent() {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    retrieveUserId();
  }, []);

  const retrieveUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        const userIdInt = parseInt(storedUserId, 10);
        setUserId(userIdInt);
        fetchUserProfile(userIdInt);
      } else {
        console.warn('User ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${userId}/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const onPressEditProfile = () => {
    navigation.navigate(StackNav.Setting);
  };

  const handleProfileImagePress = () => {
    setModalVisible(true);
  };

  const handleViewProfileImage = () => {
    setModalVisible(false);
    setFullImageVisible(true);
  };

  const handleSelectProfileImage = () => {
    setModalVisible(false);
    setImageOptionsVisible(true);
  };

  const handleSelectImage = (source) => {
    if (source === 'camera') {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      })
        .then(image => {
          console.log('Selected image from camera:', image);
          uploadProfileImage(image);
        })
        .catch(error => {
          console.error('Error selecting image from camera:', error);
        });
    } else {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        mediaType: 'photo',
        includeBase64: true,
      })
        .then(image => {
          console.log('Selected image from gallery:', image);
          uploadProfileImage(image);
        })
        .catch(error => {
          console.error('Error selecting image from gallery:', error);
        });
    }
    setImageOptionsVisible(false);
  };

  const uploadProfileImage = async (image) => {
    if (!image || !image.path || !image.mime) {
      Alert.alert('Error', 'Image data is missing');
      console.error('Error: Image data is missing', image);
      return;
    }

    const formData = new FormData();
    formData.append('UserId', userId);
    formData.append('Image', {
      uri: image.path,
      type: image.mime,
      name: image.filename || `image-${Date.now()}.jpg`,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/User/saveurl`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to upload profile image');
      }
      const data = await res.json();
      console.log('Profile image uploaded successfully:', data);
      fetchUserProfile(userId);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload profile image');
      console.error('Error uploading profile image:', error);
    }
  };

  const RenderComponent = ({ title, text }) => (
    <TouchableOpacity
      style={[
        localStyles.mainContentStyle,
        { backgroundColor: colors.placeholderColor },
      ]}
    >
      <CText type={'m14'} align={'center'} style={styles.mv5} numberOfLines={1}>
        {title}
      </CText>
      <CText
        type={'m14'}
        align={'center'}
        style={styles.mb10}
        color={colors.mainColor}
        numberOfLines={1}
      >
        {text}
      </CText>
    </TouchableOpacity>
  );

  if (!profile) {
    return (
      <View style={localStyles.center}>
        <CText type={'m14'} align={'center'} color={colors.grayScale5}>
          Loading profile...
        </CText>
      </View>
    );
  }

  return (
    <View>
      <ImageBackground source={images.profileBanner} style={localStyles.bannerStyle}>
        <LinearGradient
          colors={[colors.primaryLight, colors.linearColor1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.itemInnerContainer}
        >
          <TouchableOpacity onPress={handleProfileImagePress}>
            <Image source={{ uri: profile.profilePath }} style={localStyles.userImgStyle} />
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.ph20}>
        <CText
          type={'b18'}
          align={'center'}
          style={localStyles.contentStyle}
          numberOfLines={1}
          color={colors.mainColor}
        >
          {profile.fullName}
        </CText>
        <CText
          type={'m14'}
          align={'center'}
          style={styles.mv10}
          numberOfLines={1}
          color={colors.grayScale5}
        >
          {profile.bio}
        </CText>
        <CText
          type={'m14'}
          align={'center'}
          style={styles.mb10}
          numberOfLines={1}
          color={colors.mainColor}
        >
          {profile.role}
        </CText>
        <View style={styles.rowSpaceBetween}>
          <RenderComponent title={profile.totalFollowers} text={'Followers'} />
          <RenderComponent title={profile.totalFollowing} text={'Following'} />
          <CButton
            title={'Edit Profile'}
            textType={'s14'}
            containerStyle={styles.ph25}
            onPress={onPressEditProfile}
          />
        </View>
        <PopularCategory
          chipsData={profileListData}
          bgColor={"#0F5CA8"}
          textColor={"white"}
          borderColor={colors.dark ? colors.black : colors.white}
        />
      </View>

      {/* Modal for options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <TouchableOpacity
             style={[localStyles.closeButton, { left: 10, right: 'auto' }]}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons
                name={'arrow-back'}
                size={moderateScale(24)}
                color={colors.dark ? colors.primary : colors.black}
              />
            </TouchableOpacity>
            <View style={localStyles.modalItem}>
              <Button title="View Profile Image" onPress={handleViewProfileImage} style={localStyles.modalItembuttons}/>
            </View>
            <View style={localStyles.modalItem}>
              <Button title="Select Profile Image" onPress={handleSelectProfileImage}style={localStyles.modalItembuttons} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for image selection options */}
      <Modal
        transparent={true}
        visible={imageOptionsVisible}
        onRequestClose={() => setImageOptionsVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContentWide}>
            <TouchableOpacity
              style={[localStyles.closeButton, { left: 10, right: 'auto' }]}
              onPress={() => setImageOptionsVisible(false)}
            >
              <Ionicons
                name={'arrow-back'}
                size={moderateScale(24)}
                color={colors.dark ? colors.primary : colors.black}
              />
            </TouchableOpacity>
            <View style={localStyles.modalItem}>
              <Button title="Camera" onPress={() => handleSelectImage('camera')} style={localStyles.modalItembuttons} />
            </View>
            <View style={localStyles.modalItem}>
              <Button title="Gallery" onPress={() => handleSelectImage('gallery')}  style={localStyles.modalItembuttons}/>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for full-screen image view */}
      <Modal
        visible={fullImageVisible}
        onRequestClose={() => setFullImageVisible(false)}
      >
        <View style={localStyles.fullScreenModal}>
          <Image
            source={{ uri: profile.profilePath }}
            style={localStyles.fullScreenImage}
          />

        </View>
      </Modal>
    </View>
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
    borderRadius: moderateScale(75),
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '70%',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalContentWide: {
    width: '50%', // Different width for the second modal
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalItem: {
    marginBottom: 15,
  },
  modalItembuttons: {
    borderRadius: 25,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },
});
