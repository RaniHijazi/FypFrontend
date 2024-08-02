import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { moderateScale } from '../../common/constants';
import { StackNav } from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';
import images from '../../assets/images';
import { API_BASE_URL } from '../../common/constants'; // Make sure to import your API base URL
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = ({ title, navigation, searchQuery, onSearchChange, colors }) => {
  const [profilePath, setProfilePath] = useState(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          const userIdInt = parseInt(storedUserId, 10);
          fetchUserById(userIdInt);
          console.log('Retrieved userId:', userIdInt);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    retrieveUserId();
  }, []);

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/User/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();
      setProfilePath(userData.profilePath); // Assuming profilePath is the key in the userData object
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

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
            source={profilePath ? { uri: profilePath } : images.userImage1}
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
