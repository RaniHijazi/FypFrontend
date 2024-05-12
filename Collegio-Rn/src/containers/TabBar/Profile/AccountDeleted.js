import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

//custom imports
import CHeader from '../../../components/common/CHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import {styles} from '../../../themes';
import CButton from '../../../components/common/CButton';
import {moderateScale, screenWidth} from '../../../common/constants';
import {StackNav} from '../../../navigation/NavigationKeys';
import {StoreLoginData} from '../../../utils/asyncstorage';

export default function AccountDeleted({navigation}) {
  const onPressNext = () => {
    try {
      StoreLoginData(false);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: StackNav.AuthNavigation}],
        });
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  return (
    <CSafeAreaView style={styles.justifyCenter}>
      <CHeader style={styles.ph20} />
      <View style={localStyles.containerStyle}>
        <View>
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText type={'b32'} align={'center'} style={styles.mt20}>
            {strings.congrats}
          </CText>
          <CText
            type={'s18'}
            align={'center'}
            style={localStyles.textStyle}
            numberOfLines={2}>
            {strings.deletedSuccessFully}
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
  textStyle: {
    ...styles.mt20,
    width: screenWidth - moderateScale(100),
    ...styles.selfCenter,
  },
});
