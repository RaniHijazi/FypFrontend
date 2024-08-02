import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// Custom imports
import { TabNav } from '../../navigation/NavigationKeys.js';
import { StackNav } from '../../navigation/NavigationKeys';
import { AuthNav } from '../../navigation/NavigationKeys';
export interface ProgressBarProps {
  progress: number; // Progress value from 0 to 100
}

const CProgressbar: React.FC<ProgressBarProps> = ({ navigation,progress }) => {
    const onPressProgressBar = () => {
        navigation.navigate(StackNav.PointScreen);
      };
  return (
  <TouchableOpacity onPress={onPressProgressBar}>
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Next Level</Text>
        <Text style={styles.text}>125/1000</Text>
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
    borderRadius:3,
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
     fontSize: 6.5,// Add some spacing between the progress text and the bar
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
