import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import Modal from 'react-native-modal';

const {width} = Dimensions.get('screen');

const allItems = [];

const Discover = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');

  const [longitute, setLongitute] = useState('');
  const [latitude, setLatitute] = useState('');

  const [offerList, setOfferList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [userAddressesList, setUserAddressesList] = useState([]);

  const [productDetailsAddOns, setProductDetailsAddOns] = useState([]);
  const [productAddOnId, setProductAddOnId] = useState(null);
  const [productAddOnIdArray, setProductAddOnIdArray] = useState([]);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [qty, setQty] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);

  const [isCartModal, setIsCartModal] = useState(false);

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

  const toggleCartModal = () => {
    setIsCartModal(!isCartModal);
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
    setLongitute(long);
    setLatitute(lat);
    setLoading(true);
    Post(Constants.home, formData).then(async res => {
      if (res.status === 200) {
        console.log('all items', res?.data?.item_list?.data);
        setItemList(res?.data?.item_list?.data);
        setCurrentAddress(res?.data?.current_location);
        setCategoryList(res?.data?.categories?.data);
        setUserAddressesList(res?.data?.address_data);
        setLoading(false);
      }
    });
  };

  console.log(latitude, longitute);

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

  const setDeafultAddress = id => {
    const formData = new FormData();
    formData.append('address_id', id);
    setLoading(true);
    Post(Constants.set_default_address, formData).then(async res => {
      if (res.status === 200) {
        console.log('new address', res);
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

  const handlePopularItemsUpdate = ({id, restaurant_id}) => {
    const newList = itemList.map(item => {
      if (item.id === id) {
        const formData = new FormData();
        formData.append('item_id', id);
        formData.append('restaurant_id', restaurant_id);
        Post(Constants.favouriteFood, formData).then(
          async res => {
            if (res.status === 200) {
              const updatedItem = {...item, isFavourite: !item.isFavourite};
              return updatedItem;
            }
          },
          err => {
            console.log(err.response.data);
          },
        );
      }
    });
    return newList;
  };

  const addresses = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {userAddressesList.map(item => (
          <TouchableOpacity
            onPress={() => setDeafultAddress(item.id)}
            style={styles.addresslistStyle}>
            <View
              style={{
                padding: Sizes.fixPadding,
                flexDirection: 'row',
                alignItems: 'flex-start',
                width: width / 1.1,
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
                    style={{marginRight: 10}}>
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

  const addItem = item => {
    setLoading(true);
    const formData = new FormData();
    formData.append('item_id', item?.id);
    Post(Constants.productDetails, formData).then(
      async res => {
        setLoading(false);
        if (res.Status === 200) {
          res?.data?.product_details.map(item => {
            item.qty = 1;
          });
          console.log('responces on main screen', res.data);
          setProductDetailsAddOns(res.data?.product_details);
          setProductAddOnId(null);
          setProductAddOnIdArray([]);
          setAddOnPrice(0);
          setQty(res?.data?.product_details[0].qty);
          setIsCartModal(true);
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  const addToCart = () => {
    const formData = new FormData();
    formData.append('item_id', productDetailsAddOns[0]?.id);
    formData.append('restaurant_id', productDetailsAddOns[0]?.restaurant_id);
    formData.append('quantity', qty);
    formData.append('add_on_item', JSON.stringify(productAddOnIdArray));
    Post(Constants.addToCart, formData).then(
      async res => {
        if (res.Status === '200') {
          console.log('confirm order');
          setIsCartModal(false);
          navigation.navigate('ConfirmOrder');
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  function setAddOnDetail(index_value, item_id, price) {
    if (allItems.includes(item_id)) {
      setAddOnPrice(addOnPrice - price);
      for (var i = allItems.length - 1; i >= 0; i--) {
        if (allItems[i] === item_id) {
          allItems.splice(i, 1);
        }
      }
    } else {
      setAddOnPrice(addOnPrice + price);
      allItems.push(item_id);
    }
    setProductAddOnId(item_id);
    setProductAddOnIdArray(allItems);
  }

  function productAddOnListArray(index_value, is_multiple) {
    return is_multiple == 'true'
      ? productDetailsAddOns[0]?.product_add_on[
          index_value
        ]?.product_add_on_option.map((item, index) => (
          <View>
            <View style={styles.sizesWrapStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    setAddOnDetail(index_value, item.id, parseInt(item.price));
                  }}
                  style={{
                    ...styles.radioButtonStyle,
                    backgroundColor: productAddOnIdArray.includes(item.id)
                      ? Colors.primaryColor
                      : Colors.whiteColor,
                  }}>
                  {productAddOnIdArray.includes(item.id) ? (
                    <MaterialIcons
                      name="done"
                      size={18}
                      color={Colors.whiteColor}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor16Medium,
                  }}>
                  {item?.title}
                </Text>
              </View>
              <Text style={{...Fonts.blackColor16Medium}}>$ {item?.price}</Text>
            </View>
          </View>
        ))
      : productDetailsAddOns[0]?.product_add_on[
          index_value
        ]?.product_add_on_option.map((item, index) => (
          <View>
            <View style={styles.sizesWrapStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setAddOnDetail(index_value, item.id, parseInt(item.price));
                  }}
                  style={{
                    ...styles.radioButtonStyle,
                    backgroundColor:
                      productAddOnId == item.id
                        ? Colors.primaryColor
                        : Colors.whiteColor,
                  }}>
                  {productAddOnId == item.id ? (
                    <MaterialIcons
                      name="done"
                      size={18}
                      color={Colors.whiteColor}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor16Medium,
                  }}>
                  {item?.title}
                </Text>
              </View>
              <Text style={{...Fonts.blackColor16Medium}}>$ {item?.price}</Text>
            </View>
          </View>
        ));
  }

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
                      style={{marginLeft: 25, marginRight: 20}}
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
                      // onPress={() =>
                      //   navigation.navigate('RestaurantDetail', {
                      //     product_id: item.item_id,
                      //     longitude: longitute,
                      //     latitude: latitude,
                      //     isSelected: 1,
                      //   })
                      // }

                      style={styles.allRestaurentsInfoWrapStyle}>
                      <View>
                        <Image
                          source={{uri: item?.image}}
                          style={styles.allRestaurentImageStyle}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            handlePopularItemsUpdate({
                              id: item.id,
                              restaurant_id: item.restaurant_id,
                            });
                          }}
                          style={{position: 'absolute', right: 20, top: 10}}>
                          <AntDesign
                            name={item.isFavourite ? 'heart' : 'hearto'}
                            size={22}
                            color={
                              item.isFavourite
                                ? Colors.primaryColor
                                : Colors.whiteColor
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          paddingHorizontal: Sizes.fixPadding - 5.0,
                          paddingBottom: Sizes.fixPadding,
                          paddingTop: Sizes.fixPadding - 5.0,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            ...Fonts.blackColor14Regular,
                            fontWeight: 'bold',
                          }}>
                          {item?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            marginTop: Sizes.fixPadding,
                            ...Fonts.grayColor14Medium,
                            fontWeight: 'bold',
                          }}>
                          Price : {item?.price}
                        </Text>
                        <TouchableOpacity
                          style={{
                            padding: 5,
                            backgroundColor: '#FCE0E5',
                            // width: 100,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: Colors.primaryColor,
                            marginTop: 10,
                          }}
                          onPress={() => addItem(item)}>
                          <Text
                            style={{
                              ...Fonts.primaryColor16Medium,
                              textAlign: 'center',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}>
                            Add
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      {/* address modal */}
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
                // Linking.openURL(`tel: 8448613996`)
              }}
              style={{
                marginBottom: 10,
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

      {/* cart modal */}
      <Modal
        onBackdropPress={() => setIsCartModal(false)}
        onBackButtonPress={() => setIsCartModal(false)}
        isVisible={isCartModal}
        swipeDirection="down"
        onSwipeComplete={toggleCartModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        backdropOpacity={0.5}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={styles.modal}>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            minHeight: 100,
          }}>
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.whiteColor,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              elevation: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: productDetailsAddOns[0]?.image}}
                  resizeMode="contain"
                  style={{height: 60, width: 60, borderRadius: 10}}
                />
                <Text
                  style={{
                    ...Fonts.blackColor15Regular,
                    marginLeft: 20,
                    fontWeight: 'bold',
                  }}>
                  {productDetailsAddOns[0]?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#FCE0E5',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors.primaryColor,
                }}>
                <MaterialIcons
                  name="remove"
                  color={Colors.blackColor}
                  size={18}
                  onPress={() => {
                    qty < 2 ? setIsCartModal(false) : setQty(qty - 1);
                  }}
                />
                <Text
                  style={{...Fonts.blackColor15Regular, marginHorizontal: 10}}>
                  {qty}
                </Text>
                <MaterialIcons
                  name="add"
                  color={Colors.blackColor}
                  size={18}
                  onPress={() => setQty(qty + 1)}
                />
              </View>
            </View>
          </View>
          {/* addon */}
          {productDetailsAddOns[0]?.product_add_on.length !== 0 ? (
            <View
              style={{
                margin: 10,
                marginTop: 20,
                padding: 10,
                backgroundColor: Colors.whiteColor,
                elevation: 3,
                borderRadius: 10,
              }}>
              <Text style={{...Fonts.blackColor15Regular, fontWeight: 'bold'}}>
                Add On
              </Text>
              {productDetailsAddOns[0]?.product_add_on.map((item, index) => {
                return (
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{
                        ...Fonts.blackColor14Regular,
                        marginBottom: 10,
                        fontWeight: 'bold',
                      }}>
                      {item.title}
                    </Text>
                    {/* Array code  */}
                    {productAddOnListArray(index, item?.is_multiple)}
                    {/* end array code  */}
                  </View>
                );
              })}
            </View>
          ) : null}

          <TouchableOpacity
            style={{
              padding: 10,
              paddingVertical: 15,
              backgroundColor: Colors.primaryColor,
              borderRadius: 10,
              margin: 10,
            }}
            onPress={() => {
              addToCart();
            }}>
            <Text
              style={{
                ...Fonts.whiteColor16Regular,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Add Items $ {productDetailsAddOns[0]?.price * qty + addOnPrice}
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 20,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
  },
  offerBannersImageStyle: {
    width: width / 1.15,
    height: 160,
    borderWidth: 2,
    borderRadius: Sizes.fixPadding * 2,
  },
  allRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 150,
    marginBottom: 20,
    elevation: 5,
  },
  allRestaurentImageStyle: {
    height: 150,
    resizeMode: 'contain',
    borderRadius: 100,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  addresslistStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderRadius: Sizes.fixPadding,
    elevation: 4,
    marginBottom: 10,
    marginHorizontal: Sizes.fixPadding + 8,
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
    minHeight: 200,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignItems: 'center',
    alignSelf: 'center',
  },

  radioButtonStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
  },

  sizesWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
});
