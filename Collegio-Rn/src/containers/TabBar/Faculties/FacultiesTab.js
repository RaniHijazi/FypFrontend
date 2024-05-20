import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { TabNav } from '../../../navigation/NavigationKeys';
import { StackNav } from '../../../navigation/NavigationKeys';
import { moderateScale } from '../../../common/constants';
import images from '../../../assets/images';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CCard from '../../../components/common/CCard'; // Import the FacultyCard component
import { styles } from '../../../themes';

export default function FacultiesTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const navigateToProfile = () => {
    navigation.navigate(TabNav.ProfileTab);
  };

  // Dummy faculties data for demonstration
  const faculties = [
    { id: 1, name: 'Faculty 1', image: images.userImage1 },
    { id: 2, name: 'Faculty 2', image: images.userImage1 },
    { id: 3, name: 'Faculty 3', image: images.userImage1 },
    { id: 4, name: 'Faculty 4', image: images.userImage1 },
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
    <CSafeAreaView>
      <CustomHeader
        title="Faculties"
        rightComponent={(
          <TouchableOpacity onPress={navigateToProfile}>
            <Image
              source={images.userImage1} // Replace with the source of your profile picture
              style={localStyles.profileImage}
            />
          </TouchableOpacity>
        )}
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

});
