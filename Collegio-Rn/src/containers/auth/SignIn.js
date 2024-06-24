import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import { styles } from '../../themes';
import CHeader from '../../components/common/CHeader';
import images from '../../assets/images';
import { moderateScale, API_BASE_URL } from '../../common/constants';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import { AuthNav, StackNav } from '../../navigation/NavigationKeys';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import { validateEmail, validatePassword } from '../../utils/validators';
import { StoreLoginData } from '../../utils/asyncstorage';

export default function SignIn({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [errorFullName, setErrorFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [error, setError] = useState('');

  const onChangeFullName = item => {
    setFullName(item);
  };

  const onChangePassword = item => {
    const { msg } = validatePassword(item);
    setPassword(item);
    setErrorPassword(msg);
  };

  const onPressSignIn = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/api/User/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName,
          password: password,
        }),
      });
      console.log("i reached here");
      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        throw new Error(data.error);
      }
       const data = await response.json();
          const userId = data.user.id;
          console.log(userId);
      await StoreLoginData(true);
      await AsyncStorage.setItem('userId', userId.toString());
      navigation.reset({
        index: 0,
        routes: [{ name: StackNav.TabBar, params: { userId: userId } }],
      });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const onPressForgotPassword = () => {
    navigation.navigate(AuthNav.ForgotPassword);
  };

  const onPressSignUp = () => {
    navigation.navigate(AuthNav.SignUp);
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
             <View style={localStyles.errorContainer}>
               {error ? (
                 <CText type={'r12'} style={localStyles.errorMessage} numberOfLines={1}>
                   {error}
                 </CText>
               ) : null}
             </View>
            <CInput
              placeholder={strings.fullName}
              value={fullName}
              onChangeText={onChangeFullName}
              keyboardType={'default'}
              _errorText={errorFullName}
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

  errorContainer: {
    ...styles.flex1,
    ...styles.justifyCenter,
    ...styles.alignCenter,
  },

  errorMessage: {
        color: 'red',
        textAlign: 'center',
      },
});
