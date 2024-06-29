import { StyleSheet, View, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Custom imports
import { TabNav } from '../NavigationKeys';
import { TabRoute } from '../NavigationRoute';
import { moderateScale } from '../../common/constants';
import { styles } from '../../themes';
import { useSelector } from 'react-redux';
import { HomeIcon, Notification, Search, OfficeIcon, CommunityIcon, FrankIcon } from '../../assets/svgs';

export default function TabNavigation({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const TabDot = ({ focused, icon, messageDot, isCommunity }) => (
    <View style={localStyles.tabViewContainer}>
      <View style={focused ? styles.mt30 : messageDot ? styles.mt15 : null}>
        {isCommunity ? (
          <View style={localStyles.communityIconWrapper}>
            {icon}
          </View>
        ) : (
          icon
        )}
      </View>
      {!focused && messageDot ? (
        <View
          style={[
            localStyles.notificationDot,
            { backgroundColor: colors.redColor },
          ]}
        />
      ) : null}
      {focused ? (
        <View
          style={[localStyles.bottomDotStyle, { backgroundColor: colors.black }]}
        />
      ) : null}
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          localStyles.tabBarStyle,
          { backgroundColor: colors.tabBarColor, display: keyboardVisible ? 'none' : 'flex' },
        ],
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={TabNav.HomeTab}
        component={TabRoute.HomeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot focused={focused} icon={<HomeIcon />} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.SearchTab}
        component={TabRoute.SearchTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot focused={focused} icon={<Search />} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.FrankTab}
        component={TabRoute.FrankTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot focused={focused} icon={<FrankIcon />} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.CommunitiesTab}
        component={TabRoute.CommunitiesTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot focused={focused} icon={<CommunityIcon />} isCommunity={true} />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.NotificationTab}
        component={TabRoute.NotificationTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot
              focused={focused}
              icon={<Notification />}
              messageDot={true}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.FacultiesTab}
        component={TabRoute.FacultiesTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabDot
              focused={focused}
              icon={<OfficeIcon />}
              messageDot={false}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    height: moderateScale(63),
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
  notificationDot: {
    height: moderateScale(6),
    width: moderateScale(6),
    borderRadius: moderateScale(3),
    ...styles.mt10,
  },
  communityIconWrapper: {
    transform: [{ scale: 1 }], // Adjust the scale value as needed
  },
});
