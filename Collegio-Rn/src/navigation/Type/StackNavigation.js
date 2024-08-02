import {StyleSheet} from 'react-native';
import React from 'react';

//custom imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNav} from '../NavigationKeys';
import {StackRoute} from '../NavigationRoute';


const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={StackNav.Splash}>
      <Stack.Screen name={StackNav.Splash} component={StackRoute.Splash} />
      <Stack.Screen
        name={StackNav.OnBoarding}
        component={StackRoute.OnBoarding}
      />
      <Stack.Screen
        name={StackNav.AuthNavigation}
        component={StackRoute.AuthNavigation}
      />
      <Stack.Screen
        name={StackNav.TabBar}
        component={StackRoute.TabNavigation}
      />
      <Stack.Screen
        name={StackNav.OtherPersonProfile}
        component={StackRoute.OtherPersonProfile}
      />
      <Stack.Screen name={StackNav.ViewPost} component={StackRoute.ViewPost} />
      <Stack.Screen name={StackNav.ProfileTab} component={StackRoute.ProfileTab} />
       <Stack.Screen name={StackNav.AddPostTab} component={StackRoute.AddPostTab} />
       <Stack.Screen name={StackNav.AddSubPostTab} component={StackRoute.AddSubPostTab} />
       <Stack.Screen name={StackNav.AddCommunityTab} component={StackRoute.AddCommunityTab} />
       <Stack.Screen name={StackNav.PointScreen} component={StackRoute.PointScreen} />
      <Stack.Screen name={StackNav.Messages} component={StackRoute.Messages} />
      <Stack.Screen name={StackNav.CreateChat} component={StackRoute.CreateChat} />
      <Stack.Screen name={StackNav.CreateGroupScreen} component={StackRoute.CreateGroupScreen} />
      <Stack.Screen
        name={StackNav.ChatScreen}
        component={StackRoute.ChatScreen}
      />

      <Stack.Screen
              name={StackNav. SubCommunity}
              component={StackRoute. SubCommunity}
            />
      <Stack.Screen
              name={StackNav.GroupChatScreen}
              component={StackRoute.GroupChatScreen}
            />

      <Stack.Screen name={StackNav.Setting} component={StackRoute.Setting} />
      <Stack.Screen name={StackNav.MajorsTab} component={StackRoute.MajorsTab} />
      <Stack.Screen name={StackNav.Documents} component={StackRoute.Documents} />
      <Stack.Screen
        name={StackNav.StoryView}
        component={StackRoute.StoryView}
      />
      <Stack.Screen
        name={StackNav.DeleteAccount}
        component={StackRoute.DeleteAccount}
      />
      <Stack.Screen
        name={StackNav.ConfirmDelete}
        component={StackRoute.ConfirmDelete}
      />
      <Stack.Screen
        name={StackNav.AccountDeleted}
        component={StackRoute.AccountDeleted}
      />
      <Stack.Screen
        name={StackNav.ChangePassword}
        component={StackRoute.changePassword}
      />


    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});