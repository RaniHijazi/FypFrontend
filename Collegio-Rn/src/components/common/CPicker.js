import React from 'react';
import {StyleSheet, View} from 'react-native'; // Import Picker as RNPicker
import {useSelector} from 'react-redux';
import {styles} from '../../themes';
import typography from '../../themes/typography';
import CText from './CText';
import {Picker} from '@react-native-picker/picker';
import {getHeight, moderateScale} from '../../common/constants';
const CPicker = props => {
  const colors = useSelector(state => state.theme.theme);

  return (
    <View style={[localStyle.inputContainer, props.inputContainerStyle]}>
      <Picker
        {...props}
        style={[
          localStyle.inputBox,
          {color: colors.primary},
          props.inputBoxStyle,
        ]}
        itemStyle={{color: colors.primary}}>
        {props.children}
      </Picker>
    </View>
  );
};

const localStyle = StyleSheet.create({
  inputBox: {
    ...typography.fontSizes.f16,
        ...typography.fontWeights.Regular,
        ...styles.ph15,
        ...styles.flex,

  },
  inputContainer: {
      borderRadius: moderateScale(10),
      ...styles.rowSpaceBetween,
      width: '100%',
      backgroundColor: 'white',
      borderWidth: 0,
      height: moderateScale(49),
      ...Platform.select({
        ios: {
          shadowColor: '#1E9BD4',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 7,
          shadowColor: '#1E9BD4',
        },
      }),
    },
});

export default CPicker;
