import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {TabNav} from '../../../navigation/NavigationKeys';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../../components/common/CInput';
import images from '../../../assets/images';
import AddPost from './AddPost';

export default function AddPostTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [post, setPost] = useState('');
  const [selectPost, setSelectPost] = useState(true);

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
          <AddPost />
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
});
