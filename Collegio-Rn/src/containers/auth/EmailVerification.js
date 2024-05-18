import {Image, StyleSheet } from 'react-native';
import React, {useState,useEffect} from 'react';


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

  const userId = route?.params?.userId;
  console.log('User Id:', userId);
 const [email, setEmail] = useState('');

  useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch('http://172.20.10.3:5210/api/User/' + userId);
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await response.json();
        setEmail(data.email);
          //Call the sendVerificationCode endpoint with the obtained email

        const sendVerificationResponse = await fetch('http://172.20.10.3:5210/api/Email/send-verification-code?userEmail=' + data.email, {
          method: 'POST',
        });
             if (!sendVerificationResponse.ok) {
               throw new Error('Failed to send verification code');
             }
             console.log('Verification code sent successfully');
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails(); // Call the function when the component mounts
    }, []);

    const verifyVerificationCode = async () => {
      try {
        const response = await fetch('http://172.20.10.3:5210/api/User/VerifyVerificationCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: email,
            verificationCode: emailCode,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to verify verification code');
        }
        console.log('Verification code verified successfully');
        // Navigate to the next screen or perform other actions upon successful verification
      } catch (error) {
        console.error('Error verifying verification code:', error);
      }
    };

  console.log('email:', email);
  const [emailCode, setEmailCode] = useState('');

  const onChangeEmail = item => {
    setEmailCode(item);
  };

  const onPressContinue = () => {
    verifyVerificationCode();
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
