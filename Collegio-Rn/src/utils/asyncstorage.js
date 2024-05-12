import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGIN_TOKEN, ON_BOARDING, THEME} from './keys';

const StorageGetValue = async () => {
  const asyncData = await AsyncStorage.multiGet([
    ON_BOARDING,
    LOGIN_TOKEN,
    THEME,
  ]);
  const onBoardingValue = !!asyncData[0][1] ? asyncData[0][1] : false;
  const Loginvalue = !!asyncData[1][1] ? JSON.parse(asyncData[1][1]) : false;
  const themeColor = !!asyncData[2][1] ? JSON.parse(asyncData[2][1]) : false;
  return {onBoardingValue, Loginvalue, themeColor};
};

const setAsyncStorageData = async (key, value) => {
  const stringData = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringData);
};

const getAsyncStorageData = async key => {
  const data = await AsyncStorage.getItem(key);
  return JSON.parse(data);
};

const StoreOnbardingData = async value => {
  const jsonvalue = JSON.stringify(value);
  await AsyncStorage.setItem(ON_BOARDING, jsonvalue);
  return;
};
const StoreLoginData = async value => {
  const jsonvalue = JSON.stringify(value);
  await AsyncStorage.setItem(LOGIN_TOKEN, jsonvalue);
  return;
};

function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}

export {
  StorageGetValue,
  StoreOnbardingData,
  StoreLoginData,
  getAsyncStorageData,
  setAsyncStorageData,
  secondsToMilliseconds,
};
