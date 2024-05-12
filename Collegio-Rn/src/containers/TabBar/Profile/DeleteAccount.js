import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {moderateScale, screenWidth} from '../../../common/constants';
import images from '../../../assets/images';
import strings from '../../../i18n/strings';
import CInput from '../../../components/common/CInput';
import {validatePassword} from '../../../utils/validators';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function DeleteAccount({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const onChangePassword = item => {
    const {msg} = validatePassword(item);
    setPassword(item);
    setErrorPassword(msg);
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  const onPressConfirm = () => {
    navigation.navigate(StackNav.ConfirmDelete);
  };

  return (
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
            {strings.deleteAccountDes}
          </CText>
          <CText
            type={'s12'}
            align={'center'}
            color={colors.grayScale5}
            style={localStyles.textStyle}
            numberOfLines={2}>
            {strings.deleteAccountNote}
          </CText>
          <CInput
            placeholder={strings.password}
            value={password}
            onChangeText={onChangePassword}
            keyboardType={'default'}
            _errorText={errorPassword}
            inputContainerStyle={styles.mv20}
          />
          <CButton
            title={strings.confirm}
            textType="s18"
            onPress={onPressConfirm}
          />
          <CButton
            title={strings.cancel}
            textType="s18"
            onPress={onPressCancel}
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
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  textStyle: {
    ...styles.mb20,
    width: screenWidth - moderateScale(170),
    ...styles.selfCenter,
  },
});
