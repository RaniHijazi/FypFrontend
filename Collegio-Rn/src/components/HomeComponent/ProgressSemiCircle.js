import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const radius = width / 4;
const strokeWidth = 20;
const circumference = 2 * Math.PI * radius;
const halfCircle = radius + strokeWidth / 2;

const ProgressCircle = ({ progress }) => {
  const normalizedProgress = Math.min(progress, 1000);
  const progressValue = (normalizedProgress / 1000) * circumference;

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
        viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke="#d3d3d3"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke="#3498db"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progressValue}
          />
        </G>
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Points</Text>
        <Text style={styles.value}>{progress}/1,000</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProgressCircle;
