import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import {styles} from '../../themes';
import CHeader from '../../components/common/CHeader';
import images from '../../assets/images';
import {moderateScale} from '../../common/constants';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import {AuthNav, StackNav} from '../../navigation/NavigationKeys';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import {validateEmail, validatePassword} from '../../utils/validators';
import {StoreLoginData} from '../../utils/asyncstorage';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const onChangeEmail = item => {
    const {msg} = validateEmail(item);
    setEmail(item);
    setErrorEmail(msg);
  };

  const onChangePassword = item => {
    const {msg} = validatePassword(item);
    setPassword(item);
    setErrorPassword(msg);
  };

  const onPressSignUp = () => {
    navigation.navigate(AuthNav.SignUp);
  };

  const onPressSignIn = async () => {
    await StoreLoginData(true);
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
    });
  };

  const onPressForgotPassword = () => {
    navigation.navigate(AuthNav.ForgotPassword);
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.mainContainer}>
          <CHeader />
          <View>
            <Image source={images.logo} style={localStyles.logoImgStyle} />
            <CText
              type={'m32'}
              align={'center'}
              style={styles.mb20}
              numberOfLines={1}>
              {strings.signIn}
            </CText>
            <CInput
              placeholder={strings.email}
              value={email}
              onChangeText={onChangeEmail}
              keyboardType={'default'}
              _errorText={errorEmail}
            />
            <CInput
              placeholder={strings.password}
              value={password}
              onChangeText={onChangePassword}
              keyboardType={'default'}
              _errorText={errorPassword}
            />
            <TouchableOpacity onPress={onPressForgotPassword}>
              <CText type={'s12'} style={styles.mv20} numberOfLines={1}>
                {strings.forgotPassword}
              </CText>
            </TouchableOpacity>
            <CButton
              title={strings.signIn}
              textType={'s18'}
              onPress={onPressSignIn}
            />
          </View>
          <TouchableOpacity style={styles.selfCenter} onPress={onPressSignUp}>
            <CText numberOfLines={1} type={'m12'}>
              {strings.dontHaveAccount}{' '}
              <CText style={styles.underLineText} type={'s12'}>
                {strings.signUp}
              </CText>
            </CText>
          </TouchableOpacity>
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
    ...styles.mt35,
  },
  mainContainer: {
    ...styles.ph20,
    ...styles.justifyBetween,
  },
});
