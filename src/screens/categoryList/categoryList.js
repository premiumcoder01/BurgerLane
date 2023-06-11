import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {Fonts, Colors, Sizes, ToastAndroid} from '../../constants/styles';
import styles from './styles';
import {GetApi} from '../../helpers/Service';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

const width = Dimensions.get('screen');

const CategoryList = item => {
  const route = item?.route?.params?.item;
  const navigation = useNavigation();

  const [state, setState] = useState({
    loading: false,
    allList: route?.data?.restaurants,
  });

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: Colors.whiteColor}}>
      <Spinner color={'#fff'} visible={state.loading} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={{...Fonts.blackColor22Medium}}>Restaurants List</Text>
        <View />
      </View>
      {state.allList.length > 0 ? (
        <FlatList
          data={state?.allList}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('RestaurantDetail', {
                    details: item,
                    from: 'CategoryList',
                    restaurant_id: item.restaurant_id,
                  })
                }
                style={styles.container}>
                <Image
                  source={{
                    uri: item?.image,
                  }}
                  resizeMode="contain"
                  style={styles.imgContainer}
                />
                <View style={styles.productContainer}>
                  <View style={styles.rowContainer}>
                    <Text style={{...Fonts.blackColor18Medium}}>
                      {item?.name}
                    </Text>
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: 'green',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          ...Fonts.blackColor14Regular,
                          color: '#fff',
                          marginRight: 5,
                        }}>
                        4.3
                      </Text>
                      <AntDesign name="star" size={10} color="#fff" />
                    </View>
                  </View>
                  <Text
                    style={{
                      marginVertical: Sizes.fixPadding - 5.0,
                      ...Fonts.grayColor14Regular,
                    }}>
                    {item?.address}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={{alignSelf: 'center'}}>
          <Lottie
            source={require('../../../assets/images/closed.json')}
            autoPlay
            loop
            style={{height: 100, width: 100}}
          />
        </View>
      )}
    </View>
  );
};

export default CategoryList;
