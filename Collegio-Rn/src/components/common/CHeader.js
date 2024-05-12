import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

//custom imports
import {styles} from '../../themes';
import CText from './CText';
import {moderateScale} from '../../common/constants';

export default function CHeader(props) {
  const {
    title,
    onPressBack,
    rightIcon,
    isHideBack,
    isLeftIcon,
    onPressRight,
    containerStyle,
    style,
  } = props;
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const goBack = () => navigation.goBack();
  return (
    <View style={[localStyles.container, style]}>
      {!isHideBack && (
        <TouchableOpacity
          onPress={onPressBack || goBack}
          style={[
            localStyles.topContainer,
            {backgroundColor: colors.placeholderColor},
          ]}>
          <Ionicons
            name={'arrow-back'}
            size={moderateScale(24)}
            color={colors.dark ? colors.primary : colors.black}
          />
        </TouchableOpacity>
      )}
      {!!isLeftIcon && isLeftIcon}

      <CText
        numberOfLines={1}
        style={styles.ml10}
        type={'m14'}
        color={colors.dark ? colors.primary : colors.black}>
        {title}
      </CText>
      <TouchableOpacity onPress={onPressRight}>
        <CText type={'s18'} style={containerStyle}>
          {rightIcon ? rightIcon : null}
        </CText>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
  },
  topContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
  },
});
