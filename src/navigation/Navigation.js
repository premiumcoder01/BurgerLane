import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import addNewDeliveryAddressScreen from '../screens/addNewDeliveryAddress/addNewDeliveryAddressScreen';
import AddDeliveryAddress from '../screens/address/AddDeliveryAddress';
import EditDeliveryAddress from '../screens/address/EditDeliveryAddress';
import addressScreen from '../screens/address/addressScreen';
import registerScreen from '../screens/auth/registerScreen';
import signinScreen from '../screens/auth/signinScreen';
import verificationScreen from '../screens/auth/verificationScreen';
import confirmOrderScreen from '../screens/confirmOrder/confirmOrderScreen';
import EditProfileScreen from '../screens/editProfile/editProfileScreen';
import ProfileScreen from '../screens/profile/profileScreen';
import notificationsScreen from '../screens/notifications/notificationsScreen';
import onboardingScreen from '../screens/onboarding/onboardingScreen';
import orderInformationScreen from '../screens/orderInformation/orderInformationScreen';
import paymentMethodsScreen from '../screens/paymentMethods/paymentMethodsScreen';
import ratingScreen from '../screens/rating/ratingScreen';
import restaurantDetailScreen from '../screens/restaurantDetail/restaurantDetailScreen';
import restaurantsListScreen from '../screens/restaurantsList/restaurantsListScreen';
import searchScreen from '../screens/search/searchScreen';
import splashScreen from '../screens/splashScreen';
import TrackOrderScreen from '../screens/trackOrder/trackOrderScreen';
// import bottomTabBarScreen from '../components/bottomTabBarScreen';
import DiscoverScreen from '../screens/discover/discoverScreen';
import NearByScreen from '../screens/nearBy/nearByScreen';
import OrderScreen from '../screens/order/orderScreen';
import FavouritesScreen from '../screens/favourites/favouritesScreen';
import LoginScreen from '../screens/auth/loginScreen';
import ForgetPassword from '../screens/auth/forgetPassword';
import ResetPassword from '../screens/auth/resetPassword';
import AllProductList from '../screens/allProductList/allProductList';
import CategoryList from '../screens/categoryList/categoryList';
import OfferListRestaurant from '../screens/offerListRestaurant';
import popularItems from '../screens/popularItems/popularItems';
import AddressListScreen from '../screens/address/AddressListScreen';
import Support from '../screens/Support/Support';
import Settings from '../screens/Settings/Settings';
import InviteFriends from '../screens/InviteFriends/InviteFriends';
import Vouchers from '../screens/Vouchers/Vouchers';
import Language from '../screens/Language/Language';
import BottomTab from '../components/BottomTab';
import RestaurantDetail from '../screens/restaurantDetail/RestaurantDetail';
import ConfirmOrder from '../screens/confirmOrder/ConfirmOrder';
import Discover from '../screens/discover/Discover';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        options={{headerShown: false}}
        component={splashScreen}
      />

      <Stack.Screen
        name="Onboarding"
        options={{headerShown: false}}
        component={onboardingScreen}
      />
      <Stack.Screen
        name="Login"
        options={{headerShown: false}}
        component={LoginScreen}
      />
      <Stack.Screen
        name="ForgetPassword"
        options={{headerShown: false}}
        component={ForgetPassword}
      />
      <Stack.Screen
        name="ResetPassword"
        options={{headerShown: false}}
        component={ResetPassword}
      />
      <Stack.Screen
        name="Signin"
        options={{headerShown: false}}
        component={signinScreen}
      />
      <Stack.Screen
        name="Register"
        options={{headerShown: false}}
        component={registerScreen}
      />
      <Stack.Screen
        name="Verification"
        options={{headerShown: false}}
        component={verificationScreen}
      />
      <Stack.Screen
        name="BottomTabBar"
        options={{headerShown: false}}
        component={BottomTab}
      />
      <Stack.Screen name="Search" component={searchScreen} />
      <Stack.Screen name="RestaurantsList" component={restaurantsListScreen} />
      <Stack.Screen
        name="RestaurantDetail"
        options={{headerShown: false}}
        // component={restaurantDetailScreen}
        component={RestaurantDetail}
      />
      <Stack.Screen
        name="ConfirmOrder"
        options={{headerShown: false}}
        // component={confirmOrderScreen}
        component={ConfirmOrder}
      />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen
        name="OrderInformation"
        component={orderInformationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        options={{headerShown: false}}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="Profile"
        options={{headerShown: false}}
        component={ProfileScreen}
      />
      <Stack.Screen name="Rating" component={ratingScreen} />

      <Stack.Screen name="PaymentMethods" component={paymentMethodsScreen} />
      <Stack.Screen
        name="Address"
        options={{headerShown: false}}
        component={addressScreen}
      />
      <Stack.Screen
        name="Notifications"
        options={{headerShown: false}}
        component={notificationsScreen}
      />
      <Stack.Screen
        name="AddNewDeliveryAddress"
        component={addNewDeliveryAddressScreen}
      />

      <Stack.Screen
        name="AddDeliveryAddress"
        options={{headerShown: false}}
        component={AddDeliveryAddress}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="EditDeliveryAddress"
        component={EditDeliveryAddress}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="Discover"
        component={Discover}
      />
      <Stack.Screen
        name="NearBy"
        options={{headerShown: false}}
        component={NearByScreen}
      />
      <Stack.Screen
        name="Order"
        options={{headerShown: false}}
        component={OrderScreen}
      />
      <Stack.Screen
        name="AllProductList"
        options={{headerShown: false}}
        component={AllProductList}
      />
      <Stack.Screen
        name="CategoryList"
        options={{headerShown: false}}
        component={CategoryList}
      />
      <Stack.Screen
        name="OfferList"
        options={{headerShown: false}}
        component={OfferListRestaurant}
      />
      <Stack.Screen
        name="PopularItems"
        options={{headerShown: false}}
        component={popularItems}
      />
      <Stack.Screen
        name="AddressListScreen"
        options={{headerShown: false}}
        component={AddressListScreen}
      />
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
      <Stack.Screen name="Support" component={Support} />

      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Invite Friends" component={InviteFriends} />
      <Stack.Screen name="My Vouchers" component={Vouchers} />
    </Stack.Navigator>
  );
};

export default Navigation;
