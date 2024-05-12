import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import images from '../../assets/images';
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import CButton from '../../components/common/CButton';
import {AuthNav} from '../../navigation/NavigationKeys';
import CHeader from '../../components/common/CHeader';

export default function EmailVerified({route, navigation}) {
  const title = route?.params?.title;

  const onPressNext = () => {
    navigation.navigate(AuthNav.SelectData, {title: title});
  };

  return (
    <CSafeAreaView style={styles.justifyCenter}>
      <CHeader style={styles.ph20} />
      <View style={localStyles.containerStyle}>
        <View>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'s18'}
            align={'center'}
            style={styles.mt20}
            numberOfLines={1}>
            {strings.Congratulations}
          </CText>
          <CText type={'s18'} align={'center'} numberOfLines={1}>
            {strings.emailVerified}
          </CText>
          <CButton
            title={strings.next}
            containerStyle={styles.mt50}
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
  containerStyle: {
    ...styles.justifyCenter,
    ...styles.ph20,
    height: '100%',
  },
});
