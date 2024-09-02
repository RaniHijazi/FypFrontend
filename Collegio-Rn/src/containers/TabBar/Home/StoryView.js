import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//custom imports
import { useSelector } from 'react-redux';
import CText from '../../../components/common/CText';
import { getHeight, moderateScale, screenWidth } from '../../../common/constants';
import { styles } from '../../../themes';
import { secondsToMilliseconds } from '../../../utils/asyncstorage';
import { SendIcon } from '../../../assets/svgs';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
const { width, height } = Dimensions.get('window');

function StoryView({ route }) {
  const { users, initialUserIndex } = route.params;
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  console.log('Users:', users);
  console.log('Initial User Index:', initialUserIndex);

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [content, setContent] = useState(users[initialUserIndex]?.stories || []);
  const [end, setEnd] = useState(0);
  const [current, setCurrent] = useState(0);
  const [load, setLoad] = useState(false);
  const [story, setStory] = useState('');
  const [myId, setMyId] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const retrieveUserId = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId !== null) {
              const userIdInt = parseInt(storedUserId, 10);
              setMyId(userIdInt); // Store the user ID in the state variable
            }
          } catch (error) {
            console.error('Error retrieving userId from AsyncStorage:', error);
          }
        };

        retrieveUserId();
      }, []);

  useEffect(() => {
    console.log('Current User Stories:', content);
    if (content.length > 0) {
      play();
    }
  }, [current]);

  const start = (n) => {
    if (content[current]?.storyPath?.endsWith('.mp4')) {
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            onPressNext();
          }
        });
      }
    } else {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          onPressNext();
        }
      });
    }
  };

  const play = () => {
    start(end);
  };

  const onPressNext = () => {
    if (current < content.length - 1) {
      const data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      onNextUser();
    }
  };

  const onNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setContent(users[currentUserIndex + 1]?.stories || []);
      setCurrent(0);
      progress.setValue(0);
      setLoad(false);
    } else {
      onCloseStory();
    }
  };

  const onPressPrevious = () => {
    if (current > 0) {
      const data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      onPreviousUser();
    }
  };

  const onPreviousUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setContent(users[currentUserIndex - 1]?.stories || []);
      setCurrent(users[currentUserIndex - 1]?.stories.length - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      onCloseStory();
    }
  };

  const onCloseStory = () => {
    progress.setValue(0);
    setLoad(false);
    navigation.goBack();
  };

  const onLoadEndImage = () => {
    progress.setValue(0);
    play();
  };

  const onLoadVideo = (status) => {
    setLoad(true);
    setEnd(secondsToMilliseconds(status.duration));
  };

  const onChangeTextStory = (text) => {
    setStory(text);
  };

  const rightAccessory = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <TouchableOpacity>
          <Octicons
            name={'plus'}
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SimpleLineIcons
            name={'microphone'}
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SendIcon />
        </TouchableOpacity>
      </View>
    );
  };

 const deleteStory = async () => {
   const storyId = content[current]?.id; // Assuming each story has an 'id' property
   try {
     const response = await fetch(`http://192.168.1.182:7210/api/Post/${storyId}`, {
       method: 'DELETE',
     });
     if (response.ok) {
       Alert.alert('Story deleted successfully');
       // Remove the deleted story from the content
       const updatedContent = content.filter((_, index) => index !== current);
       setContent(updatedContent);
       if (updatedContent.length === 0) {
         onNextUser();
       } else if (current >= updatedContent.length) {
         setCurrent(updatedContent.length - 1);
       }
     } else {
       console.log('Failed to delete story:', response.status, response.statusText);
       Alert.alert('Failed to delete the story');
     }
   } catch (error) {
     console.error('Error deleting story:', error);
     Alert.alert('An error occurred while deleting the story');
   }
 };
  const confirmDeleteStory = () => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteStory },
      ]
    );
  };

  return (
    <SafeAreaView style={localStyles.containerModal}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.backgroundContainer}>
          {content.length > 0 ? (
            content[current]?.storyPath ? (
              content[current].storyPath.endsWith('.mp4') ? (
                <Video
                  source={{ uri: content[current].storyPath }}
                  rate={1.0}
                  volume={1.0}
                  resizeMode="cover"
                  onReadyForDisplay={play()}
                  onLoad={onLoadVideo}
                  style={{ height: height, width: width }}
                />
              ) : (
                <Image
                  onLoadEnd={onLoadEndImage}
                  source={{ uri: content[current].storyPath }}
                  style={{ width: width, height: height, resizeMode: 'cover' }}
                />
              )
            ) : (
              <Text style={{ color: 'white' }}>No content available</Text>
            )
          ) : (
            <Text style={{ color: 'white' }}>No content available</Text>
          )}
        </View>
        <View style={localStyles.mainContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,1)', 'transparent']}
            style={localStyles.gradientView}
          />
          {/* ANIMATION BARS */}
          <View style={localStyles.animationBar}>
            {content.map((item, key) => (
              <View key={key} style={localStyles.barItemContainer}>
                <Animated.View
                  style={{
                    flex: current === key ? progress : content[key]?.finish,
                    height: 2,
                    backgroundColor: colors.white,
                  }}
                />
              </View>
            ))}
          </View>
          {/* END OF ANIMATION BARS */}
          <View style={localStyles.header}>
            <View style={localStyles.userAvatarContainer}>
              {users[currentUserIndex]?.userProfileImageUrl ? (
                <Image
                  style={localStyles.userImage}
                  source={{ uri: users[currentUserIndex]?.userProfileImageUrl }}
                />
              ) : (
                <View style={[localStyles.placeholderImage, { backgroundColor: colors.gray }]} />
              )}
              <CText type={'S14'} style={styles.pl10}>
                {users[currentUserIndex]?.userFullName}
              </CText>
            </View>
            <View style={localStyles.iconContainer}>
              {content[current]?.userId === myId && (
                <TouchableOpacity onPress={confirmDeleteStory}>
                  <Ionicons name="trash" size={18} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onCloseStory}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={localStyles.nextPreviousContainer}>
            <TouchableWithoutFeedback onPress={onPressPrevious}>
              <View style={styles.flex} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPressNext}>
              <View style={styles.flex} />
            </TouchableWithoutFeedback>
          </View>
          {/* Assuming CInput is a valid input component */}
          <CInput
            placeholder={strings.chatPlaceholder}
            inputContainerStyle={localStyles.inputContainerStyle}
            placeholderTextColor={colors.grayScale5}
            rightAccessory={rightAccessory}
            value={story}
            onChangeText={onChangeTextStory}
          />
        </View>
      </CKeyBoardAvoidWrapper>
    </SafeAreaView>
  );
}

export default StoryView;

const localStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  animationBar: {
    flexDirection: 'row',
    ...styles.pt10,
    ...styles.ph10,
  },
  barItemContainer: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
  },
  nextPreviousContainer: {
    ...styles.flexRow,
    ...styles.flex,
  },
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getHeight(50),
    ...styles.ph15,
  },
  userAvatarContainer: { flexDirection: 'row', alignItems: 'center' },
  userImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: 25,
  },
  placeholderImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: 25,
    backgroundColor: 'gray', // default gray color
  },
  header: {
    height: getHeight(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...styles.ph15,
  },
  gradientView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: getHeight(100),
  },
  inputContainerStyle: {
    borderRadius: moderateScale(50),
    height: moderateScale(52),
    ...styles.mv20,
    width: screenWidth - moderateScale(40),
    ...styles.selfCenter,
  },
  mainContentStyle: {
    ...styles.rowCenter,
    gap: moderateScale(5),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});