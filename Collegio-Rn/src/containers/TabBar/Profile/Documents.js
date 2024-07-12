import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Modal, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { moderateScale, screenWidth } from '../../../common/constants';
import { styles } from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import strings from '../../../i18n/strings';
import { GalleryDark, GalleryLight, AttachmentDark } from '../../../assets/svgs';

export default function Documents({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          fetchUserDocuments(userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const fetchUserDocuments = async (userId) => {
    try {
      const response = await fetch(`http://192.168.0.106:7210/api/documents/UserDocuments?userId=${userId}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const onPressUpload = (documentId) => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectedImage({ uri: image.path, documentId });
      setUploadModalVisible(true);
    });
  };

  const uploadImage = async () => {
    const { uri, documentId } = selectedImage;
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('documentId', documentId);

    try {
      const response = await fetch('http://192.168.0.106:7210/api/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        setUploadSuccess(true);
        setUploadModalVisible(false);
        fetchUserDocuments(await AsyncStorage.getItem('userId')); // Refresh documents list
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedDocument(item);
      setModalVisible(true);
    }}>
      <View style={localStyles.documentRow}>
        <Image source={item.imgUrl ? { uri: item.imgUrl } : images.faculty1} style={localStyles.documentImage} />
        <View style={localStyles.documentInfo}>
          <CText type="s12">{item.name}</CText>
        </View>
        <View style={localStyles.documentStatus}>
          <CText type="s12">{item.status}</CText>
        </View>
        <TouchableOpacity onPress={() => onPressUpload(item.id)}>
          <AttachmentDark />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        {uploadSuccess && (
          <View style={localStyles.successMessage}>
            <Text style={localStyles.successText}>Document uploaded successfully!</Text>
          </View>
        )}
        <Image source={images.logo} style={localStyles.logoImgStyle} />
        <CText type={'s12'} align={'center'} style={[localStyles.textStyle, { color: 'red' }]} numberOfLines={3}>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={localStyles.centeredView}>
            <View style={localStyles.modalView}>
              {selectedDocument && (
                <>
                  <Text style={localStyles.modalTitle}>Description</Text>
                  <Text style={localStyles.modalText}>{selectedDocument.description}</Text>
                  <TouchableOpacity
                    style={[localStyles.button, localStyles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={localStyles.textStyle}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={uploadModalVisible}
          onRequestClose={() => {
            setUploadModalVisible(!uploadModalVisible);
          }}
        >
          <View style={localStyles.fullScreenModal}>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage.uri }} style={localStyles.fullScreenImage} />
                <TouchableOpacity
                  style={[localStyles.button, localStyles.buttonClose]}
                  onPress={uploadImage}
                >
                  <Text style={localStyles.textStyle}>Next</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
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
    color: 'red',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  successMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#28a745',
    padding: 10,
  },
  successText: {
    color: 'white',
    borderRadius: 5,
  },
});
