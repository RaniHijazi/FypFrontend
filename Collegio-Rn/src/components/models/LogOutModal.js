import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// custom import
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import CText from '../common/CText';
import CButton from '../common/CButton';
import strings from '../../i18n/strings';

export default function LogOutModal(props) {
  const colors = useSelector(state => state.theme.theme);
  let {visible, onPressCancel, onPressLogOut} = props;
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={[
          localStyle.mainViewStyle,
          {backgroundColor: colors.modalBackground},
        ]}>
        <View
          style={[
            localStyle.modalContainer,
            {backgroundColor: colors.placeholderColor},
          ]}>
          <CText type={'B18'} align={'center'}>
            {strings.areYouSureWantToLogout}
          </CText>
          <CButton
            title={strings.cancel}
            type={'M16'}
            containerStyle={localStyle.btnStyle}
            onPress={onPressCancel}
          />
          <TouchableOpacity onPress={onPressLogOut}>
            <CText
              type={'M16'}
              color={colors.alertColor}
              align={'center'}
              style={styles.mt5}>
              {strings.logOut}
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const localStyle = StyleSheet.create({
  mainViewStyle: {
    ...styles.flex,
    ...styles.center,
  },
  modalContainer: {
    width: '80%',
    borderRadius: moderateScale(16),
    ...styles.ph20,
    ...styles.pv30,
  },
  btnStyle: {
    ...styles.selfCenter,
    width: '70%',
    ...styles.mt30,
    ...styles.mb20,
  },
});
