import React, { useEffect, useState } from 'react';
import { StatusBar, View, Button } from 'react-native';
import { useSelector } from 'react-redux';
import AppNavigator from './navigation';
import { styles } from './themes';
import signalRService from './common/SignalRService';
import Notification from './components/Notification'; // Ensure correct path

const App = () => {
  const colors = useSelector(state => state.theme.theme);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    signalRService.start().then(() => {
      console.log('App: SignalR connection started');
      signalRService.registerNotificationHandler((message) => {
        console.log('App: Setting notification', message);
        setNotification(message);
      });
    }).catch(err => {
      console.log('App: SignalR connection error:', err);
    });
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
