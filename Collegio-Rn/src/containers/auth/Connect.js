import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

//custom Imports
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import images from '../../assets/images';
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CButton from '../../components/common/CButton';
import {AuthNav} from '../../navigation/NavigationKeys';

export default function Connect({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressSignIn = () => {
    navigation.navigate(AuthNav.SignIn);
  };

  const onPressSignUp = () => {
    navigation.navigate(AuthNav.SignUp);
  };

  return (
    <CSafeAreaView style={styles.justifyBetween}>
      <Image source={images.topLeftImg} style={localStyles.topLeftImgStyle} />
      <View>
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText
          align={'center'}
          type={'s40'}
          numberOfLines={1}
          style={styles.mv30}>
          {strings.lets}
        </CText>
        <View style={styles.ph20}>
          <CButton
            title={strings.signIn}
            color={colors.textColor}
            textType={'s18'}
            onPress={onPressSignIn}
          />
          <CButton
            title={strings.signUp}
            color={colors.textColor}
            textType={'s18'}
            onPress={onPressSignUp}
          />
        </View>
      </View>
      <Image
        source={images.bottomRightImg}
        style={localStyles.topRightImgStyle}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  topLeftImgStyle: {
    width: moderateScale(170),
    height: '19%',
  },
  topRightImgStyle: {
    width: moderateScale(170),
    height: '20%',
    ...styles.selfEnd,
  },
  logoImgStyle: {
    width: moderateScale(80),
    height: '15%',
    resizeMode: 'contain',
    ...styles.selfCenter,
  },
});
