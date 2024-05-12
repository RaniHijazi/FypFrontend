import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import {checkPlatform, moderateScale} from '../../../common/constants';
import strings from '../../../i18n/strings';
import {chatData} from '../../../api/constant';
import CInput from '../../../components/common/CInput';
import {SendIcon} from '../../../assets/svgs';

export default function ChatScreen({route}) {
  const data = route?.params?.data;
  const colors = useSelector(state => state.theme.theme);
  const [chat, setChat] = useState('');

  const onChangeTextChat = text => {
    setChat(text);
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
            color={colors.dark ? colors.black : colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SendIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.containerStyle, {backgroundColor: colors.primary}]}>
        <MaterialCommunityIcons
          name={'dots-vertical'}
          size={moderateScale(20)}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View
          style={[
            localStyles.senderContainer,
            {
              backgroundColor:
                item.type == 'sender'
                  ? colors.primary
                  : colors.placeholderColor,
              alignSelf: item.type == 'sender' ? 'flex-end' : 'flex-start',
            },
          ]}>
          <View style={styles.flexRow}>
            {item.type === 'receiver' ? (
              <Image source={data?.image} style={localStyles.containerStyle} />
            ) : null}
            <CText
              style={[styles.flex,styles.ph10]}
              color={item.type == 'sender' ? colors.white : colors.mainColor}
              type="m16">
              {item.message}
            </CText>
          </View>
          {item.type === 'receiver' ? (
            <CText color={colors.grayScale5} style={styles.pl10} type="r12">
              {item.time}
            </CText>
          ) : null}
        </View>
        {item.type === 'sender' && item.time ? (
          <CText
            color={colors.grayScale5}
            style={localStyles.timeStyle}
            type="r12">
            {item.time}
          </CText>
        ) : null}
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <View style={styles.ph20}>
        <CHeader rightIcon={<RightIcon />} />
        <View style={localStyles.contentStyle}>
          <Image source={data.image} style={localStyles.containerStyle} />
          <CText color={colors.mainColor} type={'b14'} numberOfLines={1}>
            {data.name}
          </CText>
          <CText color={colors.grayScale5} type={'r12'} numberOfLines={1}>
            {strings.date}
          </CText>
        </View>
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={
          checkPlatform() === 'ios' ? moderateScale(50) : null
        }
        style={localStyles.contentMainStyle}
        behavior={checkPlatform() === 'ios' ? 'padding' : null}>
        <View style={styles.flex}>
          <FlatList
            data={chatData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
          />
        </View>
        <CInput
          placeholder={strings.chatPlaceholder}
          inputContainerStyle={localStyles.inputContainerStyle}
          placeholderTextColor={colors.grayScale5}
          rightAccessory={rightAccessory}
          value={chat}
          onChangeText={onChangeTextChat}
        />
      </KeyboardAvoidingView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  containerStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
  },
  contentStyle: {
    ...styles.itemsCenter,
    gap: moderateScale(5),
  },
  senderContainer: {
    borderRadius: moderateScale(16),
    ...styles.p15,
    ...styles.mv10,
    ...styles.itemsEnd,
    maxWidth: '85%',
  },
  timeStyle: {
    ...styles.selfEnd,
    ...styles.pr10,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(50),
    height: moderateScale(52),
    ...styles.mv20,
  },
  mainContentStyle: {
    ...styles.rowCenter,
    gap: moderateScale(5),
  },
  contentMainStyle: {
    ...styles.flex,
    ...styles.ph20,
  },
});
