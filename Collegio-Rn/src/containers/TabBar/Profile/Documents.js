import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import {moderateScale, screenWidth} from '../../../common/constants';
import {styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import strings from '../../../i18n/strings';
import {
  GalleryDark,
  GalleryLight,
  AttachmentDark,
} from '../../../assets/svgs';


export default function Documents({navigation}) {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Document 1', status: 'Pending', image: images.faculty1 },
    { id: 2, name: 'Document 2', status: 'Accepted', image: images.faculty2 },
    { id: 3, name: 'Document 3', status: 'Pending', image: images.faculty1 },
    { id: 4, name: 'Document 4', status: 'Accepted', image: images.faculty2 },
  //  { id: 5, name: 'Document 5', status: 'Pending', image: images.faculty1 },
   // { id: 6, name: 'Document 6', status: 'Accepted', image: images.faculty2 },
  ]);

  const onPressUpload = (documentId) => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return { ...doc, image: { uri: image.path } };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
    });
  };

  const renderItem = ({ item }) => (
    <View style={localStyles.documentRow}>
      <Image source={item.image} style={localStyles.documentImage} />
      <View style={localStyles.documentInfo}>
        <CText type="s12">{item.name}</CText>
      </View>
      <View style={localStyles.documentStatus}>
        <CText type="s12">{item.status}</CText>
      </View>
      <TouchableOpacity  onPress={() => onPressUpload(item.id)}>
        <AttachmentDark />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={localStyles.tableHeader}>
      <View style={localStyles.headerItem}>
        <CText type="s12">Name</CText>
      </View>
      <View style={localStyles.headerItem}>
        <CText type="s12">Status</CText>
      </View>
    </View>
  );

  return (
    <CSafeAreaView style={styles.flex1}>
      <CHeader />
      <View style={styles.flex1}>
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText type={'s12'} align={'center'} style={localStyles.textStyle} numberOfLines={3}>
          {strings.NoteDocuments}
        </CText>
        {renderHeader()}
        <FlatList
          data={documents}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={localStyles.documentList}
          contentContainerStyle={localStyles.flatListContentContainer}
        />
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
  textStyle: {
    ...styles.m20,
    width: screenWidth - moderateScale(100),
    ...styles.selfCenter,
    color:'red',
  },
  documentList: {
    marginTop: moderateScale(20),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    backgroundColor: '#0F5CA830',
    marginTop: moderateScale(10),
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    marginVertical: moderateScale(5),
    backgroundColor: '#F0F0F0',
    borderRadius: moderateScale(5),
  },
  documentImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'cover',
    borderRadius: moderateScale(5),
  },
  documentInfo: {
    flex: 1,
    marginHorizontal: moderateScale(10),
  },
  documentStatus: {
    flex: 1,
    alignItems: 'center',
  },
  uploadButton: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#007AFF',
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  flatListContentContainer: {
    flexGrow: 1,
  },
});
