import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

//custom imports
import CSafeAreaView from '../common/CSafeAreaView';
import PostComponent from './PostComponent';
import {commentDetail} from '../../api/constant';
import CHeader from '../common/CHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import CText from '../common/CText';
import { moderateScale} from '../../common/constants';
import CInput from '../common/CInput';
import {SendIcon} from '../../assets/svgs';
import CKeyBoardAvoidWrapper from '../common/CKeyBoardAvoidWrapper';

export default function ViewPost({route}) {
  const item = route?.params?.item;
  const colors = useSelector(state => state.theme.theme);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  const onPressLiked = item => {
    setLiked(item);
  };

  const onChangeTextComment = text => {
    setComment(text);
  };

  const rightAccessory = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <TouchableOpacity>
          <Octicons
            name={'plus'}
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SimpleLineIcons
            name={'microphone'}
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SendIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.containerStyle,
          {backgroundColor: colors.placeholderColor},
        ]}>
        <View style={styles.flexRow}>
          <Image source={item.image} style={localStyles.imgContainer} />
          <View style={{gap: moderateScale(5)}}>
            <CText type={'b13'} color={colors.mainColor} numberOfLines={1}>
              {item.name}
            </CText>
            <CText type={'r13'} color={colors.mainColor} numberOfLines={1}>
              {item.comment}
            </CText>
            <View style={localStyles.contentStyle}>
              <CText type={'r12'} color={colors.grayScale5} numberOfLines={1}>
                {item.time}
              </CText>
              <View
                style={[
                  localStyles.dotStyle,
                  {backgroundColor: colors.grayScale5},
                ]}
              />
              <CText type={'r12'} color={colors.primary} numberOfLines={1}>
                {item.like}
              </CText>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => onPressLiked(item)}>
          <AntDesign
            name={liked === item ? 'like1' : 'like2'}
            size={moderateScale(20)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const HeaderComponent = () => {
    return(
      <View>
        <PostComponent item={item} />
        <View style={localStyles.topContainer}>
          <CText color={colors.mainColor} type={'r12'} numberOfLines={1}>
            {strings.comments}({item.comment})
          </CText>
          <View style={styles.rowCenter}>
            <CText type={'s13'} style={styles.mr10} numberOfLines={1}>
              {strings.recent}
            </CText>
            <SimpleLineIcons
              name={'arrow-down'}
              size={moderateScale(16)}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <CSafeAreaView>
      <CHeader title={strings.viewPost} style={[styles.ph20,styles.mr20]} />
      <CKeyBoardAvoidWrapper
        contentContainerStyle={localStyles.contentContainerStyle}>
        <FlatList
          data={commentDetail}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          ListHeaderComponent={HeaderComponent}
          keyExtractor={(item, index) => index.toString()}
        />
        <CInput
          placeholder={strings.chatPlaceholder}
          inputContainerStyle={localStyles.inputContainerStyle}
          placeholderTextColor={colors.grayScale5}
          rightAccessory={rightAccessory}
          value={comment}
          onChangeText={onChangeTextComment}
        />
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  containerStyle: {
    ...styles.mv10,
    ...styles.p15,
    borderRadius: moderateScale(15),
    ...styles.justifyBetween,
    ...styles.flexRow,
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
  imgContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    ...styles.mr10,
  },
  contentStyle: {
    ...styles.flexRow,
    gap: moderateScale(10),
    ...styles.itemsCenter,
  },
  dotStyle: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  topContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv20,
  },
  bottomContainer: {
    ...styles.ph20,
    ...styles.flexGrow1,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(50),
    height: moderateScale(52),
    ...styles.mb20,
    ...styles.selfCenter,
  },
  mainContentStyle: {
    ...styles.rowCenter,
    gap: moderateScale(5),
  },
  contentContainerStyle: {
    ...styles.flex,
    ...styles.ph20,
  },
});
