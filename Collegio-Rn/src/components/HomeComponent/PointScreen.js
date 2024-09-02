import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import ProgressSemiCircle from './ProgressSemiCircle';
import CText from '../common/CText';
import CHeader from '../common/CHeader';
import LevelTable from '../common/LevelTable';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getLevelIconName = (level) => {
  switch (level) {
    case 1:
      return 'school';
    case 2:
      return 'event';
    case 3:
      return 'work';
    case 4:
      return 'certificate';
    case 5:
      return 'leaderboard';

    default:
      return 'school';
  }
};

const staticLevelData = [
  { id: 1, name: 'Level 1', rewards: 'Badge', details: 'Entry-level student, getting familiar with university life.' },
  { id: 2, name: 'Level 2', rewards: 'Event', details: 'Engaging with peers, starting to participate in university events.' },
  { id: 3, name: 'Level 3', rewards: 'Workshops', details: 'Engaging with peers, starting to participate in university workshops' },
  { id: 4, name: 'Level 4', rewards: 'Activate Sub Communities', details: 'Actively participating in group projects and discussions.' },
  { id: 5, name: 'Level 5', rewards: 'Discount from University', details: 'Engaging in extracurricular activities, taking on leadership roles.' },

];

const PointScreen = () => {
  const [progress, setProgress] = useState(0);
  const [dailyLikes, setDailyLikes] = useState(0);
  const [dailyPosts, setDailyPosts] = useState(0);
  const [dailyComments, setDailyComments] = useState(0);
  const [level, setLevel] = useState(0); // Initial level set to 0
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

   useEffect(() => {
      const retrieveUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId !== null) {
            const userIdInt = parseInt(storedUserId, 10);
            setUserId(userIdInt);
          }
        } catch (error) {
          console.error('Error retrieving userId from AsyncStorage:', error);
        }
      };

      retrieveUserId();
    }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(`http://192.168.1.141:7210/api/User/${userId}/points`);
        if (response.ok) {
          const points = await response.json();


        setProgress(points);
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    };

    const fetchDailyLikes = async () => {
      try {
        const response = await fetch(`http://192.168.1.141:7210/api/User/${userId}/daily-likes`);
        if (response.ok) {
          const likes = await response.json();


        setDailyLikes(likes);
        }
      } catch (error) {
        console.error('Error fetching daily likes:', error);
      }
    };

    const fetchDailyPosts = async () => {
      try {
        const response = await fetch(`http://192.168.1.141:7210/api/User/${userId}/daily-posts`);
        if (response.ok) {


        const posts = await response.json();
        setDailyPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching daily posts:', error);
      }
    };

    const fetchDailyComments = async () => {
      try {
        const response = await fetch(`http://192.168.1.141:7210/api/User/${userId}/daily-comments`);
        if (response.ok) {


        const comments = await response.json();
        setDailyComments(comments);
        }
      } catch (error) {
        console.error('Error fetching daily comments:', error);
      }
    };

    const fetchLevel = async () => {
      try {
        const response = await fetch(`http://192.168.1.141:7210/api/User/${userId}/level`);
        if (response.ok) {


        const level = await response.json();
        setLevel(level);
        }
      } catch (error) {
        console.error('Error fetching user level:', error);
      }
    };

    fetchPoints();
    fetchDailyLikes();
    fetchDailyPosts();
    fetchDailyComments();
    fetchLevel();
  }, [userId]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <CHeader
        title="Points"
        isHideBack={false}
        rightIcon={<Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.profileImage} />}
      />
      <View style={styles.card}>
        <CText type="B18" style={styles.centeredCardTitle}>Your Leveling Stats</CText>
        <ProgressSemiCircle progress={progress} />
        <TouchableOpacity style={styles.levelContainer} onPress={openModal}>
          <CText type="B18" style={styles.level}>Level {level}</CText>
          <Icon name={getLevelIconName(level)} type="material" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <CText type="B16" style={styles.cardTitle}>Daily Likes</CText>
        <CText type="R15" style={styles.likesCount}>{dailyLikes}/5 Likes Today</CText>
      </View>
      <View style={styles.card}>
        <CText type="B16" style={styles.cardTitle}>Daily Posts</CText>
        <View style={styles.cardContent}>
          <CText type="R15" style={styles.postsCount}>{dailyPosts}/1 Posts Today</CText>
          {dailyPosts === 1 && (
            <CText type="R15" style={styles.pointsEarned}>+20 points</CText>
          )}
        </View>
      </View>
      <View style={styles.card}>
        <CText type="B16" style={styles.cardTitle}>Daily Comments</CText>
        <CText type="R15" style={styles.commentsCount}>{dailyComments}/5 Comments Today</CText>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={modalStyles.container}>
          <View style={{ marginRight: 20 }}>
            <CHeader
              title="Level Details"
              isHideBack={false}
              onPressBack={closeModal}
            />
          </View>
          <LevelTable data={staticLevelData} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 7,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 5,
    color: '#000000',
  },
  centeredCardTitle: {
    textAlign: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  level: {
    marginRight: 5, // Add margin to separate text from the icon
  },
  likesCount: {
    color: '#2ecc71',
  },
  postsCount: {
    color: '#e74c3c',
  },
  commentsCount: {
    color: '#FFD700',
  },
  pointsEarned: {
    color: '#3498db',
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PointScreen;