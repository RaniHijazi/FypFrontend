import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import images from '../../assets/images';
import {styles} from '../../themes';
import {moderateScale, screenWidth} from '../../common/constants';
import strings from '../../i18n/strings';
import CButton from '../../components/common/CButton';
import {AuthNav} from '../../navigation/NavigationKeys';
import CHeader from '../../components/common/CHeader';

export default function PasswordChange({navigation}) {
  const onPressNext = () => {
    navigation.navigate(AuthNav.SignIn);
  };

  return (
    <CSafeAreaView>
      <CHeader style={styles.ph20} />
      <View style={localStyles.containerStyle}>
        <View>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'s14'}
            align={'center'}
            style={localStyles.mainContainer}
            numberOfLines={3}>
            {strings.passwordChange}
          </CText>
          <CButton
            title={strings.next}
            containerStyle={styles.mt30}
            onPress={onPressNext}
            textType={'s18'}
          />
        </View>
        <View />
      </View>
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
    ...styles.mv20,
    width: screenWidth - moderateScale(120),
    ...styles.selfCenter,
  },
  containerStyle: {
    ...styles.justifyCenter,
    ...styles.ph20,
    height: '100%',
  },
});
