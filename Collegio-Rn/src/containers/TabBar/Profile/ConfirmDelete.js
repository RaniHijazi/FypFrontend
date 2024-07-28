import {Image, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have installed this package

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import {moderateScale, screenWidth} from '../../../common/constants';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import {styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import strings from '../../../i18n/strings';
import CButton from '../../../components/common/CButton';
import CInput from '../../../components/common/CInput';
import {StackNav} from '../../../navigation/NavigationKeys';
import {validatePassword} from '../../../utils/validators';

export default function ConfirmDelete({navigation}) {
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  const onChangePassword = item => {
    const {msg} = validatePassword(item);
    setPassword(item);
    setErrorPassword(msg);
  };

  const onPressYes = async () => {
      setLoading(true);

      try {
        const response = await fetch(`http://192.168.0.106:7210/api/User/${userId}?Password=${encodeURIComponent(password)}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          navigation.navigate(StackNav.AccountDeleted);
        } else {
          const data = await response.json();
          setErrorPassword(data.message || 'Failed to delete account');
        }
      } catch (error) {
        setErrorPassword('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };


  const onPressNo = () => {
    navigation.navigate(StackNav.Setting);
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={localStyles.contentContainerStyle}>
        <CHeader />
        <View>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText type={'s14'} align={'center'} style={localStyles.textStyle} numberOfLines={2}>
            {strings.areYouSureYouWantDoThis}
          </CText>
          <CInput
            placeholder={strings.reEnterPassword}
            value={password}
            onChangeText={onChangePassword}
            keyboardType={'default'}
            _errorText={errorPassword}
            inputContainerStyle={styles.mv20}
          />
          <CButton title={strings.yes} textType="s18" onPress={onPressYes} loading={loading} />
          <CButton title={strings.no} textType="s18" onPress={onPressNo} />
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
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  textStyle: {
    ...styles.m20,
    width: screenWidth - moderateScale(170),
    ...styles.selfCenter,
  },
});
