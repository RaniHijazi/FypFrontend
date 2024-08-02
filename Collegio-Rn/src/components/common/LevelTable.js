import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CText from './CText';

const LevelTable = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.levelHeader}>
        <CText type="B18" style={styles.levelName}>{item.name}</CText>
        <CText type="R16" style={styles.levelRewards}>{item.rewards}</CText>
      </View>
      <CText type="R14" style={styles.levelDetails}>{item.details}</CText>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  levelName: {
    color: '#000',
  },
  levelRewards: {
    color: '#3498db',
  },
  levelDetails: {
    color: '#555',
  },
});

export default LevelTable;
