import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CInput from '../../../components/common/CInput';
import {styles} from '../../../themes';
import {moderateScale, screenWidth} from '../../../common/constants';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import {popularCategoriesData, searchData} from '../../../api/constant';
import PopularCategory from '../../../components/HomeComponent/PopularCategory';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import CKeyBoardAvoidWrapper from '../../../components/common/CKeyBoardAvoidWrapper';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function SearchTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState();

  const onChangeTextSearch = item => {
    setSearch(item);
  };

  const onPressUserProfile = item => {
    navigation.navigate(StackNav.OtherPersonProfile, {item: item});
  };

  const rightAccessory = () => {
    return (
      <TouchableOpacity>
        <Ionicons
          name={'search-sharp'}
          size={moderateScale(24)}
          color={colors.dark ? colors.grayScale4 : colors.black}
        />
      </TouchableOpacity>
    );
  };

  const renderPostComponent = ({item}) => {
    return (
      <PostComponent item={item} onPress={() => onPressUserProfile(item)} />
    );
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.p20}>
          <CInput
            inputContainerStyle={[
              localStyles.inputContainerStyle,
              {shadowColor: colors.dark ? colors.black : colors.white},
            ]}
            placeHolder={strings.searchPlaceholder}
            placeholderTextColor={colors.grayScale4}
            rightAccessory={rightAccessory}
            value={search}
            onChangeText={onChangeTextSearch}
          />
          <CText
            type={'b16'}
            color={colors.dark ? colors.white : colors.black}
            numberOfLines={1}
            style={styles.mt10}>
            {strings.popular}
          </CText>
          <View
            style={[
              localStyles.popularContainer,
              {backgroundColor: colors.placeholderColor},
            ]}>
            <PopularCategory
              chipsData={popularCategoriesData}
              bgColor={colors.mainColor}
              textColor={colors.dark ? colors.black : colors.white}
            />
          </View>
          <FlatList
            data={searchData}
            renderItem={renderPostComponent}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
            contentContainerStyle={localStyles.contentContainerStyle}
          />
        </View>
      </CKeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(32),
    ...styles.itemsCenter,
  },
  popularContainer: {
    borderRadius: moderateScale(50),
    ...styles.ph10,
    ...styles.mv25,
    width: screenWidth - moderateScale(10),
  },
  contentContainerStyle: {
    paddingBottom: moderateScale(55),
  },
});
