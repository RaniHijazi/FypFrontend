import {StyleSheet} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';

//custom imports
import {styles} from '../../themes';
import {countryData} from '../../api/constant';
import {moderateScale} from '../../common/constants';
import {useSelector} from 'react-redux';

export default function CDropdown(props) {
  const {data, value, onChange, placeholder} = props;
  const colors = useSelector(state => state.theme.theme);

  return (
    <Dropdown
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={[
        localStyles.containerStyle,
        {backgroundColor: colors.placeholderColor},
      ]}
      selectedTextStyle={{color: colors.primary}}
      placeholderStyle={{color: colors.primary}}
      itemTextStyle={{color: colors.primary}}
      itemContainerStyle={{backgroundColor: colors.placeholderColor}}
    />
  );
}

const localStyles = StyleSheet.create({
  containerStyle: {
    height: moderateScale(59),
    borderRadius: moderateScale(10),
    ...styles.ph20,
    ...styles.mv10,
  },
});
