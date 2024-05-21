import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';
import { StackNav } from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';

const CoursesTable = ({ navigation }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const tableData = [
    {
      major: 'Computer Engineering',
      department: 'Software Development',
      details: 'Advanced programming languages, algorithms, and software engineering principles.',
      courses: [
        { name: 'Advanced Programming', credits: 3 },
        { name: 'Algorithms', credits: 4 },
        { name: 'Software Engineering', credits: 3 }
      ]
    },
    {
      major: 'Graphic Design',
      department: 'Creative Arts',
      details: 'Visual communication, typography, and digital media production.',
      courses: [
        { name: 'Typography', credits: 2 },
        { name: 'Digital Media', credits: 3 },
        { name: 'Visual Communication', credits: 3 }
      ]
    },
    {
      major: 'Dental Lab',
      department: 'Health Sciences',
      details: 'Dental materials, prosthetics, and laboratory techniques.',
      courses: [
        { name: 'Dental Materials', credits: 3 },
        { name: 'Prosthetics', credits: 4 },
        { name: 'Lab Techniques', credits: 2 }
      ]
    },
    {
      major: 'Department of Kaza',
      department: 'Administration',
      details: 'Public policy, organizational management, and strategic planning.',
      courses: [
        { name: 'Public Policy', credits: 3 },
        { name: 'Organizational Management', credits: 4 },
        { name: 'Strategic Planning', credits: 3 }
      ]
    },
    {
          major: 'Computer Engineering',
          department: 'Software Development',
          details: 'Advanced programming languages, algorithms, and software engineering principles.',
          courses: [
            { name: 'Advanced Programming', credits: 3 },
            { name: 'Algorithms', credits: 4 },
            { name: 'Software Engineering', credits: 3 }
          ]
        },
        {
          major: 'Graphic Design',
          department: 'Creative Arts',
          details: 'Visual communication, typography, and digital media production.',
          courses: [
            { name: 'Typography', credits: 2 },
            { name: 'Digital Media', credits: 3 },
            { name: 'Visual Communication', credits: 3 }
          ]
        },
        {
          major: 'Dental Lab',
          department: 'Health Sciences',
          details: 'Dental materials, prosthetics, and laboratory techniques.',
          courses: [
            { name: 'Dental Materials', credits: 3 },
            { name: 'Prosthetics', credits: 4 },
            { name: 'Lab Techniques', credits: 2 }
          ]
        },
        {
          major: 'Department of Kaza',
          department: 'Administration',
          details: 'Public policy, organizational management, and strategic planning.',
          courses: [
            { name: 'Public Policy', credits: 3 },
            { name: 'Organizational Management', credits: 4 },
            { name: 'Strategic Planning', credits: 3 }
          ]
        }
  ];

  const toggleRowExpansion = (index) => {
      setExpandedRow(expandedRow === index ? null : index);
    };

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <Text style={styles.headerText }>Major</Text>
            </View>
            <View style={styles.headerItem}>
              <Text style={styles.headerText}>Department</Text>
            </View>
          </View>
          {tableData.map((rowData, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[styles.row, expandedRow === index && styles.expandedRow]}
                onPress={() => toggleRowExpansion(index)}>
                <View style={styles.imageColumn}>
                  <Image source={images.userImage1} style={styles.rowImage} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.rowText]}>{rowData.major}</Text>
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
                  <Text style={styles.expandedHeaderText}>Courses</Text>
                  <View style={styles.courseList}>
                    {rowData.courses.map((course, courseIndex) => (
                      <View key={courseIndex} style={styles.courseItem}>
                        <Text style={styles.courseName}>{course.name}</Text>
                        <Text style={styles.courseCredits}>{course.credits} credits</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '94%',
      backgroundColor: '#fff',
      borderWidth: 0,
      borderColor: '#F5F5F5',
      borderRadius: 5,
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
      width: '45%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
    },
    rowText: {
      ...typography.fontSizes.f12,
          ...typography.fontWeights.Regular,
      color: '#000',
      marginLeft: 5,
    },

      boldText: {
        fontWeight: 'bold',
      },
    rowImage: {
      width: 33,
      height: 33,
      marginRight: 5,
      borderRadius: 18,
    },
    expandedContent: {
      backgroundColor: '#0F5CA830',
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    expandedHeaderText: {
      ...typography.fontSizes.f12,
          ...typography.fontWeights.Bold,
      color: '#000000',
      marginBottom: 5,
      marginTop: 5,
    },
    detailsText: {
      ...typography.fontSizes.f12,
          ...typography.fontWeights.Regular,
      color: '#6F7787',
    },
    coursesText: {
      ...typography.fontSizes.f14,
         ...typography.fontWeights.Bold,
      color: '#fff',
      marginBottom: 5,
      marginLeft: 10,
    },
    courseList: {
      marginTop: 5,
    },
    courseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    courseName: {
        ...typography.fontSizes.f12,
          ...typography.fontWeights.Regular,
      color: '#000',
    },
    courseCredits: {
      ...typography.fontSizes.f12,
          ...typography.fontWeights.Regular,
      color: '#000',
    },
  });

  export default CoursesTable;