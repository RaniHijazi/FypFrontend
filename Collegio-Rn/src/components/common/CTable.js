import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import typography from '../../themes/typography';
import  API_BASE_URL  from '../../common/constants';
import logo from '../../assets/images/logo.png';
const CTable = ({data, navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Major</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Department</Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <CoursesTable major={item} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const CoursesTable = ({major, navigation}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://172.20.10.3:7210/api/University/majors/${major.id}/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, [major.id]);

  const toggleRowExpansion = index => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.row, expandedRow === 0 && styles.expandedRow]}
        onPress={() => toggleRowExpansion(0)}>
        <View style={styles.imageColumn}>
          <Image source={logo} style={styles.rowImage} />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.rowText}>{major.name}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.rowText}>{major.department}</Text>
        </View>
        <View style={{marginLeft: 5}}>
          <Ionicons
            name={
              expandedRow === 0 ? 'chevron-up-outline' : 'chevron-down-outline'
            }
            size={20}
            color="#000"
          />
        </View>
      </TouchableOpacity>
      {expandedRow === 0 && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedHeaderText}>DETAILS</Text>
          <Text style={styles.detailsText}>{major.details}</Text>
          <Text style={styles.expandedHeaderText}>Courses</Text>
          <View style={styles.courseList}>
            {courses.map((course, courseIndex) => (
              <View key={courseIndex} style={styles.courseItem}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseCredits}>
                  {course.credits} credits
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#F5F5F5',
    borderRadius: 5,
    marginBottom: 10, // Added to create space between items
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
    backgroundColor: '#f8f8f8', // Add a background color to distinguish the header
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerItem: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
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

export default CTable;
