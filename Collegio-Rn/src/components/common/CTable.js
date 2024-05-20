import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';

const CTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  // Sample data for the table rows with additional details
  const tableData = [
    { major: 'Computer Engineering', department: 'Software Development', details: 'Advanced programming languages, algorithms, and software engineering principles.', courses: ['Course 1', 'Course 2', 'Course 3'] },
    { major: 'Graphic Design', department: 'Creative Arts', details: 'Visual communication, typography, and digital media production.', courses: ['Course 1', 'Course 2', 'Course 3'] },
    { major: 'Dental Lab', department: 'Health Sciences', details: 'Dental materials, prosthetics, and laboratory techniques.', courses: ['Course 1', 'Course 2', 'Course 3'] },
    { major: 'Department of Kaza', department: 'Administration', details: 'Public policy, organizational management, and strategic planning.', courses: ['Course 1', 'Course 2', 'Course 3'] },
  ];

  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Major</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Department</Text>
        </View>
      </View>
      {/* Rows */}
      {tableData.map((rowData, index) => (
        <View key={index}>
          <TouchableOpacity
            style={[styles.row, expandedRow === index && styles.expandedRow]}
            onPress={() => toggleRowExpansion(index)}>
            <View style={styles.imageColumn}>
              <Image source={images.userImage1} style={styles.rowImage} />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.rowText}>{rowData.major}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowText}>{rowData.department}</Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              <Ionicons name={expandedRow === index ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
            </View>
          </TouchableOpacity>
          {expandedRow === index && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedHeaderText}>DETAILS</Text>
              <Text style={styles.detailsText}>{rowData.details}</Text>
              <TouchableOpacity style={styles.showCoursesButton}>
                <Text style={styles.showCoursesButtonText}>Show Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#F5F5F5',
    borderRadius:5,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  headerItem: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  expandedRow: {
    backgroundColor: '#0F5CA830',
    borderBottomWidth: 0,
  },
  imageColumn: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    width: '35%',
  },
  rowItem: {
    width:'45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  rowText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5, // Adjust the spacing between the image and text
  },
  rowImage: {
    width: 33,
    height: 33,
    marginRight: 5,
    borderRadius:18,
  },
  expandedContent: {
    backgroundColor: '#0F5CA830',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  expandedHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 11,
    color: '#6F7787',
  },
  showCoursesButton: {
    backgroundColor: '#0F5CA8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 25,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '55%',
  },
  showCoursesButtonText: {
    fontSize: 12,
    color: '#fff',
  },
});

export default CTable;
