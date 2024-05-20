import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={15}olor="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25, // Increased paddingTop
    paddingBottom: 25, // Increased paddingBottom
    backgroundColor: '#fff', // Change the background color as needed
    borderBottomWidth: 0,
    margin: 10, borderRadius: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333', // Change the text color as needed
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: '#fff',//hange the background color of the search container as needed
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40, // Increased height of the search container
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#333', // Change the text color of the search input as needed
  },
});

export default CustomHeader;
