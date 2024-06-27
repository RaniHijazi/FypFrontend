import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { StackNav } from '../../../navigation/NavigationKeys';
import { moderateScale, API_BASE_URL } from '../../../common/constants';
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
    <CSafeAreaView style={[localStyles.safeArea, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Faculties"
        navigation={navigation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        colors={colors}
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
  },
  cardsContainer: {
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(20),
  },
});
