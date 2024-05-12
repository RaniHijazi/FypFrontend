import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import {moderateScale, screenWidth} from '../../../common/constants';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import {styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import strings from '../../../i18n/strings';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';
import {validatePassword} from '../../../utils/validators';

export default function ConfirmDelete({navigation}) {
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const onPressYes = () => {
    navigation.navigate(StackNav.AccountDeleted);
  };

  const onPressNo = () => {
    navigation.navigate(StackNav.Setting);
  };

  const onChangePassword = item => {
    const {msg} = validatePassword(item);
    setPassword(item);
    setErrorPassword(msg);
  };
  return (
    <CSafeAreaView>
      <CSafeAreaView>
        <CKeyBoardAvoidWrapper
          contentContainerStyle={localStyles.contentContainerStyle}>
          <CHeader />
          <View>
            <Image source={images.logo} style={localStyles.logoImgStyle} />
            <CText
              type={'s14'}
              align={'center'}
              style={localStyles.textStyle}
              numberOfLines={2}>
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
            <CButton title={strings.yes} textType="s18" onPress={onPressYes} />
            <CButton title={strings.no} textType="s18" onPress={onPressNo} />
          </View>
        </CKeyBoardAvoidWrapper>
      </CSafeAreaView>
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
