import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import images from '../../../assets/images';
import {colors, styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import {settingData} from '../../../api/constant';
import {changeThemeAction} from '../../../redux/action/themeAction';
import {StoreLoginData, setAsyncStorageData} from '../../../utils/asyncstorage';
import {THEME} from '../../../utils/keys';
import CHeader from '../../../components/common/CHeader';
import LogOutModal from '../../../components/models/LogOutModal';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function Setting({navigation}) {
  const color = useSelector(state => state.theme.theme);
  const [isEnabled, setIsEnabled] = useState(!!color.dark);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const onPressLightTheme = () => {
    setAsyncStorageData(THEME, 'light');
    dispatch(changeThemeAction(colors.light));
  };

  const onPressDarkTheme = () => {
    setAsyncStorageData(THEME, 'dark');
    dispatch(changeThemeAction(colors.dark));
  };

  const onPressItem = item => {
    if (!!item.route) {
      navigation.navigate(item.route);
    }
  };

  const onPressLOut = async () => {
    try {
      setIsModalVisible(false);
      StoreLoginData(false);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: StackNav.AuthNavigation}],
        });
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const onPressLogOut = () => {
    setIsModalVisible(!isModalVisible);
  };
  const onPressCancelBtn = () => {
    setIsModalVisible(false);
  };

  const toggleSwitch = value => {
    if (value) {
      onPressDarkTheme();
    } else {
      onPressLightTheme();
    }
    setIsEnabled(previousState => !previousState);
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={[localStyles.containerStyle, {backgroundColor: color.primary}]}>
        <MaterialCommunityIcons
          name={'dots-vertical'}
          size={moderateScale(20)}
          color={color.white}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={[
          localStyles.topContainer,
          {backgroundColor: color.placeholderColor},
        ]}>
        <CText
          color={color.dark ? color.white : color.primary}
          type={'s16'}
          numberOfLines={1}>
          {item.title}
        </CText>
        {index === 3 ? (
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{true: color.pinnedColor, false: color.gray}}
            thumbColor={color.primary}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        <CHeader />
        <View
          style={[
            localStyles.mainContainer,
            {backgroundColor: color.placeholderColor},
          ]}>
          <View style={localStyles.contentStyle}>
            <Image
              source={images.profilePhoto}
              style={localStyles.imgContainer}
            />
            <CText
              type={'m14'}
              color={color.mainColor}
              numberOfLines={2}
              style={localStyles.textStyle}>
              {strings.alexTsimikas}
            </CText>
          </View>
          <RightIcon />
        </View>
        <CText type={'s16'} numberOfLines={2} style={styles.mv20}>
          {strings.setting}
        </CText>
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <TouchableOpacity
        style={[
          localStyles.topContainer,
          {backgroundColor: color.placeholderColor},
        ]}
        onPress={onPressLogOut}>
        <CText
          color={color.dark ? color.white : color.primary}
          type={'s16'}
          numberOfLines={1}>
          {strings.logOut}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <FlatList
        data={settingData}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeaderComponent />}
        ListFooterComponent={<ListFooterComponent />}
        contentContainerStyle={styles.ph20}
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
      <LogOutModal
        visible={isModalVisible}
        onPressCancel={onPressCancelBtn}
        onPressLogOut={onPressLOut}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.p20,
    borderRadius: moderateScale(15),
    ...styles.rowSpaceBetween,
  },
  imgContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  containerStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.center,
  },
  contentStyle: {
    ...styles.flexRow,
    gap: moderateScale(10),
    ...styles.itemsCenter,
  },
  textStyle: {
    width: '40%',
  },
  topContainer: {
    ...styles.p20,
    ...styles.mb20,
    borderRadius: moderateScale(15),
    ...styles.rowSpaceBetween,
  },
});
