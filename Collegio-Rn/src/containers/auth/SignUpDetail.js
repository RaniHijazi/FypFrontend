import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import images from '../../assets/images';
import {moderateScale, screenWidth} from '../../common/constants';
import {styles} from '../../themes';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import CInput from '../../components/common/CInput';
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
  const [firstName, setFirstName] = useState('');
  const [errorFirstName, setErrorFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorLastName, setErrorLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [select, setSelect] = useState(true);

  const onChangeFullName = item => {
    const {msg} = validateName(item);
    setFirstName(item);
    setErrorFirstName(msg);
  };

  const onChangeLastName = item => {
    const {msg} = validateName(item);
    setLastName(item);
    setErrorLastName(msg);
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

  const onPressCheck = () => {
    setSelect(!select);
  };

  const onPressSignUp = () => {
    navigation.navigate(AuthNav.EmailVerification, {title: title});
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
          <View style={localStyles.topContainer}>
            <View>
              <CInput
                placeHolder={strings.firstName}
                inputContainerStyle={localStyles.inputContainerStyle}
                value={firstName}
                onChangeText={onChangeFullName}
                keyboardType={'default'}
                _errorText={errorFirstName}
              />
            </View>
            <View>
              <CInput
                placeHolder={strings.lastName}
                inputContainerStyle={localStyles.inputContainerStyle}
                value={lastName}
                onChangeText={onChangeLastName}
                keyboardType={'default'}
                _errorText={errorLastName}
              />
            </View>
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
});
