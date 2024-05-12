import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';

//custom imports
import {styles} from '../../../themes';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import CText from '../../../components/common/CText';
import CButton from '../../../components/common/CButton';
import PopularCategory from '../../../components/HomeComponent/PopularCategory';
import CHeader from '../../../components/common/CHeader';
import {profileListData, userImageData} from '../../../api/constant';
import {moderateScale, screenWidth} from '../../../common/constants';

export default function OtherPersonProfile({route}) {
  const item = route?.params?.item;
  const colors = useSelector(state => state.theme.theme);
  const [follow, setFollow] = useState(false);

  const onPressFollow = () => {
    setFollow(!follow);
  };

  const renderImgContainer = ({item, index}) => {
    return (
      <View
        style={{
          zIndex: 10,
          left: moderateScale(index * -20),
        }}>
        <LinearGradient
          colors={[colors.primaryLight, colors.linearColor1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={localStyles.imgContainer}>
          <Image source={item} style={[localStyles.userImgContainerStyle]} />
        </LinearGradient>
      </View>
    );
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
    <CSafeAreaView>
      <ScrollView
        contentContainerStyle={styles.pb20}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <ImageBackground
          source={images.profileBanner}
          style={localStyles.bannerStyle}>
          <CHeader style={styles.p15} />
          <LinearGradient
            colors={[colors.primaryLight, colors.linearColor1]}
            start={{x: 0, y: 0}}
            style={localStyles.itemInnerContainer}>
            <Image source={item?.image} style={localStyles.userImgStyle} />
          </LinearGradient>
        </ImageBackground>
        <View style={styles.ph20}>
          <CText
            type={'b18'}
            align={'center'}
            style={localStyles.contentStyle}
            numberOfLines={1}
            color={colors.mainColor}>
            {item.name}
          </CText>
          <CText
            type={'m14'}
            align={'center'}
            style={styles.mv10}
            numberOfLines={1}
            color={colors.grayScale5}>
            {strings.city}
          </CText>
          <CText
            type={'m14'}
            align={'center'}
            style={styles.mb10}
            numberOfLines={1}
            color={colors.mainColor}>
            {strings.work}
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
              title={follow ? strings.following : strings.follow}
              textType={'s14'}
              containerStyle={styles.ph25}
              onPress={onPressFollow}
            />
          </View>
          <View
            style={[
              localStyles.eventStyle,
              {backgroundColor: colors.placeholderColor},
            ]}>
            <FlatList
              data={userImageData}
              renderItem={renderImgContainer}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={5}
            />
            <View>
              <CText type={'r12'} numberOfLines={1} color={colors.mainColor}>
                {strings.followedBy} <CText>{strings.sofiaJon}</CText>
                <CText color={colors.mainColor}>{strings.and}</CText>
                <CText>{strings.others}</CText>
              </CText>
            </View>
          </View>
          <PopularCategory
            chipsData={profileListData}
            textColor={colors.primaryLight}
            bgColor={colors.placeholderColor}
          />
          <PostComponent item={item} />
        </View>
      </ScrollView>
    </CSafeAreaView>
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
    borderRadius: moderateScale(100),
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
  userImgContainerStyle: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(15),
  },
  eventStyle: {
    borderRadius: moderateScale(50),
    ...styles.p10,
    ...styles.rowCenter,
  },
  imgContainer: {
    borderRadius: moderateScale(15),
    padding: moderateScale(2),
  },
});
