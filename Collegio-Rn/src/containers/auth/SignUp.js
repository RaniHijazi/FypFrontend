import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

//custom import
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import images from '../../assets/images';
import CButton from '../../components/common/CButton';
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import {AuthNav} from '../../navigation/NavigationKeys';
import CHeader from '../../components/common/CHeader';

export default function SignUp({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressButton = () => {
    navigation.navigate(AuthNav.SignUpDetail);
  };


  return (
    <CSafeAreaView>
      <CHeader style={styles.ph20} />
      <View style={localStyles.containerStyle}>
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText
          align={'center'}
          type={'m18'}
          numberOfLines={1}
          style={styles.mv25}>
          {strings.whoAreYou}
        </CText>
        <CButton
          title={strings.HSstudent}
          color={colors.textColor}
          textType={'s18'}
          onPress={onPressButton}
        />
        <CButton
          title={strings.UAstudent}
          color={colors.textColor}
          textType={'s18'}
          onPress={onPressButton}
        />
        <CButton
          title={strings.GradStudent}
          color={colors.textColor}
          textType={'s18'}
          onPress={onPressButton}
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  logoImgStyle: {
    width: moderateScale(80),
    height: '15%',
    resizeMode: 'contain',
    ...styles.selfCenter,
  },
  containerStyle: {
    ...styles.justifyCenter,
    ...styles.flex,
    ...styles.ph20,
  },
});
