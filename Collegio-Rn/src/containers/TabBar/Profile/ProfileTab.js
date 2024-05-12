import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {moderateScale} from '../../../common/constants';
import {userPostDetail} from '../../../api/constant';
import PostComponent from '../../../components/HomeComponent/PostComponent';
import ProfileComponent from '../../../components/ProfileComponent/ProfileComponent';
import {styles} from '../../../themes';

export default function ProfileTab() {
  const renderItemPostData = ({item}) => {
    return (
      <View style={styles.ph20}>
        <PostComponent item={item} />
      </View>
    );
  };

  const ListHeaderComponent = () => {
    return <ProfileComponent />;
  };

  return (
    <CSafeAreaView>
      <FlatList
        data={userPostDetail}
        renderItem={renderItemPostData}
        ListHeaderComponent={<ListHeaderComponent />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={localStyles.contentContainerStyle}
        bounces={false}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: moderateScale(80),
  },
});
