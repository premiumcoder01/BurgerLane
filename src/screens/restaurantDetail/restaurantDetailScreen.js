import React, { useState } from 'react';
import { Component } from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from '../../constants/styles';
import CollapsingToolbar from '../../components/sliverAppBar';
import { Snackbar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabView, TabBar } from 'react-native-tab-view';
import Products from '../products/productsScreen';
import Review from '../review/reviewScreen';
import Information from '../information/informationScreen';
import { GetApi } from '../../helpers/Service';
import Constants from '../../helpers/Constant';

class RestaurantDetailScreen extends Component {
  state = {
    restaurantDetails: {},
    popularItems: [],
    productCategories: [],
    restroId: '11',
  };

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    this.restaurantDetails();
  }

  restaurantDetails = () => {
    this.setState({ loading: true });
    console.log("this.props.routeeeeeeeeeeeeeee");
    console.log(this.props.route);


    GetApi(
      //Constants.restaurantDetails + `${this.props.route?.params?.item?.id}`,
      Constants.restaurantDetails + `${this.props.route?.params?.restaurant_id}`,
    ).then(
      async res => {
        if (res.Status === 200) {
          this.setState({
            restaurantDetails: res?.data?.Restaurant[0],
            popularItems: res?.data?.popularItems?.data,
            productCategories: res?.data?.categories,
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

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton = () => {
    this.props.navigation.pop();
    return true;
  };

  item = this.props.route?.params?.details;
  from = this.props.route?.params?.from;

  state = {
    isFavourite: false,
    showSnackBar: false,
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
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
              onPress={() => this.props.navigation.pop()}
            />
          }
          rightItem={
            <MaterialIcons
              name={this.state.isFavourite ? 'bookmark' : 'bookmark-outline'}
              size={25}
              color={Colors.whiteColor}
              style={{ marginTop: Sizes.fixPadding + 5.0 }}
              onPress={() =>
                this.setState({
                  isFavourite: !this.state.isFavourite,
                  showSnackBar: true,
                })
              }
            />
          }
          element={
            <View>
              <Text style={{ ...Fonts.whiteColor22Medium }}>
                {this.state.restaurantDetails?.name}
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
                  {this.state.restaurantDetails?.address}
                </Text>
              </View>
              <View
                style={{
                  marginTop: Sizes.fixPadding - 2.0,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="star"
                  size={20}
                  color={Colors.ratingColor}
                />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding - 8.0,
                    ...Fonts.whiteColor14Regular,
                  }}>
                  {this.state.restaurantDetails?.rating}
                </Text>
              </View>
            </View>
          }
          toolbarColor={Colors.primaryColor}
          toolbarMinHeight={50}
          toolbarMaxHeight={200}
          isImageBlur={true}
          src={{
            uri: this.state.restaurantDetails?.image,
          }}
          childrenMinHeight={720}>
          <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <TabBarView
              props={this.props}
              restaurantDetails={this.state.restaurantDetails}
              popularItems={this.state.popularItems}
              productList={this.state.productCategories}
            />
          </View>
        </CollapsingToolbar>
        <Snackbar
          style={styles.snackBarStyle}
          visible={this.state.showSnackBar}
          onDismiss={() => this.setState({ showSnackBar: false })}>
          {!this.state.isFavourite
            ? 'Removed from Favourite'
            : 'Added to Favourite'}
        </Snackbar>
      </SafeAreaView>
    );
  }
}

const TabBarView = ({ props, restaurantDetails, popularItems, productList, restroId }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Products' },
    { key: 'second', title: 'Review' },
    { key: 'third', title: 'Information' },
  ]);
  // let data;
  // data = JSON.parse(JSON.stringify(restaurantDetails)); 
  // console.log("restaurantDetails===================", data.id);


  // console.log("restaurantDetails===================", data.id);

  const layout = useWindowDimensions();

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'first':
        return (
          <Products
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
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{
            height: 2.5,
            marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
            backgroundColor: Colors.darkPrimaryColor,
          }}
          tabStyle={{
            width: layout.width / 3.1,
            height: 52.0,
          }}
          style={{ backgroundColor: Colors.primaryColor, elevation: 0.0 }}
          renderLabel={({ route, focused, color }) => (
            <Text
              style={{
                marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
                marginRight: index == 2 ? Sizes.fixPadding : 0.0,
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

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
    paddingBottom: Sizes.fixPadding * 6.0,
  },
  snackBarStyle: {
    elevation: 0.0,
    backgroundColor: '#333333',
    position: 'absolute',
    left: -10.0,
    right: -10.0,
    bottom: -10.0,
  },
});

// RestaurantDetailScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//     }
// }

export default RestaurantDetailScreen;
