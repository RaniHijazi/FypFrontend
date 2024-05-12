import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

//custom imports
import {styles} from '../../themes';
import {moderateScale, screenWidth} from '../../common/constants';
import CText from '../common/CText';
import {Comment, Like, Share} from '../../assets/svgs';
import {StackNav} from '../../navigation/NavigationKeys';

export default function PostComponent(props) {
  const {item, onPress} = props;
  const navigation = useNavigation();
  let slideRef = useRef(null);
  const colors = useSelector(state => state.theme.theme);
  
  const [isSaved, setIsSaved] = useState();
  const [liked, setLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  }, []);

  const onPressIsSaved = item => {
    setIsSaved(!isSaved);
  };

  const onPressLiked = () => {
    setLiked(!liked);
  };

  const onPressViewPost = item => {
    navigation.navigate(StackNav.ViewPost, {item: item});
  };

  const RenderComment = ({icon, text, onPress}) => {
    return (
      <TouchableOpacity style={localStyles.contentStyle} onPress={onPress}>
        {icon}
        <CText
          type={'s12'}
          numberOfLines={1}
          color={colors.dark ? colors.white : colors.black}>
          {text}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderPostImg = ({item}) => {
    return <Image source={item} style={localStyles.postMainImgStyle} />;
  };

  const RenderLikeComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLiked}>
        <AntDesign
          name={liked ? 'like1' : 'like2'}
          size={moderateScale(16)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        localStyles.topContainerStyle,
        {backgroundColor: colors.placeholderColor},
      ]}>
      <View style={localStyles.mainContainer}>
        <TouchableOpacity style={styles.flexRow} onPress={onPress}>
          <Image source={item.image} style={localStyles.postImgStyle} />
          <View>
            <CText
              type={'b14'}
              color={colors.dark ? colors.white : colors.black}
              numberOfLines={1}>
              {item.name}
            </CText>
            <CText color={colors.grayScale5} numberOfLines={1} type={'m12'}>
              {item.time}
            </CText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressViewPost(item)}>
          <MaterialCommunityIcons
            name={'dots-vertical'}
            size={moderateScale(30)}
            color={colors.dark ? colors.primary : colors.black}
          />
        </TouchableOpacity>
      </View>
      {item.des ? (
        <CText
          type={'r16'}
          style={styles.mv10}
          numberOfLines={3}
          color={colors.dark ? colors.white : colors.black}>
          {item.des}
        </CText>
      ) : null}
      {item.post ? (
        <View>
          <FlatList
            data={item?.post}
            renderItem={renderPostImg}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
            onViewableItemsChanged={_onViewableItemsChanged}
            ref={slideRef}
          />
          <View style={styles.rowCenter}>
            {item?.post?.map((_, index) => (
              <View
                key={index.toString()}
                style={[
                  localStyles.bottomIndicatorStyle,
                  {
                    width:
                      index !== currentIndex
                        ? moderateScale(5)
                        : moderateScale(4),
                    backgroundColor:
                      index !== currentIndex
                        ? colors.grayScale5
                        : colors.dark
                        ? colors.primary
                        : colors.black,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.rowSpaceBetween}>
        <View style={localStyles.contentStyle}>
          <RenderComment icon={<RenderLikeComponent />} text={item.like} />
          <RenderComment
            icon={<Comment />}
            text={item.comment}
            onPress={() => onPressViewPost(item)}
          />
          <RenderComment icon={<Share />} text={item.share} />
        </View>
        <TouchableOpacity onPress={() => onPressIsSaved(item)}>
          <MaterialCommunityIcons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={moderateScale(22)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  topContainerStyle: {
    ...styles.p15,
    borderRadius: moderateScale(10),
    ...styles.mb20,
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
  contentStyle: {
    ...styles.flexRow,
    gap: moderateScale(10),
    ...styles.mt10,
  },
  postMainImgStyle: {
    width: screenWidth - moderateScale(80),
    height: moderateScale(158),
    borderRadius: moderateScale(16),
    ...styles.mr10,
    ...styles.mv10,
  },
  mainContainer: {
    ...styles.flexRow,
    ...styles.justifyBetween,
    ...styles.mv10,
  },
  postImgStyle: {
    height: moderateScale(32),
    width: moderateScale(32),
    borderRadius: moderateScale(16),
    ...styles.mr10,
  },
  bottomIndicatorStyle: {
    height: moderateScale(4),
    borderRadius: moderateScale(10),
    ...styles.mh5,
    ...styles.mt10,
  },
});
