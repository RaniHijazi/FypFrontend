import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//custom imports
import {AuthNav} from '../NavigationKeys';
import {AuthRoute} from '../NavigationRoute';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={AuthNav.Connect}>
      <Stack.Screen name={AuthNav.Connect} component={AuthRoute.Connect} />
      <Stack.Screen name={AuthNav.SignUp} component={AuthRoute.SignUp} />
      <Stack.Screen name={AuthNav.SignIn} component={AuthRoute.SignIn} />
      <Stack.Screen
        name={AuthNav.SignUpDetail}
        component={AuthRoute.SignUpDetail}
      />
      <Stack.Screen
        name={AuthNav.EmailVerification}
        component={AuthRoute.EmailVerification}
      />
      <Stack.Screen
        name={AuthNav.EmailVerified}
        component={AuthRoute.EmailVerified}
      />
      <Stack.Screen
        name={AuthNav.SelectData}
        component={AuthRoute.SelectData}
      />
      <Stack.Screen
        name={AuthNav.InstituteDetail}
        component={AuthRoute.InstituteDetail}
      />
      <Stack.Screen
        name={AuthNav.ForgotPassword}
        component={AuthRoute.ForgotPassword}
      />
      <Stack.Screen
        name={AuthNav.VerifyCode}
        component={AuthRoute.VerifyCode}
      />
      <Stack.Screen
        name={AuthNav.SetNewPassword}
        component={AuthRoute.SetNewPassword}
      />
      <Stack.Screen
        name={AuthNav.PasswordChange}
        component={AuthRoute.PasswordChange}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
