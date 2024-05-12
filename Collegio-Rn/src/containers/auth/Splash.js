import {Image, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';

// custom imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import {screenHeight, screenWidth} from '../../common/constants';
import images from '../../assets/images';
import {StorageGetValue} from '../../utils/asyncstorage';
import {StackNav} from '../../navigation/NavigationKeys';
import { changeThemeAction } from '../../redux/action/themeAction';
import { colors } from '../../themes';

export default function Splash({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    asyncProcess();
    SplashScreen?.hide();
  }, []);

  const asyncProcess = async () => {
    try {
      let asyncData = await StorageGetValue();
      if (asyncData) {
        let {onBoardingValue, Loginvalue,themeColor} = asyncData;
        // For Apply Theme
        if(!!themeColor){
          if(themeColor === 'light'){
            dispatch(changeThemeAction(colors.light))
          }else{
            dispatch(changeThemeAction(colors.dark))
          }
        }
        // For Navigate to specific Flow
        if (!!Loginvalue) {
          navigation.replace(StackNav.TabBar);
        } else if (!!onBoardingValue) {
          navigation.replace(StackNav.AuthNavigation);
        } else {
          navigation.replace(StackNav.OnBoarding);
        }
      }
    } catch (e) {
      console.log('error ', e);
    }
  };

  return (
    <CSafeAreaView>
      <Image source={images.splash} style={localStyles.imgContainer} />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imgContainer: {
    width: screenWidth,
    height: screenHeight,
  },
});
