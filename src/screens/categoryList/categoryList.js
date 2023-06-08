import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Fonts, Colors, Sizes, ToastAndroid } from '../../constants/styles';
import styles from './styles';
import { GetApi } from '../../helpers/Service';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const CategoryList = item => {
  const route = item?.route?.params?.item;
  const navigation = useNavigation();

  const [state, setState] = useState({
    loading: false,
    allList: route?.data?.restaurants,
  });

  const renderItem = item => (
    <TouchableOpacity
      onPress={() =>
        //console.log(item.item.restaurant_id)
        navigation.navigate('RestaurantDetail', {
          details: item.item,
          from: 'CategoryList',
          restaurant_id: item.item.restaurant_id,
        })
      }
      style={styles.container}>
      <Image
        source={{
          uri: item?.item?.image,
        }}
        style={styles.imgContainer}
      />
      <View style={styles.productContainer}>
        <View style={styles.rowContainer}>
          <Text style={{ ...Fonts.blackColor16Medium }}>{item?.item?.name}</Text>
        </View>
        <Text
          style={{
            marginVertical: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor14Regular,
          }}>
          {item?.item?.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 30 }}>
      <Spinner color={'#fff'} visible={state.loading} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={{ ...Fonts.blackColor22Medium }}>Restaurants List</Text>
        <View />
      </View>

      <FlatList
        data={state?.allList}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryList;
