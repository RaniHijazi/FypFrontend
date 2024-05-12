import {Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import images from '../../assets/images';
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../components/common/CInput';
import CHeader from '../../components/common/CHeader';
import CButton from '../../components/common/CButton';
import {AuthNav} from '../../navigation/NavigationKeys';

export default function EmailVerification({route, navigation}) {
  const title = route?.params?.title;
  const [emailCode, setEmailCode] = useState('');

  const onChangeEmail = item => {
    setEmailCode(item);
  };

  const onPressContinue = () => {
    navigation.navigate(AuthNav.EmailVerified, {title: title});
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper
        contentContainerStyle={localStyles.contentContainerStyle}>
        <CHeader />
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText
          type={'m32'}
          align={'center'}
          style={styles.mt20}
          numberOfLines={1}>
          {strings.verifyEmail}
        </CText>
        <CText
          type={'s16'}
          align={'center'}
          style={styles.mv20}
          numberOfLines={2}>
          {strings.verifyEmailDes}
        </CText>
        <CInput
          placeHolder={strings.verifyOtpPlaceHolder}
          value={emailCode}
          onChangeText={onChangeEmail}
          keyboardType={'number-pad'}
          _maxLength={4}
          _isSecure
        />
        <CText type={'r12'} style={styles.mv20} numberOfLines={1}>
          {strings.resendCodeDes}{' '}
          <CText type={'s12'} style={localStyles.underLineStyle}>
            {strings.resendCode}
          </CText>
        </CText>
        <CButton
          title={strings.continue}
          textType={'s18'}
          onPress={onPressContinue}
        />
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  logoImgStyle: {
    width: moderateScale(80),
    height: '15%',
    resizeMode: 'contain',
    ...styles.selfCenter,
  },
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  underLineStyle: {
    ...styles.underLineText,
  },
});
