import {SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {notificationData} from '../../../api/constant';
import {moderateScale} from '../../../common/constants';

export default function NotificationTab() {
  const colors = useSelector(state => state.theme.theme);

  const RenderHeader = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <CText type={'b18'} color={colors.mainColor}>
          {strings.alerts}
        </CText>
        <CText type={'b14'}>{strings.markAllRead}</CText>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.topContainer,
          {backgroundColor: colors.placeholderColor},
        ]}>
        <TouchableOpacity
          style={[
            localStyles.iconContainer,
            {backgroundColor: colors.dark ? colors.primary : colors.addPostBtn},
          ]}>
          {colors?.dark ? item.darkSvgIcon : item.lightSvgIcon}
        </TouchableOpacity>
        <View style={localStyles.contentStyle}>
          <CText numberOfLines={2} type={'r14'} color={colors.mainColor}>
            {item?.title}
          </CText>
          <CText
            type={'r12'}
            color={colors.mainColor}
            numberOfLines={1}
            style={styles.mt5}>
            {item?.time}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderSectionHeader = ({section: {title}}) => {
    return (
      <CText
        numberOfLines={1}
        style={styles.mv15}
        type={'r14'}
        color={colors.mainColor}>
        {title}
      </CText>
    );
  };

  return (
    <CSafeAreaView>
      <SectionList
        sections={notificationData}
        renderItem={renderItem}
        ListHeaderComponent={RenderHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={localStyles.contentContainerStyle}
        renderSectionHeader={RenderSectionHeader}
        bounces={false}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mainContentStyle: {
    ...styles.rowSpaceBetween,
    ...styles.mv20,
  },
  topContainer: {
    ...styles.pv20,
    ...styles.mb20,
    borderRadius: moderateScale(15),
    ...styles.flexRow,
    ...styles.ph10,
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
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    ...styles.center,
    ...styles.mr10,
  },
  contentStyle: {
    width: '87%',
  },
  contentContainerStyle: {
    ...styles.ph20,
    paddingBottom: moderateScale(80),
  },
});
