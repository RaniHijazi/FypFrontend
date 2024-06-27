import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../assets/images';
import { moderateScale } from '../../common/constants';
import { StackNav } from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';

const CustomHeader = ({ title, navigation, searchQuery, onSearchChange, colors }) => {
  const navigateToProfile = () => {
    navigation.navigate(StackNav.ProfileTab);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.dark ? colors.white : colors.black }]}>{title}</Text>
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <Icon name="search" size={15} color={colors.grayScale4} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.dark ? colors.white : colors.black }]}
          placeholder="Search..."
          placeholderTextColor={colors.dark ? colors.white : colors.black}
          value={searchQuery}
          onChangeText={onSearchChange}
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
    margin: 10,
    borderRadius: 5,
  },
  title: {
    ...typography.fontSizes.f2,
    ...typography.fontWeights.Bold,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
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
  },
  profileContainer: {
    marginLeft: 25,
  },
});

export default CustomHeader;
