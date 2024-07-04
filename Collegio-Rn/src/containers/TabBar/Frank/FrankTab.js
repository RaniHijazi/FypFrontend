import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { FrankIcon, FrankIconWhite } from '../../../assets/svgs'; // Ensure this path points to your icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../common/constants'; // Make sure to define API_BASE_URL
import { SendIconWhite } from '../../../assets/svgs';

const FrankTab = () => {
  const colors = useSelector(state => state.theme.theme);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello I am Frank the new Antonine University Assistant! How can I help you today?', sender: 'Frank' },
    { id: '2', text: 'Sorry I am a new model so please be specific in your questions xD! ', sender: 'Frank' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const flatListRef = useRef(null); // Reference to the FlatList

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

  const callApi = async (question) => {
    try {
      const response = await fetch('http://192.168.0.105:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API call error:', error);
      return 'Sorry, something went wrong. Please try again.';
    }
  };

  const typeWriterEffect = (text, callback) => {
    let index = 0;
    setTypingMessage('');

    const intervalId = setInterval(() => {
      if (index < text.length) {
        setTypingMessage(prev => prev + text[index]);
        index++;
        // Scroll to the bottom as the message is being typed
        flatListRef.current.scrollToEnd({ animated: true });
      } else {
        clearInterval(intervalId);
        callback();
      }
    }, 50); // Reduced the speed of typing here (in milliseconds)
  };

  const handleSend = async () => {
    if (inputMessage.trim()) {
      const userMessage = { id: (messages.length + 1).toString(), text: inputMessage, sender: userName, userImage: userProfileImageUrl };
      setMessages([...messages, userMessage]);
      setInputMessage('');

      // Scroll to the bottom after adding the user's message
      flatListRef.current.scrollToEnd({ animated: true });

      const apiResponse = await callApi(inputMessage);
      typeWriterEffect(apiResponse, () => {
        const frankMessage = { id: (messages.length + 2).toString(), text: apiResponse, sender: 'Frank' };
        setMessages((prevMessages) => [...prevMessages, frankMessage]);
        setTypingMessage('');
        // Scroll to the bottom after adding Frank's message
        flatListRef.current.scrollToEnd({ animated: false });
      });
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.dark ? colors.black : colors.white }]} behavior="padding">
      <View style={[styles.header, { backgroundColor: colors.dark ? colors.black : colors.white }]}>
        <View style={styles.headerContent}>
          {colors.dark ? (
            <FrankIconWhite width={20} height={20} style={styles.frankIcon} />
          ) : (
            <FrankIcon width={20} height={20} style={styles.frankIcon} />
          )}
          <Text style={[styles.title, { color: colors.dark ? colors.white : colors.black }]}>Frank</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef} // Reference to the FlatList
        data={[...messages, ...(typingMessage ? [{ id: 'typing', text: typingMessage, sender: 'Frank' }] : [])]}
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
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Scroll to the bottom when content size changes
      />
      <View style={[styles.inputContainer, { backgroundColor: colors.dark ? colors.black : colors.white }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.dark ? colors.black : colors.white,
              color: colors.dark ? colors.white : colors.black
            }
          ]}
          placeholder="Type a message ..."
          placeholderTextColor={colors.dark ? colors.white : colors.black}
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
          <SendIconWhite />
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
    fontWeight: '900',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 13, // Adjust the padding for the icon button
    borderRadius: 30, // Make the button rounded
  },
  sendButtonText: {
    fontWeight: 'bold',
  },
  userProfileImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 2,
  },
});

export default FrankTab;
