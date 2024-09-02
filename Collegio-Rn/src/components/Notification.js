import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const Notification = ({ message, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View style={[styles.notification, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>Admission</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onDismiss}>
        <Text style={styles.buttonText}>Mark as Read</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Updated color with transparency
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 10, // Rounded corners
    zIndex: 1000, // Ensure it's above other components
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    color: '#0f5ca8', // Title color
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#0f5ca8', // Message color
    fontSize: 15,
    textAlign: 'center',
  },
  button: {
    marginLeft: 210,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#0f5ca8', // Button text color
    fontSize: 14,
  },
});

export default Notification;