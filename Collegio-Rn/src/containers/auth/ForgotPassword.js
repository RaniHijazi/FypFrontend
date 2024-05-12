import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import {styles} from '../../themes';
import {moderateScale, screenWidth} from '../../common/constants';
import images from '../../assets/images';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import {AuthNav} from '../../navigation/NavigationKeys';
import {validateEmail} from '../../utils/validators';

export default function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const onChangeEmail = item => {
    const {msg} = validateEmail(item);
    setEmail(item);
    setErrorEmail(msg);
  };

  const onPressNext = () => {
    navigation.navigate(AuthNav.VerifyCode);
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.ph20}>
          <CHeader />
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'m32'}
            align={'center'}
            style={localStyles.mainContainer}
            numberOfLines={2}>
            {strings.fPassword}
          </CText>
          <CText
            type={'s16'}
            align={'center'}
            numberOfLines={1}
            style={styles.mb20}>
            {strings.pleaseEnterYourEmail}
          </CText>
          <CInput
            placeholder={strings.email}
            value={email}
            onChangeText={onChangeEmail}
            keyboardType={'default'}
            _errorText={errorEmail}
          />
          <CButton
            title={strings.next}
            textType={'s18'}
            onPress={onPressNext}
          />
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
  mainContainer: {
    ...styles.mb20,
    width: screenWidth - moderateScale(190),
    ...styles.selfCenter,
  },
});
