import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Fonts, Colors, Sizes, ToastAndroid } from '../../constants/styles';
import styles from './styles';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../../helpers/Service';
import Constants from '../../helpers/Constant';

const OfferListRestaurant = item => {
  const id = item?.route?.params?.id;
  const navigation = useNavigation();

  const [state, setState] = useState({
    loading: false,
    allList: [],
  });

  useEffect(() => {
    offerList();
  }, []);

  const offerList = () => {
    setState(prev => ({
      ...prev,
      loading: true,
    }));

    Post(Constants.getOfferRes + `${id}`).then(
      async res => {
        if (res.status === 200) {
          setState(prev => ({
            ...prev,
            allList: res?.data?.offers[0]?.offer_list,
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
  };

  const renderItem = item => (
    <TouchableOpacity
      onPress={() =>
        //console.log(item.item.restaurant_id)
        navigation.navigate('RestaurantDetail', {
          details: item.item,
          from: 'ProductList',
          restaurant_id: item.item.restaurant_id,
        })
      }
      style={styles.container}>
      <Image
        source={{
          uri: item?.item?.restaurant?.image,
        }}
        style={styles.imgContainer}
      />
      <View style={styles.productContainer}>
        <View style={styles.rowContainer}>
          <Text style={{ ...Fonts.blackColor16Medium }}>
            {item?.item?.restaurant?.name}
          </Text>
        </View>
        <Text
          style={{
            marginVertical: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor14Regular,
          }}>
          {item?.item?.restaurant?.address}
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
        <Text style={{ ...Fonts.blackColor22Medium }}>Restaurant List</Text>
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

export default OfferListRestaurant;
