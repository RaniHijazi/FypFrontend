import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import images from '../../assets/images';
import {moderateScale, screenWidth} from '../../common/constants';
import {styles} from '../../themes';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../components/common/CInput';
import CPicker from '../../components/common/CPicker';
import CHeader from '../../components/common/CHeader';
import CButton from '../../components/common/CButton';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validators';
import {AuthNav} from '../../navigation/NavigationKeys';

export default function SignUpDetail({route, navigation}) {
  const title = route?.params?.title;
  const colors = useSelector(state => state.theme.theme);
  const [fullName, setFullName] = useState('');
  const [errorFullName, setErrorFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [select, setSelect] = useState(true);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChangeFullName = name => {
     const { msg } = validateName(name);
     setFullName(name);
     setErrorFullName(msg);
   };

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

  const onChangeAge = (inputAge) => {
    // Validate the age input if needed
    setAge(inputAge);
  };

  const onPressCheck = () => {
    setSelect(!select);
  };

 const onPressSignUp = async () => {
   try {
     console.log('FullName:', fullName);
     console.log('Email:', email);
     console.log('Password:', password);
     console.log('Gender:', gender);
     console.log('Age:', age);


     const requestBody = {
       fullName,
       email,
       password,
       gender,
       age,
     };

     const response = await fetch('http://172.20.10.3:5210/api/User/signup', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(requestBody),
     });

     if (!response.ok) {
       const errorMessage = await response.text();
       setErrorMessage(errorMessage);
       throw new Error('Sign up request failed');
     }



      const { newUser, token } = await response.json();
          const userId = newUser.id; // Ensure correct property name

          console.log('Request Body:', requestBody); // Log request body
          console.log('User Id:', userId); // Log user ID


     // Assuming successful signup, navigate to email verification screen
     navigation.navigate(AuthNav.EmailVerification, {  userId: userId,title: title});
   } catch (error) {
     console.error('Error signing up:', error);
     // Handle signup error, e.g., display error message to the user
   }
 };


  const onPressAlreadyAccount = () => {
    navigation.navigate(AuthNav.SignIn);
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper
        contentContainerStyle={localStyles.contentContainerStyle}>
        <CHeader />
        <View>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'m32'}
            align={'center'}
            numberOfLines={1}
            style={styles.mv20}>
            {strings.signUp}
          </CText>
          <View style={localStyles.errorMessageContainer}>
            {errorMessage ? (
              <CText type={'s12'} style={localStyles.errorMessage}>
                {errorMessage}
              </CText>
            ) : null}
          </View>
          <View style={localStyles.topContainer}>
            <View>
              <CInput
               placeHolder={strings.fullName}
               inputContainerStyle={[localStyles.inputStyle, localStyles.fullNameInput]}
               value={fullName}
               onChangeText={onChangeFullName}
               keyboardType={'default'}
              _errorText={errorFullName}
             />
            </View>
          </View>
           <View >
             <CPicker
               selectedValue={gender}
               onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
               >
               <Picker.Item label="Select Gender" value="" />
               <Picker.Item label="Male" value="male" />
               <Picker.Item label="Female" value="female" />
             </CPicker>

              <CInput
                placeHolder={strings.age}
                value={age}
                onChangeText={onChangeAge}
                keyboardType={'number-pad'}
                _maxLength={3}
              />
             </View>
          <CInput
            placeHolder={strings.email}
            value={email}
            onChangeText={onChangeEmail}
            keyboardType={'default'}
            _errorText={errorEmail}
          />
          <CInput
            placeHolder={strings.password}
            value={password}
            onChangeText={onChangePassword}
            keyboardType={'default'}
            _errorText={errorPassword}
          />
          <CText type={'s12'} style={styles.mv15} numberOfLines={1}>
            {strings.emailDes}
          </CText>
          <View style={styles.flexRow}>
            <TouchableOpacity
              onPress={onPressCheck}
              style={[
                localStyles.checkBoxStyle,
                {backgroundColor: colors.placeholderColor},
              ]}>
              <Ionicons
                name={!!select ? 'checkmark-sharp' : null}
                size={moderateScale(24)}
                color={colors.primary}
              />
            </TouchableOpacity>
            <CText type={'s12'} style={styles.mv10} numberOfLines={1}>
              {strings.termsConditions}
            </CText>
          </View>
          <CButton
            title={strings.signUp}
            textType={'s18'}
            onPress={onPressSignUp}
          />
        </View>
        <TouchableOpacity onPress={onPressAlreadyAccount}>
          <CText
            type={'s12'}
            style={localStyles.bottomContainerStyle}
            align={'center'}
            numberOfLines={1}>
            {strings.alreadyHaveAccount}
          </CText>
        </TouchableOpacity>
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
    ...styles.mt35,
  },
  inputContainerStyle: {
    width: screenWidth / 2.4,
  },
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  checkBoxStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(10),
    ...styles.center,
    ...styles.mr10,
  },
  bottomContainerStyle: {
    ...styles.mv10,
    ...styles.underLineText,
    marginBottom: '40%',
  },
  topContainer: {
    ...styles.flexRow,
    ...styles.justifyBetween,
  },

  errorMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    },
});
