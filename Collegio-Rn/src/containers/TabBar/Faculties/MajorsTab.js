import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { TabNav } from '../../../navigation/NavigationKeys';
import { moderateScale } from '../../../common/constants';
import images from '../../../assets/images';
import CustomHeader from '../../../components/common/CustomHeader';
import CTable from '../../../components/common/CTable';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { styles } from '../../../themes';

export default function MajorsTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const navigateToProfile = () => {
    navigation.navigate(TabNav.ProfileTab);
  };

  return (
    <CSafeAreaView>
      <CustomHeader
        title="Majors"
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
      <CTable />
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
