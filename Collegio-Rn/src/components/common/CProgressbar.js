import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const CProgressbar = () => {
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0); // State to store the actual points
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const userId = 1; // Set userId to 1 directly

  const fetchPoints = async () => {
    try {
      const response = await fetch(`http://192.168.1.182:7210/api/User/${userId}/points`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const points = await response.json();
      setPoints(points); // Set the actual points
      setProgress((points / 1000) * 100); // Assuming points are out of 1000
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPoints();
    }
  }, [isFocused]);

  const onPressProgressBar = () => {
    navigation.navigate('PointScreen'); // Assuming 'PointScreen' is the name of the screen
  };

  return (
    <TouchableOpacity onPress={onPressProgressBar}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Next Level</Text>
          <Text style={styles.text}>{points}/1000</Text>
         </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.fill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.text, styles.progressText]}>{progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 3,
  },
  textContainer: {
    marginBottom: 5,
  },
  text: {
    fontSize: 8,
    color: '#000000',
    textAlign: 'left',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 5,
    fontSize: 6.5, // Add some spacing between the progress text and the bar
  },
  progressBar: {
    flex: 1,
    height: 5, // Adjust the height as needed
    backgroundColor: '#B9E5FF', // Background color of the progress bar container
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#15ABFF', // Color of the filled portion indicating progress
  },
});

export default CProgressbar;
