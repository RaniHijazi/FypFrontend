import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

//custom imports
import {moderateScale} from '../../common/constants';
import CText from '../common/CText';
import {styles} from '../../themes';

export default function PopularCategory(props) {
  const {chipsData, borderColor = null, bgColor, textColor} = props;
  const colors = useSelector(state => state.theme.theme);
  const [select, setSelect] = useState('Posts');

  const onPressSelect = item => {
    setSelect(item);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.mainContainer,
          {
            borderColor: borderColor ? borderColor : colors.mainColor,
            backgroundColor:
              select === item ? bgColor : colors.placeholderColor,
          },
        ]}
        onPress={() => onPressSelect(item)}>
        <CText
          type={'r12'}
          color={
            select === item
              ? textColor
              : colors.dark
              ? colors.white
              : colors.black
          }
          numberOfLines={1}>
          {item}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={chipsData}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.mv20}
      bounces={false}
    />
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    height: moderateScale(30),
    borderWidth: moderateScale(1),
    ...styles.center,
    ...styles.ph20,
    borderRadius: moderateScale(18),
    ...styles.selfCenter,
    ...styles.mr10,
  },
});
