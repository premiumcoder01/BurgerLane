import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {GetApi} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import {useNavigation} from '@react-navigation/core';
import CollapsingToolbar from '../../components/sliverAppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabView, TabBar} from 'react-native-tab-view';
import {useWindowDimensions} from 'react-native';
import Products from '../products/productsScreen';
import Review from '../review/reviewScreen';
import Information from '../information/informationScreen';
import ProductsData from '../products/ProductsData';
import Spinner from '../../components/Spinner';

const RestaurantDetail = props => {
  const navigation = useNavigation();
  const [restaurantData, setRestaurantData] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);

  let item_id = props.route?.params?.product_id;
  let latitude = props.route.params.latitude;
  let longitude = props.route.params.longitude;

  const restaurantDetails = () => {
    setLoading(true);
    {
      props.route?.params?.isSelected
        ? GetApi(
            Constants.restaurant +
              `item_id=${item_id}&latitude=${latitude}&longitude=${longitude}`,
          ).then(
            res => {
              if (res.Status === 200) {
                setRestaurantData(res?.data?.Restaurant[0]);
                setPopularItems(res?.data?.popularItems.data);
                setProductCategories(res?.data?.categories);
                setLoading(false);
              }
            },
            err => {
              console.log(err.response.data);
            },
          )
        : GetApi(
            Constants.restaurantDetails +
              `${props.route?.params?.restaurant_id}`,
          ).then(
            async res => {
              if (res.Status === 200) {
                setRestaurantData(res?.data?.Restaurant[0]);
                setPopularItems(res?.data?.popularItems.data);
                setProductCategories(res?.data?.categories);
                setLoading(false);
              }
            },
            err => {
              console.log(err.response.data);
            },
          );
    }
  };

  useEffect(() => {
    restaurantDetails();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.primaryColor}}>
      <Spinner color={'#fff'} visible={loading} />
      <CollapsingToolbar
        leftItem={
          <MaterialIcons
            name="arrow-back"
            size={25}
            color={Colors.whiteColor}
            style={{
              marginTop: Sizes.fixPadding + 5.0,
              marginLeft: Sizes.fixPadding * 2.0,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightItem={
          <MaterialIcons
            name={isFavourite ? 'bookmark' : 'bookmark-outline'}
            size={25}
            color={Colors.whiteColor}
            style={{marginTop: Sizes.fixPadding + 5.0}}
            onPress={() => {
              setIsFavourite(!isFavourite);
            }}
          />
        }
        element={
          <View>
            <Text style={{...Fonts.whiteColor22Medium}}>
              {restaurantData?.name}
            </Text>
            <View
              style={{
                marginTop: Sizes.fixPadding - 2.0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={Colors.whiteColor}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 8.0,
                  ...Fonts.whiteColor14Regular,
                }}>
                {restaurantData?.address}
              </Text>
            </View>
            <View
              style={{
                marginTop: Sizes.fixPadding - 2.0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 8.0,
                  ...Fonts.whiteColor14Regular,
                }}>
                4.0
              </Text>
            </View>
          </View>
        }
        toolbarColor={Colors.primaryColor}
        isImageBlur={true}
        src={{
          uri: restaurantData?.image,
        }}>
        <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
          <TabBarView
            props={props}
            restaurantDetails={restaurantData}
            popularItems={popularItems}
            productList={productCategories}
          />
        </View>
      </CollapsingToolbar>
    </SafeAreaView>
  );
};

const TabBarView = ({props, restaurantDetails, popularItems, productList}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Products'},
    {key: 'second', title: 'Review'},
    {key: 'third', title: 'Information'},
  ]);

  const layout = useWindowDimensions();
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'first':
        return (
          <ProductsData
            props={props}
            popularItemList={popularItems}
            productList={productList}
            restroId={restaurantDetails?.id}
          />
        );
      case 'second':
        return <Review restaurantDetails={restaurantDetails} />;
      case 'third':
        return <Information restaurantDetails={restaurantDetails} />;
    }
  };
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      swipeEnabled
      style={{flex: 1, height: 5500}}
      swipeVelocityImpact={0.2}
      gestureHandlerProps={{
        activeOffsetX: [-30, 30],
      }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{
            height: 2.5,
            marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
            backgroundColor: 'transparent',
          }}
          tabStyle={{
            width: layout.width / 3.1,
            height: 50,
          }}
          style={{backgroundColor: Colors.primaryColor, elevation: 0}}
          renderLabel={({route, focused, color}) => (
            <Text
              style={{
                // marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
                // marginRight: index == 2 ? Sizes.fixPadding : 0.0,
                ...Fonts.whiteColor15Medium,
              }}>
              {route.title}
            </Text>
          )}
        />
      )}
    />
  );
};

export default RestaurantDetail;

const styles = StyleSheet.create({
  snackBarStyle: {
    elevation: 0.0,
    backgroundColor: '#333333',
    position: 'absolute',
    left: -10.0,
    right: -10.0,
    bottom: -10.0,
  },
});
