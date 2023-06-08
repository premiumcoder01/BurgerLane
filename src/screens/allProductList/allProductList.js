import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Fonts, Colors, Sizes, ToastAndroid } from '../../constants/styles';
import styles from './styles';
import { GetApi } from '../../helpers/Service';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const AllProductList = item => {
  const route = item?.route?.params?.item;
  const routeName = item?.route?.params?.name;
  const navigation = useNavigation();

  const [state, setState] = useState({
    loading: false,
    allList: [],
  });

  const allProductList = useCallback(() => {
    setState(prev => ({
      ...prev,
      loading: true,
    }));

    GetApi(route).then(
      async res => {
        if (res.status === 200) {
          setState(prev => ({
            ...prev,
            allList:
              routeName === 'Product Ordereds'
                ? res?.data?.orders
                : routeName === 'Hot Sale'
                  ? res?.data?.restaurant
                  : res?.data?.favouriteRestaurant,
          }));
        }
        setState(prev => ({
          ...prev,
          loading: false,
        }));
      },
      err => {
        setState(prev => ({
          ...prev,
          loading: false,
        }));
        console.log(err.response.data);
      },
    );
  }, [route, routeName]);

  useEffect(() => {
    allProductList();
  }, [allProductList]);

  const renderItem = item => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('RestaurantDetail', {
          details: item.item,
          from: 'ProductList',
          restaurant_id: item.item.restaurant_id,
        })
      }
      style={styles.container}>
      {console.log('item', item.item.restaurant)}
      <Image
        source={{
          uri:
            routeName === 'Product Ordereds'
              ? item?.item?.image === undefined
                ? 'https://burgerlane.isynbus.com/storage/restaurant/1668432288restaurant.jpg'
                : item?.item?.image
              : routeName === 'Hot Sale'
                ? item?.item?.restaurant[0]?.image
                : item?.item?.favourite_restaurant?.image,
        }}
        style={styles.imgContainer}
      />
      <View style={styles.productContainer}>
        <View style={styles.rowContainer}>
          <Text style={{ ...Fonts.blackColor16Medium }}>
            {routeName === 'Product Ordereds'
              ? item?.item?.customer_name
              : routeName === 'Hot Sale'
                ? item?.item?.restaurant[0]?.name
                : item?.item?.favourite_restaurant?.name}
          </Text>
        </View>
        <Text
          style={{
            marginVertical: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor14Regular,
          }}>
          {routeName === 'Product Ordereds'
            ? item?.item?.customer_address
            : routeName === 'Hot Sale'
              ? item?.item?.restaurant[0]?.address
              : item?.item?.favourite_restaurant?.address}
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
        <Text style={{ ...Fonts.blackColor22Medium }}>{routeName} List</Text>
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

export default AllProductList;
