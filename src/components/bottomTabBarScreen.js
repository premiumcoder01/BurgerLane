import React, {Component} from 'react';
import {
  Text,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
// import { withNavigation } from "react-navigation";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Colors, Fonts, Sizes} from '../constants/styles';
import DiscoverScreen from '../screens/discover/discoverScreen';
import NearByScreen from '../screens/nearBy/nearByScreen';
import OrderScreen from '../screens/order/orderScreen';
import FavouritesScreen from '../screens/favourites/favouritesScreen';
// import ProfileScreen from "../screens/profile/profileScreen";
import ProfileScreen from '../screens/profile/profileScreen';
// import { NavigationEvents } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {height} = Dimensions.get('screen');

class BottomTabBarScreen extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
    return true;
  };

  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.08 * height,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }

  state = {
    currentIndex: 1,
    backClickCount: 0,
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {/* <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} /> */}

        {this.state.currentIndex == 1 ? (
          <DiscoverScreen {...this.props} />
        ) : this.state.currentIndex == 2 ? (
          <NearByScreen {...this.props} />
        ) : this.state.currentIndex == 3 ? (
          <OrderScreen {...this.props} />
        ) : this.state.currentIndex == 4 ? (
          <FavouritesScreen {...this.props} />
        ) : (
          // this.props.navigation.navigate()
          <ProfileScreen {...this.props} />
        )}

        <View style={styles.bottomTabBarStyle}>
          {this.bottomTabBarItem({
            index: 1,
            iconName: 'explore',
            tag: 'Discover',
          })}
          {this.bottomTabBarItem({
            index: 2,
            iconName: 'location-on',
            tag: 'Near By',
          })}
          {this.bottomTabBarItem({
            index: 3,
            iconName: 'shopping-basket',
            tag: 'Order',
          })}
          {this.bottomTabBarItem({
            index: 4,
            iconName: 'bookmark',
            tag: 'Favourite',
          })}
          {this.bottomTabBarItem({
            index: 5,
            iconName: 'person',
            tag: 'Profile',
          })}
        </View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: this.springValue}]},
          ]}>
          <Text style={{...Fonts.whiteColor16Regular}}>
            Press Back Once Again to Exit.
          </Text>
        </Animated.View>
      </View>
    );
  }

  bottomTabBarItem({index, iconName, tag}) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.setState({currentIndex: index})}>
        {this.state.currentIndex == index ? (
          <View style={styles.selectedTabStyle}>
            <MaterialIcons
              name={iconName}
              size={25}
              color={Colors.primaryColor}
            />
            <Text
              style={{
                ...Fonts.grayColor14Medium,
                marginLeft: Sizes.fixPadding + 5.0,
              }}>
              {tag}
            </Text>
          </View>
        ) : (
          <MaterialIcons name={iconName} size={25} color={Colors.grayColor} />
        )}
      </TouchableOpacity>
    );
  }
}

// BottomTabBarScreen.navigationOptions = () => {
//     return {
//         header: () => null
//     }
// }

export default BottomTabBarScreen;

const styles = StyleSheet.create({
  bottomTabBarStyle: {
    position: 'absolute',
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
    height: 65.0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopLeftRadius: Sizes.fixPadding + 5.0,
    borderTopRightRadius: Sizes.fixPadding + 5.0,
    elevation: 1.0,
    borderTopColor: 'gray',
    borderTopWidth: 0.2,
  },
  animatedView: {
    backgroundColor: Colors.blackColor,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 3.0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE0E5',
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding * 4.0,
  },
});
