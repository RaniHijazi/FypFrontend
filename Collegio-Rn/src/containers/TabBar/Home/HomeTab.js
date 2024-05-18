import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {useSelector} from 'react-redux';

//custom imports
import {TabNav} from '../../../navigation/NavigationKeys.js';
import {TabRoute} from '../../../navigation/NavigationRoute.js';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {SendIcon} from '../../../assets/svgs';
import LinearGradient from 'react-native-linear-gradient';
import {userPostData, userStoryImageData} from '../../../api/constant';
import {moderateScale} from '../../../common/constants';
import images from '../../../assets/images';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function HomeTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressUserProfile = item => {
    navigation.navigate(StackNav.OtherPersonProfile, {item: item});
  };

  const onPressSendIcon = () => {
    navigation.navigate(StackNav.Messages);
  };

  const onPressStory = item => {
    navigation.navigate(StackNav.StoryView, {img: item});
  };

  const AddPostIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.AddPostIconStyle, {backgroundColor: colors.black}]}>
        <Octicons
          name={'plus'}
          size={moderateScale(12)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const renderPostComponent = ({item}) => {
    return (
      <PostComponent item={item} onPress={() => onPressUserProfile(item)} />
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={localStyles.mainStoryStyle}
        onPress={() => onPressStory(item)}>
        {index === 0 ? (
          <View>
            <Image
              source={images.userImage1}
              style={localStyles.adminImageStyle}
            />
            <AddPostIcon />
          </View>
        ) : (
          <LinearGradient
            colors={[colors.primaryLight, colors.linearColor1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={localStyles.itemInnerContainer}>
            <Image
              source={item}
              style={[
                localStyles.imgContainer,
                {
                  borderColor: colors.addPostBtn,
                },
              ]}
            />
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {

  const navigateToProfile = () => {
      // Navigate to the profile screen
      // You can adjust the navigation action based on your navigation setup
      navigation.navigate(TabNav.ProfileTab); // Assuming you have access to the user data
    };

    return (
      <View>
        <View style={styles.rowSpaceBetween}>
          <CText
            type={'m18'}
            color={colors.dark ? colors.white : colors.black}
            numberOfLines={1}>
            {strings.goodMorning}
          </CText>
          <TouchableOpacity onPress={onPressSendIcon}>
            <SendIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToProfile} style={styles.ml10}>
                      <Image
                        source={images.userImage1} // Replace with the source of your profile picture
                        style={localStyles.imgContainer}
                      />
          </TouchableOpacity>
        </View>
        <View
          style={[
            localStyles.storyContainer,
            {backgroundColor: colors.placeholderColor},
          ]}>
          <FlatList
            data={userStoryImageData}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
          />
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <FlatList
        data={userPostData}
        renderItem={renderPostComponent}
        ListHeaderComponent={<ListHeaderComponent />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={localStyles.contentContainerStyle}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imgContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(25),
  },
  storyContainer: {
    height: moderateScale(88),
    borderRadius: moderateScale(10),
    ...styles.ph15,
    ...styles.mv25,
  },
  mainStoryStyle: {
    ...styles.mr10,
    ...styles.center,
  },
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(50),
  },
  adminImageStyle: {
    width: moderateScale(58),
    height: moderateScale(58),
    borderRadius: moderateScale(29),
  },
  AddPostIconStyle: {
    height: moderateScale(16),
    width: moderateScale(16),
    borderRadius: moderateScale(20),
    position: 'absolute',
    bottom: 0,
    right: 0,
    ...styles.center,
  },
  contentContainerStyle: {
    ...styles.p15,
    paddingBottom: moderateScale(75),
  },
});
