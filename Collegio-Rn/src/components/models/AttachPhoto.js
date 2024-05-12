import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useSelector} from 'react-redux';

//custom imports
import CText from '../common/CText';
import {styles} from '../../themes';
import strings from '../../i18n/strings';
import {moderateScale} from '../../common/constants';

export default function AttachPhoto(props) {
  const colors = useSelector(state => state.theme.theme);
  const {visible, onPressModalClose, onPressCamera, onPressGallery} = props;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={localStyles.modalMainContainer}>
        <View
          style={[
            localStyles.contentStyle,
            {backgroundColor: colors.placeholderColor},
          ]}>
          <View style={styles.rowSpaceBetween}>
            <CText type={'s24'} numberOfLines={1}>
              {strings.attachPhoto}
            </CText>
            <TouchableOpacity>
              <Ionicons
                name={'close'}
                size={moderateScale(24)}
                color={colors.primary}
                onPress={onPressModalClose}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onPressCamera}
            style={[
              localStyles.bottomContainer,
              {borderColor: colors.primary},
            ]}>
            <SimpleLineIcons
              name={'camera'}
              size={moderateScale(24)}
              color={colors.primary}
              onPress={onPressModalClose}
            />
            <CText style={styles.ml10} type={'m16'} numberOfLines={1}>
              {'Choose From Camera'}
            </CText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressGallery}
            style={[
              localStyles.bottomContainer,
              styles.mb20,
              {borderColor: colors.primary},
            ]}>
            <SimpleLineIcons
              name={'picture'}
              size={moderateScale(24)}
              color={colors.primary}
              onPress={onPressModalClose}
            />
            <CText style={styles.ml10} type={'m16'} numberOfLines={1}>
              {'Choose From Gallery'}
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalMainContainer: {
    ...styles.flex,
    ...styles.justifyCenter,
    ...styles.ph20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentStyle: {
    ...styles.p20,
    borderRadius: moderateScale(20),
    gap: moderateScale(20),
  },
  bottomContainer: {
    ...styles.rowCenter,
    borderWidth: moderateScale(1),
    ...styles.pv15,
    borderRadius: moderateScale(10),
  },
});
