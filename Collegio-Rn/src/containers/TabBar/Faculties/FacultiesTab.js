import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { StackNav } from '../../../navigation/NavigationKeys';
import { moderateScale,API_BASE_URL } from '../../../common/constants';
import images from '../../../assets/images';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CCard from '../../../components/common/CCard';

export default function FacultiesTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/University/faculties`)
      .then(response => response.json())
      .then(data => setFaculties(data))
      .catch(error => console.error('Error fetching faculties:', error));
  }, []);

  const renderFacultyCard = ({ item }) => (
    <CCard
      facultyName={item.name}
      facultyImage={item.image ? { uri: item.image } : images.defaultFaculty} // Assuming defaultFaculty is a placeholder image
      onPress={() => {
        navigation.navigate(StackNav.MajorsTab, { facultyId: item.id });
      }}
    />
  );

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CSafeAreaView style={localStyles.safeArea}>
      <CustomHeader
        title="Faculties"
        navigation={navigation}
        searchBar={(
          <View style={localStyles.searchContainer}>
            <TextInput
              style={localStyles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>
        )}
      />
      <FlatList
        data={filteredFaculties}
        renderItem={renderFacultyCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={localStyles.cardsContainer}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(20),
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    height: moderateScale(40),
    marginRight: moderateScale(10),
  },
  profileImage: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(20),
  },
  cardsContainer: {
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(20),
  },
});
