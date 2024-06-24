import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


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


  useEffect(() => {
    const userId = 5;

    fetch(`${API_BASE_URL}/api/User/${userId}/profile`)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);

      })
      .catch((error) => {
        console.error('Error fetching profile:', error);

      });
  }, []);

  const onPressEditProfile = () => {
    navigation.navigate(StackNav.Setting);
  };
console.log(profile);
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
      <View style={styles.center}>
        <CText type={'m14'} align={'center'} color={colors.grayScale5}>
          Error loading profile data
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
          <Image source={{ uri: profile.profilePath  }} style={localStyles.userImgStyle} />
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
});
