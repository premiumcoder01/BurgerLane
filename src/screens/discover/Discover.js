import {ScrollView, StyleSheet, Text, View, Image, Alert} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {BottomSheet} from 'react-native-elements';
import Modal from 'react-native-modal';
import CustomSheet from '../../helpers/CustomSheet';

const {width} = Dimensions.get('screen');

const Discover = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [offerList, setOfferList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [userAddressesList, setUserAddressesList] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const getLatLong = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(position => {
        resolve(position.coords);
      });
    });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
    // formData.append('lat', '28.629341719747938');
    // formData.append('long', '77.38402881349394');
    setLoading(true);
    Post(Constants.home, formData).then(async res => {
      if (res.status === 200) {
        setItemList(res?.data?.item_list?.data);
        setCurrentAddress(res?.data?.current_location);
        setCategoryList(res?.data?.categories?.data);
        setUserAddressesList(res?.data?.address_data);
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
    // formData.append('latitude', '28.629341719747938');
    // formData.append('longitude', '77.38402881349394');
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

  const setDeafultAddress = id => {
    const formData = new FormData();
    formData.append('address_id', id);
    setLoading(true);
    Post(Constants.set_default_address, formData).then(async res => {
      if (res.status === 200) {
        setCurrentAddress(res?.data?.city);
        setModalVisible(false);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    Home();
    OfferList();
  }, []);

  const addresses = () => {
    return (
      <ScrollView showsHorizontalScrollIndicator={false}>
        {userAddressesList.map(item => (
          <TouchableOpacity
            onPress={() => setDeafultAddress(item.id)}
            style={styles.addresslistStyle}>
            <View
              style={{
                padding: Sizes.fixPadding,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <MaterialIcons
                name="location-on"
                size={17}
                color={Colors.darkPrimaryColor}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                <View>
                  <Text style={{...Fonts.blackColor15Medium}}>
                    {item?.name}
                  </Text>
                  <Text style={{...Fonts.blackColor14Regular}}>
                    {item?.phone}
                  </Text>
                  <Text style={{...Fonts.blackColor14Regular}}>
                    {item?.house_no} ,{item?.area} ,{item?.city} ,{item?.state}{' '}
                    ,{item?.pincode}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('EditDeliveryAddress', {
                        addressId: item.id,
                      });
                    }}
                    style={{marginRight: 20}}>
                    <FontAwesome5
                      name="edit"
                      size={15}
                      color={Colors.darkPrimaryColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="delete"
                      size={17}
                      color={Colors.darkPrimaryColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };



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
        <TouchableOpacity onPress={toggleModal}>
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
    
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={900}
        backdropOpacity={0.5}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.barIcon} />
          <View style={{marginTop: 20}}>
            {addresses()}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddDeliveryAddress');
              }}
              style={{
                margin: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: '#CA445D',
                marginHorizontal: 30,
                borderRadius: 25,
                alignItems: 'center',
              }}>
              <MaterialIcons name="add" color="#fff" size={22} />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.blueColor15Medium,
                  color: '#fff',
                }}>
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addresslistStyle: {
    backgroundColor: 'white',
    borderRadius: Sizes.fixPadding,
    elevation: 4,
    marginBottom: 10,
    marginHorizontal: Sizes.fixPadding + 20,
  },

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
