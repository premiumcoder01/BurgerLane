import React, {useEffect, useState} from 'react';
import {Component} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabView, TabBar} from 'react-native-tab-view';
import {Snackbar} from 'react-native-paper';
import {BottomSheet} from 'react-native-elements';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const restaurantsList = [
  {
    id: '1',
    image: require('../../../assets/images/restaurant/restaurant_5.png'),
    name: 'Bar 61 Restaurant',
    address: '76A England',
    rating: 4.5,
    distance: 0.5,
    isFavourite: false,
  },
  {
    id: '2',
    image: require('../../../assets/images/restaurant/restaurant_4.png'),
    name: 'Core by Clare Smyth',
    address: '220 Opera Street',
    rating: 4.2,
    distance: 1.8,
    isFavourite: false,
  },
  {
    id: '3',
    image: require('../../../assets/images/restaurant/restaurant_3.png'),
    name: 'Amrutha Lounge',
    address: '90B Silicon Velley',
    rating: 5.0,
    distance: 0.7,
    isFavourite: false,
  },
  {
    id: '4',
    image: require('../../../assets/images/restaurant/restaurant_2.png'),
    name: 'The Barbary',
    address: '99C OBC Area',
    rating: 4.7,
    distance: 0.2,
    isFavourite: false,
  },
  {
    id: '5',
    image: require('../../../assets/images/restaurant/restaurant_1.png'),
    name: 'The Palomar',
    address: '31A Om Colony',
    rating: 4.1,
    distance: 1.5,
    isFavourite: false,
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

class NearByScreen extends Component {
  state = {
    showAddressSheet: false,
    currentAddress: addressesList[0].address,
    loading: true,
    nearByCategoryList: [],
  };

  componentDidMount() {
    this.nearBy();
  }

  nearBy = () => {
    this.setState({loading: true});
    const formData = new FormData();

    formData.append('lat', '28.629341719747938');
    formData.append('long', '77.38402881349394');

    Post(Constants.nearBy, formData).then(
      async res => {
        if (res.status === 200) {
          this.setState({nearByCategoryList: res?.data?.near_by});
        }
        this.setState({loading: false});
      },
      err => {
        this.setState({loading: false});
        console.log(err.response.data);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <Spinner color={'#fff'} visible={this.state.loading} />
        <View style={{flex: 1}}>
          {this.header()}
          <TabBarView
            props={this.props}
            nearByList={this.state.nearByCategoryList}
            loader={this.state.loading}
          />
          {this.selectAddressSheet()}
        </View>
      </SafeAreaView>
    );
  }

  selectAddressSheet() {
    return (
      <BottomSheet
        isVisible={this.state.showAddressSheet}
        containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.setState({showAddressSheet: false})}
          style={{
            backgroundColor: 'white',
            paddingTop: Sizes.fixPadding + 5.0,
          }}>
          <Text style={{textAlign: 'center', ...Fonts.blackColor19Medium}}>
            SELECT ADDRESS
          </Text>
          <View
            style={{
              backgroundColor: Colors.grayColor,
              height: 0.5,
              marginHorizontal: Sizes.fixPadding,
              marginVertical: Sizes.fixPadding + 5.0,
            }}
          />
          {this.addresses()}
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  addresses() {
    return (
      <>
        {addressesList.map(item => (
          <View key={`${item.id}`}>
            <View style={styles.addressWrapStyle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.setState({
                    currentAddress: item.address,
                    showAddressSheet: false,
                  })
                }
                style={{
                  ...styles.radioButtonStyle,
                  backgroundColor:
                    this.state.currentAddress == item.address
                      ? Colors.primaryColor
                      : Colors.whiteColor,
                }}>
                {this.state.currentAddress == item.address ? (
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
                {item.address}
              </Text>
            </View>
          </View>
        ))}
      </>
    );
  }

  header() {
    return (
      <View style={styles.headerWrapStyle}>
        <Text style={{...Fonts.blackColor22Medium}}>Nearby</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.setState({showAddressSheet: true})}
          style={styles.headerAddressWrapStyle}>
          <MaterialIcons
            name="location-on"
            color={Colors.grayColor}
            size={18}
          />
          <Text
            numberOfLines={1}
            style={{width: width / 2.8, ...Fonts.grayColor16Medium}}>
            {this.state.currentAddress}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            color={Colors.grayColor}
            size={18}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const TabBarView = ({props, nearByList, loader}) => {
  const [index, setIndex] = useState(0);
  const routes = loader === true ? [{key: 'first', title: 'Food'}] : nearByList;
  const [foodLists, setFoodLists] = useState([]);

  useEffect(() => {
    restaurantByCategory();
  }, [index]);

  const restaurantByCategory = () => {
    const formData = new FormData();
    formData.append('category_id', '1');
    formData.append('latitude', '28.629341719747938');
    formData.append('longitude', '77.38402881349394');
    Post(Constants.restaurantByCategory, formData).then(
      async res => {
        if (res.status === 200) {
          setFoodLists(res?.data?.restaurants);
        } else {
          // Toaster(res?.message)
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  const renderScene = ({route, jumpTo}) => {
    switch (loader === true ? route.key : route.name) {
      case 'Dinner':
        return <Food props={foodLists} />;
      case 'Fast Food':
        return <Food props={foodLists} />;
      case 'Food':
        return <Food props={foodLists} />;
      case 'Lunch':
        return <Food props={foodLists} />;
      // case 'fifth':
      //   return <Food props={props} />;
      // case 'sixth':
      //   return <Food props={props} />;
      // case 'seventh':
      //   return <Food props={props} />;
    }
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{height: 2.5, backgroundColor: Colors.primaryColor}}
          tabStyle={{
            width: 100,
            height: 52.0,
          }}
          scrollEnabled={true}
          style={{backgroundColor: Colors.whiteColor}}
          renderLabel={({route, focused, color}) => (
            <Text
              style={
                focused
                  ? {...Fonts.primaryColor16Medium}
                  : {...Fonts.lightGrayColor16Medium}
              }>
              {route?.name}
            </Text>
          )}
        />
      )}
    />
  );
};

const Food = ({props}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [restaurants, setRestaurants] = useState(restaurantsList);
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('RestaurantDetail', {item})}
      style={styles.restaurantWrapStyle}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: item?.image}}
          style={styles.restaurantImageStyle}
        />
        <View
          style={{
            width: width / 2.0,
            marginLeft: Sizes.fixPadding,
            height: 100.0,
            justifyContent: 'space-evenly',
          }}>
          <Text numberOfLines={1} style={{...Fonts.blackColor16Medium}}>
            {item?.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={Colors.grayColor}
            />
            <Text numberOfLines={1} style={{...Fonts.grayColor14Medium}}>
              {item?.address}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 8.0,
                ...Fonts.grayColor14Medium,
              }}>
              {item?.rating}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          marginRight: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          height: 100.0,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.grayColor}
          onPress={() => {
            handleRestaurantsUpdate({id: item.id});
            setIsFavourite(item.isFavourite);
            setShowSnackBar(true);
          }}
        />
        <Text
          style={{...Fonts.grayColor14Medium, maxWidth: 100}}
          numberOfLines={1}>
          {item?.distance} km
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={props}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding,
          paddingBottom: Sizes.fixPadding * 7.0,
        }}
      />
      <Snackbar
        style={styles.snackBarStyle}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}>
        {isFavourite ? 'Removed from Favourite' : 'Added to Favourite'}
      </Snackbar>
    </>
  );

  function handleRestaurantsUpdate({id}) {
    const newList = restaurants.map(restaurant => {
      if (restaurant.id === id) {
        const updatedItem = {
          ...restaurant,
          isFavourite: !restaurant.isFavourite,
        };
        return updatedItem;
      }
      return restaurant;
    });
    setRestaurants(newList);
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: Sizes.fixPadding + 5.0,
    paddingRight: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
  },
  headerAddressWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: '#ECECEC',
    paddingVertical: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding,
    paddingRight: Sizes.fixPadding * 3.0,
  },
  snackBarStyle: {
    position: 'absolute',
    bottom: 56.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: '#333333',
    elevation: 0.0,
  },
  restaurantWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding,
  },
  restaurantImageStyle: {
    width: 90.0,
    height: 100.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
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
  addressWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

NearByScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default NearByScreen;
