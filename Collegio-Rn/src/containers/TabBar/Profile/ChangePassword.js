import {Image, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {moderateScale, screenWidth} from '../../../common/constants';
import {styles} from '../../../themes';
import strings from '../../../i18n/strings';
import {
  validateConfirmPassword,
  validatePassword,
} from '../../../utils/validators';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import CText from '../../../components/common/CText';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';
import CInput from '../../../components/common/CInput';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';

export default function ChangePassword({navigation}) {
  const [oldPassword, setOldPassword] = useState('');
  const [errorOldPassword, setErrorOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(parseInt(storedUserId, 10));
          console.log('Retrieved userId:', storedUserId);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

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

  const onPressNext = async () => {
    if (errorOldPassword || errorNewPassword || errorConfirmPassword) {
      console.log('Validation errors exist:', { errorOldPassword, errorNewPassword, errorConfirmPassword });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending request to change password');
      const response = await fetch('http://192.168.0.106:7210/api/User/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: userId,
          OldPassword: oldPassword,
          NewPassword: newPassword,
        }),
      });

      const data = await response.text();
      console.log('Response:', data);

      if (response.ok) {
        navigation.navigate(StackNav.Setting); // Adjust to your navigation structure
      } else {
        setErrorConfirmPassword(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorConfirmPassword('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            secureTextEntry
          />
          <CInput
            placeholder={strings.newPassword}
            value={newPassword}
            onChangeText={onChangeNewPassword}
            _errorText={errorNewPassword}
            keyboardType={'default'}
            secureTextEntry
          />
          <CInput
            placeholder={strings.confirmNewPassword}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            keyboardType={'default'}
            _errorText={errorConfirmPassword}
            secureTextEntry
          />
          <CButton
            title={strings.next}
            textType={'s18'}
            onPress={onPressNext}
            loading={loading}
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
