import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { TabNav } from '../../../navigation/NavigationKeys';
import { moderateScale } from '../../../common/constants';
import CustomHeader from '../../../components/common/CustomHeader';
import CHeader from '../../../components/common/CHeader';
import CTable from '../../../components/common/CTable';
import CSafeAreaView from '../../../components/common/CSafeAreaView';


export default function MajorsTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  const navigateToProfile = () => {
    navigation.navigate(TabNav.ProfileTab);
  };

  return (
    <CSafeAreaView style={localStyles.safeArea}>
      <CHeader />
      <CustomHeader
        title="Majors"
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
      <CTable />
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
});
