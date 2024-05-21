import React from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { TabNav } from '../../../navigation/NavigationKeys';
import { StackNav } from '../../../navigation/NavigationKeys';
import { moderateScale } from '../../../common/constants';
import images from '../../../assets/images';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CCard from '../../../components/common/CCard';
import { styles } from '../../../themes';

export default function FacultiesTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  // Dummy faculties data for demonstration
  const faculties = [
    { id: 1, name: 'Faculty 1', image: images.faculty1 },
    { id: 2, name: 'Faculty 2', image: images.faculty2 },
    { id: 3, name: 'Faculty 3', image: images.faculty3 },
    { id: 4, name: 'Faculty 4', image: images.faculty4 },
    // Add more faculties as needed
  ];

  const renderFacultyCard = ({ item }) => (
    <CCard
      facultyName={item.name}
      facultyImage={item.image}
      onPress={() => {
        navigation.navigate(StackNav.MajorsTab);
      }}
    />
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
            />
          </View>
        )}
      />
      <FlatList
        data={faculties}
        renderItem={renderFacultyCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2} // Display two cards in each row
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


