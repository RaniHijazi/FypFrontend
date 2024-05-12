import {FlatList, Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

//cuatom imports
import CSafeAreaView from '../components/common/CSafeAreaView';
import {OnBoardingData} from '../api/constant';
import images from '../assets/images';
import {moderateScale, screenWidth} from '../common/constants';
import {styles} from '../themes';
import CText from '../components/common/CText';
import {StackNav} from '../navigation/NavigationKeys';
import {StoreOnbardingData} from '../utils/asyncstorage';

export default function OnBoarding({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  let slideRef = useRef(null);

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  }, []);

  useEffect(() => {
    manageNavigation();
  }, [currentIndex]);

  const manageNavigation = () => {
    setTimeout(async () => {
      if (currentIndex === 3) {
        await StoreOnbardingData(true);
        return navigation.reset({
          index: 0,
          routes: [{name: StackNav.AuthNavigation}],
        });
      }
    }, 2000);
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <Image source={item.image} style={localStyles.mainImgContainer} />
        <CText
          type={'s18'}
          align={'center'}
          style={localStyles.textTitleStyle}
          numberOfLines={2}>
          {item.title}
        </CText>
        <CText
          color={colors.grayScale5}
          style={localStyles.descriptionStyle}
          align={'center'}
          type={'m16'}
          numberOfLines={3}>
          {item.des}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <Image source={images.topLeftImg} style={localStyles.topLeftImgStyle} />
      <FlatList
        data={OnBoardingData}
        renderItem={renderItem}
        onViewableItemsChanged={_onViewableItemsChanged}
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.rowCenter}>
        {OnBoardingData?.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              localStyles.bottomIndicatorStyle,
              {
                width:
                  index !== currentIndex
                    ? moderateScale(10)
                    : moderateScale(51),
                backgroundColor:
                  index !== currentIndex ? colors.primary : colors.primary,
              },
            ]}
          />
        ))}
      </View>
      <Image
        source={images.bottomRightImg}
        style={localStyles.topRightImgStyle}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  topLeftImgStyle: {
    width: moderateScale(170),
    height: '19%',
  },
  topRightImgStyle: {
    width: moderateScale(170),
    height: '19%',
    ...styles.selfEnd,
  },
  mainImgContainer: {
    width: screenWidth,
    resizeMode: 'contain',
    height: '60%',
  },
  textTitleStyle: {
    ...styles.selfCenter,
    width: screenWidth - moderateScale(200),
    ...styles.mv20,
  },
  descriptionStyle: {
    width: screenWidth - moderateScale(120),
    ...styles.selfCenter,
  },
  bottomIndicatorStyle: {
    height: moderateScale(10),
    borderRadius: moderateScale(10),
    ...styles.mh5,
    ...styles.mt30,
  },
});
