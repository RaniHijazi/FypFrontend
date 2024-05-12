import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';

//custom imports
import {moderateScale} from '../../common/constants';
import CSafeAreaView from '../common/CSafeAreaView';
import CHeader from '../common/CHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import CKeyBoardAvoidWrapper from '../common/CKeyBoardAvoidWrapper';
import CInput from '../common/CInput';
import {messageList, pinnedUserList} from '../../api/constant';
import CText from '../common/CText';
import {StackNav} from '../../navigation/NavigationKeys';

export default function Messages({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState();

  const onChangeTextSearch = item => {
    setSearch(item);
  };

  const onPressMessage = item => {
    navigation.navigate(StackNav.ChatScreen, {data: item});
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.containerStyle, {backgroundColor: colors.primary}]}>
        <AntDesign
          name={'setting'}
          size={moderateScale(20)}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };

  const rightAccessory = () => {
    return (
      <TouchableOpacity>
        <Ionicons
          name={'search-sharp'}
          size={moderateScale(24)}
          color={colors.dark ? colors.grayScale4 : colors.black}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
      onPress={() => onPressMessage(item)}
        style={[
          localStyles.wrapContainer,
          {backgroundColor: colors.pinnedColor},
        ]}>
        <Image source={item.image} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText
            type={'m12'}
            numberOfLines={1}
            color={colors.grayScale5}
            align={'center'}>
            {item.name}
          </CText>
          {item.selected ? (
            <View
              style={[localStyles.dotStyle, {backgroundColor: colors.dotColor}]}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemMessage = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressMessage(item)}
        style={[
          localStyles.topContainerStyle,
          localStyles.containerTopStyle,
          {backgroundColor: colors.placeholderColor},
        ]}>
        <View style={localStyles.messageContent}>
          <Image source={item.image} style={localStyles.messageContainer} />
          <View style={{gap: moderateScale(5)}}>
            <View style={styles.flexRow}>
              <CText color={colors.mainColor} type={'b14'} numberOfLines={1}>
                {item.name}
              </CText>
              {item.selected ? (
                <View
                  style={[
                    localStyles.dotStyle,
                    {backgroundColor: colors.dotColor},
                  ]}
                />
              ) : null}
            </View>
            <CText type={'r14'} numberOfLines={1}>
              {item.message}
            </CText>
          </View>
        </View>
        <CText type={'r14'} numberOfLines={1} color={colors.grayScale5}>
          {item.time}
        </CText>
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={[
          localStyles.topContainerStyle,
          {backgroundColor: colors.placeholderColor},
        ]}>
        <CText
          type={'m12'}
          numberOfLines={1}
          color={colors.grayScale5}
          style={styles.mb10}>
          {strings.pinned}
        </CText>
        <FlatList
          data={pinnedUserList}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper
        contentContainerStyle={localStyles.contentContainerStyle}>
        <CHeader title={strings.messages} rightIcon={<RightIcon />} />
        <CInput
          inputContainerStyle={[
            localStyles.inputContainerStyle,
            {shadowColor: colors.dark ? colors.black : colors.white},
          ]}
          placeHolder={strings.messagesPlaceHolder}
          placeholderTextColor={colors.grayScale4}
          rightAccessory={rightAccessory}
          value={search}
          onChangeText={onChangeTextSearch}
        />
        <FlatList
          data={messageList}
          renderItem={renderItemMessage}
          ListHeaderComponent={<ListHeaderComponent />}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.mb20}
        />
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  containerStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
  },
  contentContainerStyle: {
    ...styles.flexGrow1,
    ...styles.ph20,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(32),
  },
  topContainerStyle: {
    ...styles.p15,
    ...styles.mv10,
    borderRadius: moderateScale(15),
    ...Platform.select({
      ios: {
        shadowColor: '#1E9BD4',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
        shadowColor: '#1E9BD4',
      },
    }),
  },
  imageContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  wrapContainer: {
    ...styles.p15,
    ...styles.mr10,
    borderRadius: moderateScale(15),
    ...styles.itemsCenter,
  },
  dotStyle: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  contentStyle: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    gap: moderateScale(5),
    ...styles.mt10,
  },
  messageContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  containerTopStyle: {
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  messageContent: {
    ...styles.flexRow,
    ...styles.flex,
    gap: moderateScale(10),
  },
});
