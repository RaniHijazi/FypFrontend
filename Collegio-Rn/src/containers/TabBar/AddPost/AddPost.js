import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {moderateScale} from '../../../common/constants';
import {styles} from '../../../themes';
import {
  AttachmentDark,
  AttachmentLight,
  CameraDark,
  CameraLight,
  GalleryDark,
  GalleryLight,
  GifDark,
  GifLight,
} from '../../../assets/svgs';

export default function AddPost() {
  const colors = useSelector(state => state.theme.theme);
  const [select, setSelect] = useState(false);
  const [selectImage, setSelectImage] = useState(false);

  const onPressAddPost = () => {
    setSelect(true);
  };

  const onPressClose = () => {
    setSelect(false);
  };

  const onPressCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectImage(image.path);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectImage(image.path);
    });
  };

  return (
    <CSafeAreaView>
      {select ? (
        <View>
          <TouchableOpacity
            onPress={onPressClose}
            style={[
              localStyles.mainContainerStyle,
              {backgroundColor: colors.dark ? colors.primary : colors.black},
            ]}>
            <Ionicons
              name={'close'}
              size={moderateScale(20)}
              color={colors.dark ? colors.black : colors.primaryLight}
            />
          </TouchableOpacity>
          <View
            style={[
              localStyles.topContainer,
              {backgroundColor: colors.dark ? colors.primary : colors.black},
            ]}>
            <TouchableOpacity onPress={onPressGallery}>
              {colors.dark ? <GalleryDark /> : <GalleryLight />}
            </TouchableOpacity>
            <TouchableOpacity>
              {colors.dark ? <GifDark /> : <GifLight />}
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCamera}>
              {colors.dark ? <CameraDark /> : <CameraLight />}
            </TouchableOpacity>
            <TouchableOpacity>
              {colors.dark ? <AttachmentDark /> : <AttachmentLight />}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPressAddPost}
          style={[
            localStyles.containerStyle,
            {backgroundColor: colors.dark ? colors.primary : colors.black},
          ]}>
          <Octicons
            name={'plus'}
            size={moderateScale(20)}
            color={colors.dark ? colors.black : colors.primaryLight}
          />
        </TouchableOpacity>
      )}
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  containerStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
    position: 'absolute',
    right: '5%',
    bottom: moderateScale(-7),
  },
  mainContainerStyle: {
    height: moderateScale(32),
    width: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
    position: 'absolute',
    right: '52%',
    bottom: moderateScale(-7),
  },
  topContainer: {
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.ph20,
    ...styles.center,
    position: 'absolute',
    right: '5%',
    bottom: moderateScale(-7),
    ...styles.flexRow,
    gap: moderateScale(10),
  },
});
