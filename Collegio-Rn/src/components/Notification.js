import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notification = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message, onDismiss]);

  return (
    <View style={styles.notification}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    zIndex: 1000, // Ensure it's above other components
  },
  message: {
    color: 'white', // Use 'white' instead of 'black' for better contrast
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Notification;
