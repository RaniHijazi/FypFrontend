import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';

//custom imports
import {TabNav} from '../NavigationKeys';
import {TabRoute} from '../NavigationRoute';
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import {useSelector} from 'react-redux';
import {HomeIcon, Notification, ProfilePhoto, Search} from '../../assets/svgs';

export default function TabNavigation({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const onPressAddPost = () => {
    navigation.navigate(TabNav.AddPostTab);
  };

  const TabDot = ({focused, icon, messageDot}) => (
    <View style={localStyles.tabViewContainer}>
      <View style={focused ? styles.mt30 : messageDot ? styles.mt15 : null}>
        {icon}
      </View>
      {!focused && messageDot ? (
        <View
          style={[
            localStyles.notificationDot,
            {backgroundColor: colors.redColor},
          ]}
        />
      ) : null}
      {focused ? (
        <View
          style={[localStyles.bottomDotStyle, {backgroundColor: colors.black}]}
        />
      ) : null}
    </View>
  );

  const AddPostIcon = () => {
    return (
      <TouchableOpacity
        onPress={onPressAddPost}
        style={[
          localStyles.AddPostIconStyle,
          {backgroundColor: colors.addPostBtn},
        ]}>
        <Octicons
          name={'plus'}
          size={moderateScale(20)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          localStyles.tabBarStyle,
          {backgroundColor: colors.tabBarColor},
        ],
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={TabNav.HomeTab}
        component={TabRoute.HomeTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabDot focused={focused} icon={<HomeIcon />} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.SearchTab}
        component={TabRoute.SearchTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabDot focused={focused} icon={<Search />} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.AddPostTab}
        component={TabRoute.AddPostTab}
        options={{
          tabBarIcon: ({focused}) => <AddPostIcon />,
        }}
      />

      <Tab.Screen
        name={TabNav.NotificationTab}
        component={TabRoute.NotificationTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabDot
              focused={focused}
              icon={<Notification />}
              messageDot={true}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.ProfileTab}
        component={TabRoute.ProfileTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabDot
              focused={focused}
              icon={<Octicons name="person" size={24} color={'black'} />}
              messageDot={true}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    borderRadius: moderateScale(5),
    ...styles.mb20,
    ...styles.ph20,
    height: moderateScale(63),
    ...styles.mh15,
  },
  bottomDotStyle: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(5),
    ...styles.mt10,
    ...styles.mb10,
  },
  tabViewContainer: {
    ...styles.center,
  },
  AddPostIconStyle: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    ...styles.center,
  },
  notificationDot: {
    height: moderateScale(6),
    width: moderateScale(6),
    borderRadius: moderateScale(3),
    ...styles.mt10,
  },
});
