import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';
import AppNavigator from './navigation';
import { styles } from './themes';
import signalRService from './common/SignalRService';
import Notification from './components/Notification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration
const RNfirebaseConfig = {
  apiKey: "AIzaSyAS7YMxRnVxkxrUbJJNuI6EpZHVXGAdlhc",
  authDomain: "testing-3a202.firebaseapp.com",
  projectId: "testing-3a202",
  storageBucket: "testing-3a202.appspot.com",
  messagingSenderId: "1083458603626",
  appId: "1:1083458603626:android:a32ef8bff6197540bc5813",
  databaseURL: "https://testing-3a202.firebaseio.com"
};

// Asynchronous Firebase Initialization with Logging
const initializeFirebase = async () => {
  console.log('Initializing Firebase...');
  try {
    if (!firebase.apps.length) {
      await firebase.initializeApp(RNfirebaseConfig);
      console.log('Firebase initialized');
    } else {
      console.log('Firebase already initialized');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
};

const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  } catch (e) {
    console.error("Failed to fetch the user ID from AsyncStorage:", e);
  }
};

const sendFcmTokenToServer = async (userId, fcmToken) => {
  try {
    const response = await fetch('http://192.168.1.141:7210/api/User/updateFcmToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fcmToken,
      }),
    });

    const text = await response.text(); // Get response as text

    try {
      const data = JSON.parse(text); // Try to parse as JSON
      console.log('FCM token sent to server:', data);
    } catch (error) {
      console.log('Non-JSON response:', text); // Log non-JSON response
    }
  } catch (error) {
    console.error('Error sending FCM token to server:', error);
  }
};

const App = () => {
  const colors = useSelector(state => state.theme.theme);
  const [notification, setNotification] = useState(null);
  const [FcmToken, setFcmToken] = useState(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    console.log("FCM Token:", FcmToken);
  }, [FcmToken]);

  useEffect(() => {
    const initialize = async () => {
      await initializeFirebase();
      setIsFirebaseInitialized(true);
      console.log('Firebase initialization status updated to true');
    };

    initialize();
  }, []);

  useEffect(() => {
    const checkFcm = async () => {
      if (isFirebaseInitialized) {
        try {
          await messaging().requestPermission();
          console.log('FCM permission granted');
          const fcm = await messaging().getToken();
          console.log('FCM Token retrieved:', fcm);
          setFcmToken(fcm);

          // Retrieve user ID and send FCM token to server
          const userId = await getUserId();
          if (userId) {
            await sendFcmTokenToServer(userId, fcm);
          }

        } catch (error) {
          console.error("Error getting FCM token:", error);
        }
      } else {
        console.error("Firebase is not initialized");
      }
    };

    if (isFirebaseInitialized) {
      console.log('Firebase is initialized, checking FCM');
      checkFcm();
    }
  }, [isFirebaseInitialized]);

  // SignalR Setup
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        await signalRService.start();
        console.log('App: SignalR connection started');
        signalRService.registerNotificationHandler((message) => {
          console.log('App: Setting notification', message);
          setNotification(message);
        });
      } catch (err) {
        console.error('App: SignalR connection error:', err);
      }
    };

    initializeSignalR();
  }, []);

  const handleDismissNotification = () => {
    console.log('App: Dismissing notification');
    setNotification(null);
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={colors.dark === 'dark' ? 'light-content' : 'dark-content'}
      />
      <AppNavigator />
      {notification && (
        <Notification message={notification} onDismiss={handleDismissNotification} />
      )}
    </View>
  );
};

export default App;
