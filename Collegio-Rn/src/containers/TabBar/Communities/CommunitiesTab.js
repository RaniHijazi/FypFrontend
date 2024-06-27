import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import CText from '../../../components/common/CText';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { moderateScale } from '../../../common/constants';

const communities = [
  {
    id: '1',
    name: 'Xbox Community',
    members: '35.5K Members',
    category: 'Gaming',
    image: 'https://placekitten.com/200/200',
  },
  {
    id: '2',
    name: 'Graphic Design Community',
    members: '3,748 Members',
    category: 'Gaming',
    image: 'https://placekitten.com/200/200',
  },
  {
    id: '3',
    name: 'Playstation Community',
    members: '3,226 Members',
    category: 'Fashion & Beauty',
    image: 'https://placekitten.com/200/200',
  },
  // Add more sample data here
];

const exploreCommunities = [
  // Add sample data for explore communities here
];

export default function CommunitiesTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme) || {};
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const onChangeTextSearch = text => {
    setSearch(text);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={[
          localStyles.wrapContainer,
          {
            backgroundColor: colors.dark ? colors.pinnedColor : colors.white,
            shadowColor: colors.dark ? colors.black : '#ccc',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3
          },
        ]}
      >
        <Image source={{ uri: item.image }} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText type="m16" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {item.name}
          </CText>
          <CText type="r14" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {item.members}
          </CText>
          <CText type="r14" numberOfLines={1} color={colors.dark ? colors.white : colors.text} align="left">
            {item.category}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCommunities = activeTab === 'Home'
    ? communities.filter(community => community.name.toLowerCase().includes(search.toLowerCase()))
    : exploreCommunities.filter(community => community.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <CSafeAreaView style={[localStyles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Communities"
        navigation={navigation}
        searchQuery={search}
        onSearchChange={onChangeTextSearch}
        colors={colors}
      />
      <View style={localStyles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Home')} style={[localStyles.tab, activeTab === 'Home' && { borderBottomColor: colors.primary }]}>
          <CText type="b16" color={activeTab === 'Home' ? colors.primary : colors.text}>Home</CText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Explore')} style={[localStyles.tab, activeTab === 'Explore' && { borderBottomColor: colors.primary }]}>
          <CText type="b16" color={activeTab === 'Explore' ? colors.primary : colors.text}>Explore</CText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCommunities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={localStyles.flatListContentContainer}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: moderateScale(10),
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  wrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    marginVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,

      },
    }),
  },
  imageContainer: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  flatListContentContainer: {
    paddingBottom: moderateScale(20),
  },
});
