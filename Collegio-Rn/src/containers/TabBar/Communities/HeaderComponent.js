import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderComponent = ({ imageUrl, name, nbMembers, description, isJoined, onJoinPress }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.subTitleContainer}>
            <Ionicons name="people" color="#000" size={20} />
            <Text style={styles.members}>{nbMembers} Members</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social" color="#000" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
            <Text style={styles.joinButtonText}>{isJoined ? 'Leave' : 'Join'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  members: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  joinButton: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
