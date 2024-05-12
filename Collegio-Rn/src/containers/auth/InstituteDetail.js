import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

//custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import CHeader from '../../components/common/CHeader';
import images from '../../assets/images';
import {moderateScale, screenWidth} from '../../common/constants';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import AttachPhoto from '../../components/models/AttachPhoto';
import {StackNav} from '../../navigation/NavigationKeys';
import {StoreLoginData} from '../../utils/asyncstorage';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';

export default function InstituteDetail({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [registrationNo, setRegistrationNo] = useState('');

  const onChangeNumber = item => {
    setRegistrationNo(item);
  };

  const onPressAttach = () => {
    setModalVisible(true);
  };

  const onPressModalClose = () => {
    setModalVisible(false);
  };

  const onPressNext = async () => {
    await StoreLoginData(true);
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
    });
  };

  const onPressCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      console.log('img', image.path);
      setModalVisible(false);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setModalVisible(false);
      console.log('img', image.path);
    });
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.ph20}>
          <CHeader
            onPressRight={onPressNext}
            rightIcon={strings.skip}
            containerStyle={styles.underLineText}
          />
          <Image source={images.logo} style={localStyles.logoImgStyle} />
          <CText
            type={'m32'}
            style={localStyles.contentStyle}
            align={'center'}
            numberOfLines={2}>
            {strings.verifyYourInstitute}
          </CText>
          <CText type={'r14'} align={'center'} numberOfLines={2}>
            {strings.verifyDes}
          </CText>
          <CInput
            placeHolder={strings.registrationNo}
            value={registrationNo}
            onChangeText={onChangeNumber}
            keyboardType={'default'}
          />
          <TouchableOpacity
            onPress={onPressAttach}
            style={[
              localStyles.containerStyle,
              {backgroundColor: colors.placeholderColor},
            ]}>
            <CText type={'r16'} numberOfLines={1}>
              {strings.attachPhoto}
            </CText>
          </TouchableOpacity>
          <CButton
            title={strings.next}
            containerStyle={styles.mt30}
            onPress={onPressNext}
          />
          <CText type={'r14'} numberOfLines={1}>
            {strings.verifyInstituteLater}
          </CText>
        </View>
        <AttachPhoto
          visible={modalVisible}
          onPressModalClose={onPressModalClose}
          onPressCamera={onPressCamera}
          onPressGallery={onPressGallery}
        />
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  logoImgStyle: {
    width: moderateScale(80),
    height: '15%',
    resizeMode: 'contain',
    ...styles.selfCenter,
    ...styles.mt50,
  },
  contentStyle: {
    ...styles.mv20,
    width: screenWidth - moderateScale(190),
    ...styles.selfCenter,
  },
  containerStyle: {
    height: moderateScale(59),
    borderRadius: moderateScale(10),
    ...styles.justifyCenter,
    ...styles.ph20,
    ...styles.mt10,
  },
});
