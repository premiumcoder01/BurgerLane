import {StyleSheet, Text, View} from 'react-native';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import React from 'react';
import DiscoverScreen from '../screens/discover/discoverScreen';
import NearByScreen from '../screens/nearBy/nearByScreen';
import OrderByScreen from '../screens/order/orderScreen';
import FavouriteScreen from '../screens/favourites/favouritesScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/styles';
import ProfileScreen from '../screens/profile/profileScreen';
import Discover from '../screens/discover/Discover';
const Tabs = AnimatedTabBarNavigator();
const BottomTab = () => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: '#F2647C',
        activeBackgroundColor: '#FCE0E5',
      }}
    //   appearance={{
    //     floating: true,
    //   }}
      >
      <Tabs.Screen
        name="Discover"
        // component={DiscoverScreen}
        component={Discover}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons
              name="explore"
              size={25}
              color={Colors.primaryColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Near By"
        // component={NearByScreen}
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons
              name="location-on"
              size={25}
              color={Colors.primaryColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Order"
        component={OrderByScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons
              name="shopping-basket"
              size={25}
              color={Colors.primaryColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons
              name="bookmark"
              size={25}
              color={Colors.primaryColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons
              name="person"
              size={25}
              color={Colors.primaryColor}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({});
