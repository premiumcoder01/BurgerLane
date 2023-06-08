import React from 'react';
import { Component, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  ScrollView,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from '../../constants/styles';
import CollapsingToolbar from '../../components/sliverAppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { BottomSheet } from 'react-native-elements';
import { GetApi, Post } from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';
import Geolocation from '@react-native-community/geolocation';

const offerBannersList = [
  {
    id: '1',
    image: require('../../../assets/images/slider/slider_1.png'),
  },
  {
    id: '2',
    image: require('../../../assets/images/slider/slider_2.png'),
  },
  {
    id: '3',
    image: require('../../../assets/images/slider/slider_3.png'),
  },
  {
    id: '4',
    image: require('../../../assets/images/slider/slider_4.png'),
  },
  {
    id: '5',
    image: require('../../../assets/images/slider/slider_5.png'),
  },
  {
    id: '6',
    image: require('../../../assets/images/slider/slider_6.png'),
  },
];

const addressesList = [
  {
    id: '1',
    address: '76A, New York, US.',
  },
  {
    id: '2',
    address: '55C, California, US.',
  },
];

const { width } = Dimensions.get('screen');

const intialAmount = 2.5;

const g = '';
const f = '';

const setDeafultAddress = async (_this, address_id) => {
  _this.setState({ loading: true });
  //this.setState({ loading: true });
  console.log(address_id);
  // return false;
  const formData = new FormData();
  formData.append('address_id', address_id);
  Post(Constants.set_default_address, formData).then(
    async res => {
      _this.setState({ loading: false });
      if (res.status === 200) {
        _this.setState({
          currentAddress: res?.data?.city,
          showAddressSheet: false,
        })
        //navigation.navigate('Discover');
      }
    }
  )
}

class DiscoverScreen extends Component {
  state = {
    productsOrdereds: [],
    favouriteRestaurents: [],
    allRestaurents: [],
    itemList:[],
    hotSales: [],
    categoriesList: [],
    showSnackBar: false,
    isFavourite: false,
    showBottomSheet: false,
    showAddressSheet: false,
    addressesList: [],
    userAddressesList: [],
    // currentAddress: addressesList[0].address,
    currentAddress: '',
    sizeIndex: null,
    qty: 1,
    options: optionsList,
    showCustomizeBottomSheet: false,
    loading: true,
    offerList: [],
  };

  componentDidMount() {
    this.home();
    this.locationGet();
    this.offerList();
  }

  offerList = () => {
    this.setState({ loading: true });

    Post(Constants.offerList).then(
      async res => {
        if (res.status === 200) {
          this.setState({ offerList: res?.data?.restaurant });
        }
        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };



  locationGet = () => {
    this.setState({ loading: true });

    Post(Constants.locationGet).then(
      async res => {
        if (res.status === 200) {
          this.setState({ addressesList: res?.data?.locations });
        }
        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };

  getLatLong = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        }
      );
    })
  }

  home = async () => {
    this.setState({ loading: true });
    let lat;
    let long;
    await this.getLatLong().then(res => {
      lat = res.latitude;
      long = res.longitude;
    });
    const formData = new FormData();

    formData.append('lat', lat);
    formData.append('long', long);

    Post(Constants.home, formData).then(
      async res => {
        if (res.status === 200) {

          const productOrdered = res?.data?.productOrdered?.data.map(item => {
            item.isFavourite = false;
            return item;
          });

          const favouriteRestaurants = res?.data?.favouriteRestaurant?.data.map(
            item => {
              item.isFavourite = false;
              return item;
            },
          );

          const hotSalesFoods = res?.data?.hotSale?.data.map(item => {
            item.isFavourite = false;
            return item;
          });

          this.setState({
            categoriesList: res?.data?.categories?.data,
            favouriteRestaurents: favouriteRestaurants,
            allRestaurents: res?.data?.all_restaurant?.data,
            itemList: res?.data?.item_list?.data,
            hotSales: hotSalesFoods,
            productsOrdereds: productOrdered,
            currentAddress: res?.data?.current_location,
            userAddressesList: res?.data?.address_data
          });
        }
        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };

  restaurantListCategory = item => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append('category_id', item.id);
    formData.append('latitude', '28.629341719747938');
    formData.append('longitude', '77.38402881349394');

    Post(Constants.restaurantByCategory, formData).then(
      async res => {
        if (res.status === 200) {
          this.props.navigation.navigate('CategoryList', {
            item: res,
          });
        }
        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <Spinner color={'#fff'} visible={this.state.loading} />
        <CollapsingToolbar
          leftItem={
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ showAddressSheet: true })}
              style={{
                marginLeft: Sizes.fixPadding * 2.0,
                marginTop: Sizes.fixPadding,
              }}>
              <Text style={{ ...Fonts.darkPrimaryColor }}>
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
                  style={{ maxWidth: width / 1.7, ...Fonts.whiteColor14Medium }}>
                  {this.state.currentAddress}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={20}
                  color={Colors.whiteColor}
                />
              </View>
            </TouchableOpacity>
          }
          rightItem={
            <MaterialIcons
              name="notifications"
              size={25}
              color={Colors.whiteColor}
              style={{ marginTop: Sizes.fixPadding + 5.0 }}
              onPress={() => this.props.navigation.push('Notifications')}
            />
          }
          element={
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.props.navigation.push('Search')}
              style={styles.searchInfoWrapStyle}>
              <MaterialIcons
                name="search"
                size={22}
                color={Colors.whiteColor}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.lightPrimaryColor16Regular,
                }}>
                Do you want find something?
              </Text>
            </TouchableOpacity>
          }
          toolbarColor={Colors.primaryColor}
          toolbarMinHeight={60}
          toolbarMaxHeight={170}
          isImage={false}>
          <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <View style={styles.pageStyle}>
              {this.offerBanners()}
              {this.categoriesInfo()}
              {this.productsOrderedInfo()}
              {this.favouriteRestaurantsInfo()}
              {/* {this.allRestaurantsInfo()} */}
              {this.allItemsInfo()}
              {/* {this.hotSales()} */}
            </View>
          </View>
        </CollapsingToolbar>
        <Snackbar
          style={styles.snackBarStyle}
          visible={this.state.showSnackBar}
          onDismiss={() => this.setState({ showSnackBar: false })}>
          {this.state.isFavourite
            ? 'Removed from Favourite'
            : 'Added to Favourite'}
        </Snackbar>
        {this.selectAddressSheet()}
      </SafeAreaView>
    );
  }

  hotSales() {
    return (
      <>
        {this.hotSaleInfo()}
        {this.custmizeBottomSheet()}
      </>
    );
  }

  custmizeBottomSheet() {
    return (
      <BottomSheet
        isVisible={this.state.showCustomizeBottomSheet}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: Colors.whiteColor,
            borderTopRightRadius: Sizes.fixPadding * 2.0,
            borderTopLeftRadius: Sizes.fixPadding * 2.0,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState({ showCustomizeBottomSheet: false })}>
            <View style={styles.bottomSheetOpenCloseDividerStyle} />
            {this.addNewItemTitle()}
            {this.CustmizeItemInfo()}
          </TouchableOpacity>
          {this.sizeTitle()}
          {this.sizesInfo()}
          {this.optionsTitle()}
          {this.optionsInfo()}
          {this.addToCartAndItemsInfo()}
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  addToCartAndItemsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          this.setState({ showCustomizeBottomSheet: false });
          this.props.navigation.push('ConfirmOrder');
        }}
        style={styles.addToCartAndItemsInfoWrapStyle}>
        <View>
          <Text style={{ ...Fonts.darkPrimaryColor16Medium }}>
            {this.state.qty} ITEM
          </Text>
          <Text style={{ ...Fonts.whiteColor15Regular }}>
            ${intialAmount * this.state.qty}
          </Text>
        </View>
        <Text style={{ ...Fonts.whiteColor16Medium }}>Add to Cart</Text>
      </TouchableOpacity>
    );
  }

  updateOptions({ id }) {
    const newList = this.state.options.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, isSelected: !item.isSelected };
        return updatedItem;
      }
      return item;
    });
    this.setState({ options: newList });
  }

  optionsInfo() {
    return (
      <View style={{ paddingTop: Sizes.fixPadding }}>
        {this.state.options.map(item => (
          <View key={`${item.id}`}>
            <View style={styles.optionWrapStyle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.updateOptions({ id: item.id })}
                style={{
                  ...styles.radioButtonStyle,
                  backgroundColor: item.isSelected
                    ? Colors.primaryColor
                    : Colors.whiteColor,
                }}>
                {item.isSelected ? (
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
                {item.option}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  optionsTitle() {
    return (
      <View
        style={{
          backgroundColor: Colors.bodyBackColor,
          padding: Sizes.fixPadding,
        }}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Options</Text>
      </View>
    );
  }

  sizesInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding,
        }}>
        {this.sizes({ size: 'S', contain: '500 ml', price: 0, index: 1 })}
        {this.sizes({ size: 'M', contain: '750 ml', price: 0.5, index: 2 })}
        {this.sizes({ size: 'L', contain: '1100 ml', price: 1.2, index: 3 })}
      </View>
    );
  }

  sizes({ size, contain, price, index }) {
    return (
      <View style={styles.sizesWrapStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState({ sizeIndex: index })}
            style={{
              ...styles.radioButtonStyle,
              backgroundColor:
                this.state.sizeIndex == index
                  ? Colors.primaryColor
                  : Colors.whiteColor,
            }}>
            {this.state.sizeIndex == index ? (
              <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
            ) : null}
          </TouchableOpacity>
          <Text
            style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
            Sizes {size}
          </Text>
          <Text
            style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
            ({contain})
          </Text>
        </View>
        <Text style={{ ...Fonts.blackColor16Medium }}>${price}</Text>
      </View>
    );
  }

  addNewItemTitle() {
    return (
      <Text
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor19Medium,
        }}>
        Add New Item
      </Text>
    );
  }

  sizeTitle() {
    return (
      <View style={styles.sizeTitleStyle}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Size</Text>
        <Text style={{ ...Fonts.grayColor16Medium }}>Price</Text>
      </View>
    );
  }

  CustmizeItemInfo() {
    return (
      <View style={styles.custmizeItemInfoWrapStyle}>
        <Image
          source={require('../../../assets/images/products/lemon_juice.png')}
          style={{
            width: 80.0,
            height: 80.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
        <View
          style={{
            flex: 1,
            marginVertical: Sizes.fixPadding - 7.0,
            justifyContent: 'space-between',
            marginLeft: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.blackColor16Medium }}>Lemon Juice Fresh</Text>
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...Fonts.primaryColor20MediumBold }}>
              ${intialAmount * this.state.qty}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.state.qty > 1
                    ? this.setState({ qty: this.state.qty - 1 })
                    : null;
                }}
                style={{
                  backgroundColor:
                    this.state.qty > 1 ? Colors.primaryColor : '#E0E0E0',
                  ...styles.qtyAddRemoveButtonStyle,
                }}>
                <MaterialIcons
                  name="remove"
                  color={
                    this.state.qty > 1 ? Colors.whiteColor : Colors.blackColor
                  }
                  size={18}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: Sizes.fixPadding,
                  ...Fonts.blackColor16Medium,
                }}>
                {this.state.qty}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ qty: this.state.qty + 1 })}
                style={{
                  backgroundColor: Colors.primaryColor,
                  ...styles.qtyAddRemoveButtonStyle,
                }}>
                <MaterialIcons name="add" color={Colors.whiteColor} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  handleHotSalesUpdate({ id }) {
    const newList = this.state.hotSales.map(property => {
      if (property.id === id) {
        const updatedItem = { ...property, isFavourite: !property.isFavourite };
        return updatedItem;
      }
      return property;
    });
    this.setState({ hotSales: newList });
  }

  hotSaleInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          //console.log('item.restaurant_id' + item.restaurant_id)
          this.props.navigation.navigate('RestaurantDetail', {
            details: item,
            from: 'ProductList',
            restaurant_id: item.restaurant_id,
          })
        }
        style={styles.hotSalesInfoWrapStyle} >
        <Image
          source={{ uri: item?.item_details?.image }}
          style={styles.hotSaleImageStyle}
        />
        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.whiteColor}
          style={{ position: 'absolute', right: 10.0, top: 10.0 }}
          onPress={() => {
            this.handleHotSalesUpdate({ id: item.id });
            this.setState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text style={{ ...Fonts.blackColor15Medium }}>
            {item?.item_details?.name}
          </Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}>
            {item?.cat_values}
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...Fonts.primaryColor20MediumBold }}>
              ${item?.item_details?.price}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ showCustomizeBottomSheet: true })}
              style={styles.addIconWrapStyle}>
              <MaterialIcons name="add" size={17} color={Colors.whiteColor} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ ...Fonts.blackColor19Medium }}>Hot Sale</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('AllProductList', {
                item: 'view-all/hot-sale',
                name: 'Hot Sale',
              })
            }>
            <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={this.state.hotSales}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  selectAddressSheet() {
    return (
      <BottomSheet
        isVisible={this.state.showAddressSheet}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: Sizes.fixPadding + 5.0,
          }}>
          <TouchableOpacity
            onPress={() => this.setState({ showAddressSheet: false })}>


            <Text style={{ textAlign: 'center', ...Fonts.blackColor19Medium }}>
              SELECT ADDRESS
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors.grayColor,
              height: 0.3,
              marginHorizontal: Sizes.fixPadding,
              marginVertical: Sizes.fixPadding + 5.0,
            }}
          />
          {this.addresses()}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ showAddressSheet: false });
              //this.props.navigation.push('AddNewDeliveryAddress');
              this.props.navigation.push('AddDeliveryAddress');
            }}
            style={{
              marginTop: Sizes.fixPadding - 5.0,
              marginHorizontal: Sizes.fixPadding + 3.0,
              marginBottom: Sizes.fixPadding + 5.0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialIcons name="add" color="#2196F3" size={22} />
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.blueColor15Medium,
              }}>
              Add New Address
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }

  addresses() {
    return (
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.userAddressesList.map(item => (
            <TouchableOpacity
              onPress={() =>
                // this.setState({
                //   currentAddress: item.city,
                //   showAddressSheet: false,
                // })
                setDeafultAddress(this, item.id)
              }

              style={styles.addresslistStyle} >
              <View
                style={{
                  paddingHorizontal: Sizes.fixPadding - 5.0,
                  paddingBottom: Sizes.fixPadding,
                  paddingTop: Sizes.fixPadding - 5.0,
                }}>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <View style={{ height: 120, }}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                      {item?.name}
                    </Text>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                      {item?.phone}
                    </Text>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                      {item?.house_no} ,{item?.area} ,{item?.city} ,{item?.state} ,{item?.pincode}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showAddressSheet: false });
                        this.props.navigation.push('EditDeliveryAddress', { addressId: item.id });
                      }}
                    >
                      <Text style={{ ...styles.editAddressStyle }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  }

  handleFavouriteRestaurentsUpdate({ id }) {
    const newList = this.state.favouriteRestaurents.map(property => {
      if (property.id === id) {
        const updatedItem = { ...property, isFavourite: !property.isFavourite };
        return updatedItem;
      }
      return property;
    });
    this.setState({ favouriteRestaurents: newList });
  }

  favouriteRestaurantsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('RestaurantDetail', {
            details: item.item,
            from: 'ProductList',
            restaurant_id: item.restaurant_id,
          })
        }
        activeOpacity={0.9}
        // onPress={() =>
        //   this.props.navigation.navigate('RestaurantDetail', {item})
        // }
        style={styles.favouriteRestaurentsInfoWrapStyle}>
        <Image
          source={{ uri: item?.favourite_restaurant?.image }}
          style={styles.favouriteRestaurentImageStyle}
        />

        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.whiteColor}
          style={{ position: 'absolute', right: 10.0, top: 10.0 }}
          onPress={() => {
            this.handleFavouriteRestaurentsUpdate({ id: item.id });
            this.setState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />

        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
            {item?.favourite_restaurant?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}>
            {item?.favourite_restaurant?.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
    if (this.state.favouriteRestaurents.length >= 1) {
      return (
        <View>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...Fonts.blackColor19Medium }}>
              Favourite Restaurants
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AllProductList', {
                  item: 'view-all/favourite-restaurant',
                  name: 'Favourite Restaurants',
                })
              }>
              <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={this.state.favouriteRestaurents}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingLeft: Sizes.fixPadding,
              paddingTop: Sizes.fixPadding,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    }
  }
  // All res start
  allRestaurantsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('RestaurantDetail', {
            details: item.item,
            from: 'ProductList',
            restaurant_id: item.id,
          })
        }
        activeOpacity={0.9}
        style={styles.allRestaurentsInfoWrapStyle}>
        <Image
          source={{ uri: item?.image }}
          style={styles.allRestaurentImageStyle}
        />

        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.whiteColor}
          style={{ position: 'absolute', right: 10.0, top: 10.0 }}
          onPress={() => {
            this.handleFavouriteRestaurentsUpdate({ id: item.id });
            this.setState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />

        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}>
            {item?.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={this.state.allRestaurents}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
  // all res end

  // All itemd start
  allItemsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('RestaurantDetail', {
            details: item.item,
            from: 'ProductList',
            restaurant_id: item.restaurant_id,
          })
        }
        activeOpacity={0.9}
        style={styles.allRestaurentsInfoWrapStyle}>
        <Image
          source={{ uri: item?.image }}
          style={styles.allRestaurentImageStyle}
        />
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
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
    return (
      <View>
        <FlatList
          data={this.state.itemList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
  // all item end

  handleProductOrderedUpdate({ id }) {
    const newList = this.state.productsOrdereds.map(property => {
      if (property.id === id) {
        const updatedItem = { ...property, isFavourite: !property.isFavourite };
        return updatedItem;
      }
      return property;
    });
    this.setState({ productsOrdereds: newList });
  }

  productsOrderedInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('RestaurantDetail', {
            details: item.item,
            from: 'ProductList',
            restaurant_id: item.restaurant_id,
          })
        }
        style={styles.productsOrderedInfoWrapStyle}>
        <Image
          source={{ uri: item?.order_item?.items?.image }}
          style={styles.productsOrderedImageStyle}
        />
        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.whiteColor}
          style={{ position: 'absolute', right: 10.0, top: 10.0 }}
          onPress={() => {
            this.handleProductOrderedUpdate({ id: item.id });
            this.setState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />

        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text style={{ ...Fonts.blackColor15Medium }}>
            {item?.order_item?.items?.name}
          </Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}>
            {item?.order_item?.categories?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
    if (this.state.productsOrdereds.length >= 1) {
      return (
        <View>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...Fonts.blackColor19Medium }}>Product Ordered</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AllProductList', {
                  item: 'view-all/orders',
                  name: 'Product Ordereds',
                })
              }>
              <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={this.state.productsOrdereds}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingLeft: Sizes.fixPadding,
              paddingTop: Sizes.fixPadding,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    }
  }

  categoriesInfo() {
    const renderItem = ({ item }) => (
      <View style={{ alignItems: 'center', marginRight: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          onPress={() => this.restaurantListCategory(item)}
          style={styles.categoryImageWrapStyle}>
          <Image
            source={{
              uri: item?.image,
            }}
            style={{ width: 40.0, height: 40.0 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
          {item?.name}
        </Text>
      </View>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor19Medium,
            marginHorizontal: Sizes.fixPadding,
          }}>
          Categories
        </Text>
        <FlatList
          horizontal
          data={this.state.categoriesList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding + 5.0,
            paddingBottom: Sizes.fixPadding * 3.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  offerBanners() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('OfferList', { id: item?.id })
        }>
        <Image
          source={{ uri: item.image }}
          style={styles.offerBannersImageStyle}
        />
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          horizontal
          data={this.state.offerList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: Sizes.fixPadding * 2.0,
            paddingLeft: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }
}

const optionsList = [
  {
    id: '1',
    option: 'Add Lemon',
    isSelected: false,
  },
  {
    id: '2',
    option: 'Add Ice',
    isSelected: false,
  },
];

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
    paddingBottom: Sizes.fixPadding * 7.0,
  },
  offerBannersImageStyle: {
    width: 170.0,
    height: 160.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
  },
  categoryImageWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60.0,
    height: 60.0,
  },
  snackBarStyle: {
    position: 'absolute',
    bottom: 57.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: '#333333',
    elevation: 0.0,
  },
  searchInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkPrimaryColor,
    flex: 1,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
  },
  productsOrderedInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  productsOrderedImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  favouriteRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  allRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    //width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  favouriteRestaurentImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  allRestaurentImageStyle: {
    //width: 130.0,
    height: 180.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  hotSalesInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  addresslistStyle: {
    backgroundColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  hotSaleImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  addIconWrapStyle: {
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
  },
  addToCartAndItemsInfoWrapStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  radioButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
  },
  optionWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizesWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
  sizeTitleStyle: {
    backgroundColor: Colors.bodyBackColor,
    padding: Sizes.fixPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  custmizeItemInfoWrapStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: Sizes.fixPadding,
  },
  qtyAddRemoveButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetOpenCloseDividerStyle: {
    backgroundColor: Colors.grayColor,
    height: 4.0,
    borderRadius: Sizes.fixPadding,
    width: 40.0,
    alignSelf: 'center',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  addressWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editAddressStyle: {
    color: "#fff",

  }
});

DiscoverScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default DiscoverScreen;
