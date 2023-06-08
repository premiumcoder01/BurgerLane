const devUrl = 'https://burgerlane.isynbus.com/api/';
let apiUrl = devUrl;
import uuid from 'react-native-uuid';

var uniqueId = uuid.v4();

const Constants = {
  baseUrl: apiUrl,
  deviceTokenId: uniqueId,

  login: 'customer/login',
  register: 'customer/register',
  forgetPassword: 'customer/forget-password',
  verifyOtp: 'customer/verify-otp',
  resetPassword: 'customer/ResetPassword',
  home: 'customer/home',
  searchTab: 'customer/search-tab',
  searchDelete: 'customer/search-delete',
  searchDeleteAll: 'customer/search-delete-all',
  searchResultAutoComplete: 'customer/search-auto-complete',
  onGoingOrders: 'customer/order-tab',
  restaurantByCategory: 'customer/restaurant-by-categories',
  saveHistory: 'customer/save-history',
  nearBy: 'customer/near-by',
  locationGet: 'customer/location-get',
  offerList: 'view-all/offer',
  post_address: 'customer/post-address',
  update_address: 'customer/update-address',
  get_address_detail: 'customer/get-address-detail',
  set_default_address: 'customer/set_default_address',
  getOfferRes: 'get-offer-restaurant/',
  restaurantDetails: 'customer/restaurant?restaurant_id=',
  orderDetails: 'customer/cart-detail',
  popularList: 'customer/popular-item-see-all',
  // productionUrl: prodUrl,
  developmentUrl: devUrl,
  googleRegister: 'auth/google/register',
  googleLogin: 'auth/google',
  updateProfile: 'customer/updateprofile',
  updatePassword: 'customer/changepassword',
  getUserProfile: 'customer/getuserprofile',
  productDetails: 'customer/product-detail',
  addToCart: 'customer/add-to-cart',
  favouriteFood: 'customer/favourite-food',

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
};

export default Constants;
