import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { FrankIcon, FrankIconWhite } from '../../../assets/svgs'; // Ensure this path points to your icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../common/constants'; // Make sure to define API_BASE_URL

const FrankTab = () => {
  const colors = useSelector(state => state.theme.theme);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'Frank' },
    { id: '2', text: 'I am here to assist you with any questions you have.', sender: 'Frank' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchUserById = async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/User/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        console.log('Fetched User Data:', userData); // Log the fetched data to ensure it's correct
        setUserName(userData.fullName || 'User'); // Ensure there is a fallback name
        setUserProfileImageUrl(userData.profilePath || 'https://www.example.com/default-profile.png'); // Fallback image URL
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const userIdInt = parseInt(storedUserId, 10);
          await fetchUserById(userIdInt);
        } else {
          setUserName('You'); // Default name if not found in AsyncStorage
        }
      } catch (error) {
        console.error('Failed to fetch user data from AsyncStorage', error);
        setUserName('You');
      }
    };

    getUserData();
  }, []);

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: (messages.length + 1).toString(), text: inputMessage, sender: userName, userImage: userProfileImageUrl }]);
      setInputMessage('');
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.dark ? colors.black : colors.white }]} behavior="padding">
      <View style={[styles.header, { backgroundColor: colors.dark ? colors.black : colors.white }]}>
        <View style={styles.headerContent}>
          {colors.dark ? (
            <FrankIconWhite width={33} height={33} style={styles.frankIcon} />
          ) : (
            <FrankIcon width={20} height={20} style={styles.frankIcon} />
          )}
          <Text style={[styles.title, { color: colors.dark ? colors.white : colors.black }]}>Frank</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageWrapper}>
            <View style={styles.senderRow}>
              {item.sender === 'Frank' ? (
                colors.dark ? (
                  <FrankIconWhite width={18} height={18} style={styles.frankMessageIcon} />
                ) : (
                  <FrankIcon width={18} height={18} style={styles.frankMessageIcon} />
                )
              ) : (
                <Image source={{ uri: item.userImage || 'https://www.example.com/default-profile.png' }} style={styles.userProfileImage} /> // Fallback image URL
              )}
              <Text style={[styles.senderText, { color: colors.dark ? colors.white : colors.black }]}>{item.sender}</Text>
            </View>
            <Text style={[styles.messageText, { color: colors.dark ? colors.white : colors.black }]}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={[styles.inputContainer, { backgroundColor: colors.dark ? colors.black : colors.white }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.dark ? colors.white : colors.black,
              color: colors.dark ? colors.black : colors.white
            }
          ]}
          placeholder="Type a message"
          placeholderTextColor={colors.dark ? colors.black : colors.white}
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
          <Text style={[styles.sendButtonText, { color: colors.dark ? colors.white : colors.white }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frankIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
  },
  messageWrapper: {
    marginVertical: 5,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderText: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
    marginLeft: 23, // Add some space between the sender name and the text message
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.2,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 15, // Increase the height of the button
    borderRadius: 10,
  },
  sendButtonText: {
    fontWeight: 'bold',
  },
  userProfileImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 5,
  },
});

export default FrankTab;
