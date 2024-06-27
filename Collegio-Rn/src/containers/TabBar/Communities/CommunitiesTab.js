import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import CText from '../../../components/common/CText';
import CustomHeader from '../../../components/common/CustomHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { moderateScale } from '../../../common/constants';

const communities = [
  {
    id: '1',
    name: 'Girl Talk Minors',
    description: 'Do y’all think this is true??',
    image: 'https://placekitten.com/200/200',
  },
  {
    id: '2',
    name: 'Dogs',
    description: 'So true.',
    image: 'https://placekitten.com/200/200',
  },
  // Add more sample data here
];

export default function CommunitiesTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme) || {};
  const [search, setSearch] = useState('');

  const onChangeTextSearch = text => {
    setSearch(text);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={[
          localStyles.wrapContainer,
          { backgroundColor: colors.pinnedColor},
        ]}
      >
        <Image source={{ uri: item.image }} style={localStyles.imageContainer} />
        <View style={localStyles.contentStyle}>
          <CText type="m12" numberOfLines={1} color={colors.grayScale5} align="left">
            {item.name}
          </CText>
          <CText type="r14" numberOfLines={2} color={colors.grayScale5} align="left">
            {item.description}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CSafeAreaView style={[localStyles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Communities"
        navigation={navigation}
        searchQuery={search}
        onSearchChange={onChangeTextSearch}
        colors={colors}
      />
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
  wrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    marginVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    elevation: 5,
  },
  imageContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
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
