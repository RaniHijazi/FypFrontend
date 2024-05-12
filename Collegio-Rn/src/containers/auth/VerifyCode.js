import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import images from '../../assets/images';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import {AuthNav} from '../../navigation/NavigationKeys';

export default function VerifyCode({navigation}) {
  const [verifyCode, setVerifyCode] = useState('');

  const onChangeVerifyCode = item => {
    setVerifyCode(item);
  };

  const onPressNext = () => {
    navigation.navigate(AuthNav.SetNewPassword);
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.ph20}>
          <CHeader />
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText type={'m32'} align={'center'} numberOfLines={1}>
            {strings.verifyCode}
          </CText>
          <CText
            type={'s16'}
            align={'center'}
            numberOfLines={2}
            style={styles.mb20}>
            {strings.verifyCodeDes}
          </CText>
          <CInput
            placeholder={strings.verifyOtpPlaceHolder}
            value={verifyCode}
            onChangeText={onChangeVerifyCode}
            keyboardType={'number-pad'}
            _maxLength={4}
          />
          <CButton
            title={strings.next}
            textType={'s18'}
            onPress={onPressNext}
          />
          <CText type={'r12'} style={styles.mv20} numberOfLines={1}>
            {strings.resendCodeDes}{' '}
            <CText type={'s12'} style={styles.underLineText}>
              {strings.resendCode}
            </CText>
          </CText>
        </View>
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  logoImgStyle: {
    width: moderateScale(80),
    height: '25%',
    resizeMode: 'contain',
    ...styles.selfCenter,
  },
});
