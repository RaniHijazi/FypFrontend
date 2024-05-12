import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

//custom imports
import images from '../../assets/images';
import {styles} from '../../themes';
import CText from '../common/CText';
import CButton from '../common/CButton';
import PopularCategory from '../HomeComponent/PopularCategory';
import {moderateScale, screenWidth} from '../../common/constants';
import {profileListData} from '../../api/constant';
import {StackNav} from '../../navigation/NavigationKeys';

export default function ProfileComponent() {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();

  const onPressEditProfile = () => {
    navigation.navigate(StackNav.Setting);
  };

  const RenderComponent = ({title, text}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.mainContentStyle,
          {backgroundColor: colors.placeholderColor},
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
  };

  return (
    <View>
      <ImageBackground
        source={images.profileBanner}
        style={localStyles.bannerStyle}>
        <LinearGradient
          colors={[colors.primaryLight, colors.linearColor1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={localStyles.itemInnerContainer}>
          <Image
            source={images.profilePhoto}
            style={localStyles.userImgStyle}
          />
        </LinearGradient>
      </ImageBackground>
      <View style={styles.ph20}>
        <CText
          type={'b18'}
          align={'center'}
          style={localStyles.contentStyle}
          numberOfLines={1}
          color={colors.mainColor}>
          Wadih Issa
        </CText>
        <CText
          type={'m14'}
          align={'center'}
          style={styles.mv10}
          numberOfLines={1}
          color={colors.grayScale5}>
          Beirut,Baabda
        </CText>
        <CText
          type={'m14'}
          align={'center'}
          style={styles.mb10}
          numberOfLines={1}
          color={colors.mainColor}>
          Student In Antonine University
        </CText>
        <View style={styles.rowSpaceBetween}>
          <RenderComponent
            title={strings.totalFollowers}
            text={strings.followers}
          />
          <RenderComponent
            title={strings.totalFollowing}
            text={strings.following}
          />
          <CButton
            title={strings.editProfile}
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
});
