import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { TabNav } from '../../../navigation/NavigationKeys';
import { moderateScale, API_BASE_URL } from '../../../common/constants';
import CustomHeader from '../../../components/common/CustomHeader';
import CTable from '../../../components/common/CTable';
import CSafeAreaView from '../../../components/common/CSafeAreaView';

export default function MajorsTab({ route, navigation }) {
  const { facultyId } = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [majors, setMajors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/University/faculties/${facultyId}/majors`);
        const data = await response.json();
        setMajors(data);
      } catch (error) {
        console.error('Error fetching majors:', error);
      }
    };

    fetchMajors();
  }, [facultyId]);

  const navigateToProfile = () => {
    navigation.navigate(TabNav.ProfileTab);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // You can implement search functionality here if needed
  };

  return (
    <CSafeAreaView style={[localStyles.safeArea, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Majors"
        navigation={navigation}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        colors={colors}
      />
      <CTable data={majors} navigation={navigation} />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
});
