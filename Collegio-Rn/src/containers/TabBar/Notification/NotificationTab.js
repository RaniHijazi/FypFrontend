import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View, Platform, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { formatDistanceToNow, differenceInMinutes, differenceInSeconds } from 'date-fns';

// Custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import DarkLikeSvg from '../../../assets/svgs/darkLike.svg';
import LightLikeSvg from '../../../assets/svgs/lightLike.svg';
import DarkCommentSvg from '../../../assets/svgs/darkComment.svg';
import LightCommentSvg from '../../../assets/svgs/lightComment.svg';
import CommunityIconLight from '../../../assets/svgs/CommunityIconLight.svg';
import CommunityIconWhite from '../../../assets/svgs/CommunityIconWhite.svg';

export default function NotificationTab() {
  const colors = useSelector(state => state.theme.theme);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.1.140:7210/api/Post/1'); // Replace with actual user ID
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const RenderHeader = () => {
    return (
      <View style={localStyles.mainContentStyle}>
        <CText type={'b18'} color={colors.mainColor}>
          {strings.alerts}
        </CText>
        <TouchableOpacity>
          <CText type={'b14'} color={colors.mainColor}>
            {strings.markAllRead}
          </CText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const notificationTime = new Date(item.time);
    const minutesDiff = differenceInMinutes(new Date(), notificationTime);
    const secondsDiff = differenceInSeconds(new Date(), notificationTime);

    let timeText;
    if (secondsDiff < 60) {
      timeText = 'just now';
    } else if (minutesDiff < 5) {
      timeText = `about ${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
    } else {
      timeText = formatDistanceToNow(notificationTime, { addSuffix: true });
    }

    // Determine the appropriate icon based on the notification content
    let IconComponent;
    if (item.content.includes('liked')) {
      IconComponent = colors.dark ? DarkLikeSvg : LightLikeSvg;
    } else if (item.content.includes('Commented')) {
      IconComponent = colors.dark ? DarkCommentSvg : LightCommentSvg;
    } else if (item.content.includes('folowed')) {
      IconComponent = colors.dark ? CommunityIconWhite : CommunityIconLight;
    }

    return (
      <TouchableOpacity
        style={[
          localStyles.topContainer,
          { backgroundColor: colors.placeholderColor },
        ]}
      >
        <View
          style={[
            localStyles.iconContainer,
            { backgroundColor: colors.dark ? colors.primary : colors.addPostBtn },
          ]}
        >
          {IconComponent && <IconComponent />}
        </View>
        <View style={localStyles.contentStyle}>
          <CText numberOfLines={2} type={'r14'} color={colors.mainColor}>
            {item.content}
          </CText>
          <CText
            type={'r12'}
            color={colors.mainColor}
            numberOfLines={1}
            style={styles.mt5}
          >
            {timeText}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderSectionHeader = ({ section: { title } }) => {
    return (
      <CText
        numberOfLines={1}
        style={styles.mv15}
        type={'r14'}
        color={colors.mainColor}
      >
        {title}
      </CText>
    );
  };

  return (
    <CSafeAreaView>
      <SectionList
        sections={[{ title: 'Today', data: notifications }]}
        renderItem={renderItem}
        ListHeaderComponent={RenderHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={localStyles.contentContainerStyle}
        renderSectionHeader={RenderSectionHeader}
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
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
        shadowOffset: { width: 0, height: 4 },
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
