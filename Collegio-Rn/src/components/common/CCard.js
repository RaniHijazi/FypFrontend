import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CCard = ({ facultyName, facultyImage, onPress }) => {
  return (
    <View style={styles.container}>
      <Image source={facultyImage} style={styles.image} />
      <Text style={styles.name}>{facultyName}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Go To Majors</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    flexDirection: 'column',
    alignItems: 'center',
    width: '47%', // Adjusted width to display two cards in a row
    marginHorizontal: 5,
    elevation: 7,
    shadowColor: '#1E9BD4',
  },
  image: {
    width: 130,
    height: 80,
    borderRadius: 5,
    marginBottom: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0F5CA8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:'90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default CCard;
