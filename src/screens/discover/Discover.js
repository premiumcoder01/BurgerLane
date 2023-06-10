import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native';
import {StatusBar} from 'react-native';
import Spinner from '../../components/Spinner';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Constants from '../../helpers/Constant';
import {Post} from '../../helpers/Service';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';

const {width} = Dimensions.get('screen');

const intialAmount = 2.5;

const Discover = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [offerList, setOfferList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const getLatLong = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(position => {
        resolve(position.coords);
      });
    });
  };

  const Home = async () => {
    let lat;
    let long;
    await getLatLong().then(res => {
      lat = res.latitude;
      long = res.longitude;
    });
    const formData = new FormData();
    formData.append('lat', lat);
    formData.append('long', long);
    setLoading(true);
    Post(Constants.home, formData).then(async res => {
      if (res.status === 200) {
        setItemList(res?.data?.item_list?.data);
        setCurrentAddress(res?.data?.current_location);
        setCategoryList(res?.data?.categories?.data);
        setLoading(false);
      }
    });
  };

  const OfferList = () => {
    Post(Constants.offerList).then(
      async res => {
        if (res.status === 200) {
          setOfferList(res?.data?.restaurant);
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };


  const restaurantListCategory = async item => {
    let lat;
    let long;
    await getLatLong().then(res => {
      lat = res.latitude;
      long = res.longitude;
    });

    const formData = new FormData();
    formData.append('category_id', item.id);
    formData.append('latitude', lat);
    formData.append('longitude', long);
    Post(Constants.restaurantByCategory, formData).then(
      async res => {
        if (res.status === 200) {
          navigation.navigate('CategoryList', {
            item: res,
          });
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  useEffect(() => {
    Home();
    OfferList();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.primaryColor}}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Spinner color={'#fff'} visible={loading} />
      {/* header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
          marginVertical: 10,
        }}>
        <TouchableOpacity>
          <Text
            style={{
              ...Fonts.darkPrimaryColor,
              color: '#fff',
              fontWeight: 'bold',
            }}>
            DELIVERING TO
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding - 8.0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="location-on"
              size={17}
              color={Colors.whiteColor}
            />
            <Text
              numberOfLines={1}
              style={{maxWidth: width / 1.7, ...Fonts.whiteColor14Medium}}>
              {currentAddress}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={20}
              color={Colors.whiteColor}
            />
          </View>
        </TouchableOpacity>
        <MaterialIcons
          name="notifications"
          size={25}
          color={Colors.whiteColor}
          style={{marginTop: Sizes.fixPadding + 5.0}}
          onPress={() => navigation.navigate('Notifications')}
        />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Search')}
            style={styles.searchInfoWrapStyle}>
            <MaterialIcons name="search" size={22} color={Colors.whiteColor} />
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.lightPrimaryColor16Regular,
              }}>
              Do you want find something?
            </Text>
          </TouchableOpacity>
          <View style={styles.pageStyle}>
            {/* banner */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {offerList.map(item => {
                  return (
                    <TouchableOpacity
                      style={{marginHorizontal: 20}}
                      onPress={() =>
                        navigation.navigate('OfferList', {id: item?.id})
                      }>
                      <Image
                        source={{uri: item.image}}
                        style={styles.offerBannersImageStyle}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            {/* category */}
            <View>
              <Text
                style={{
                  ...Fonts.blackColor19Medium,
                  marginHorizontal: Sizes.fixPadding + 10,
                  marginVertical: Sizes.fixPadding + 10,
                }}>
                Categories
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: Sizes.fixPadding + 10,
                  paddingBottom: Sizes.fixPadding * 3.0,
                  // paddingTop: Sizes.fixPadding,
                }}>
                {categoryList.map(item => {
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        marginRight: Sizes.fixPadding * 2.0,
                      }}>
                      <TouchableOpacity
                        onPress={() => restaurantListCategory(item)}>
                        <Image
                          source={{
                            uri: item?.image,
                          }}
                          style={{width: 60, height: 60, borderRadius: 50}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginTop: Sizes.fixPadding,
                          ...Fonts.blackColor14Regular,
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            {/* All Items */}
            <View>
              <View
                style={{
                  marginHorizontal: Sizes.fixPadding + 10,
                  marginBottom: 10,
                }}>
                <Text style={{...Fonts.blackColor19Medium}}>All Items</Text>
              </View>
              <FlatList
                data={itemList}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                }}
                keyExtractor={item => `${item.id}`}
                contentContainerStyle={{
                  paddingTop: Sizes.fixPadding,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('RestaurantDetail', {
                          details: item.item,
                          from: 'ProductList',
                          restaurant_id: item.restaurant_id,
                        })
                      }
                      style={styles.allRestaurentsInfoWrapStyle}>
                      <Image
                        source={{uri: item?.image}}
                        style={styles.allRestaurentImageStyle}
                      />
                      <View
                        style={{
                          paddingHorizontal: Sizes.fixPadding - 5.0,
                          paddingBottom: Sizes.fixPadding,
                          paddingTop: Sizes.fixPadding - 5.0,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{...Fonts.blackColor15Medium}}>
                          {item?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            marginTop: Sizes.fixPadding - 7.0,
                            ...Fonts.grayColor14Medium,
                          }}>
                          Price : {item?.price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Discover;

const styles = StyleSheet.create({
  searchInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkPrimaryColor,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: 35,
    marginBottom: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: 25,
  },
  pageStyle: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    // paddingBottom: Sizes.fixPadding * 120,
  },
  offerBannersImageStyle: {
    width: width / 1.15,
    height: 160,
    borderWidth: 2,
    borderRadius: Sizes.fixPadding * 2,
  },
  allRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 150,
    marginBottom: 20,
    elevation: 5,
  },
  allRestaurentImageStyle: {
    height: 150,
    resizeMode: 'contain',
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
});
