import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../assets/images';
import { moderateScale } from '../../common/constants';
import { TabNav } from '../../navigation/NavigationKeys.js';
import { TabRoute } from '../../navigation/NavigationRoute.js';
import { StackNav } from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';

const CustomHeader = ({ title, navigation }) => {
  const navigateToProfile = () => {
    navigation.navigate(StackNav.ProfileTab);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={15} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileContainer}>
          <Image
            source={images.userImage1}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(25),
    marginLeft: moderateScale(15),
  },
  container: {
    width: '94%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    margin: 10,
    borderRadius: 5,
  },
  title: {
     ...typography.fontSizes.f2,
        ...typography.fontWeights.Bold,
    color: '#333',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...typography.fontSizes.f12,
    ...typography.fontWeights.Regular,
    color: '#333',
  },
  profileContainer: {
    marginLeft: 25,
  },
});

export default CustomHeader;
