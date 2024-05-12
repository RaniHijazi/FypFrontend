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
import {
  validateConfirmPassword,
  validatePassword,
} from '../../utils/validators';

export default function SetNewPassword({navigation}) {
  const [oldPassword, setOldPassword] = useState('');
  const [errorOldPassword, setErrorOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

  const onChangeOldPassword = item => {
    const {msg} = validatePassword(item);
    setOldPassword(item);
    setErrorOldPassword(msg);
  };

  const onChangeNewPassword = item => {
    const {msg} = validatePassword(item);
    setNewPassword(item);
    setErrorNewPassword(msg);
  };
  const onChangeConfirmPassword = item => {
    const {msg} = validateConfirmPassword(item.trim(), newPassword);
    setConfirmPassword(item);
    setErrorConfirmPassword(msg);
  };

  const onPressNext = () => {
    navigation.navigate(AuthNav.PasswordChange);
  };

  return (
    <CSafeAreaView>
      <CHeader style={styles.ph20} />
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.p20}>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'m32'}
            align={'center'}
            numberOfLines={2}
            style={localStyles.mainContainer}>
            {strings.setNewPassword}
          </CText>
          <CInput
            placeholder={strings.oldPassword}
            value={oldPassword}
            onChangeText={onChangeOldPassword}
            _errorText={errorOldPassword}
            keyboardType={'default'}
          />
          <CInput
            placeholder={strings.newPassword}
            value={newPassword}
            onChangeText={onChangeNewPassword}
            _errorText={errorNewPassword}
            keyboardType={'default'}
          />
          <CInput
            placeholder={strings.confirmNewPassword}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            keyboardType={'default'}
            _errorText={errorConfirmPassword}
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
