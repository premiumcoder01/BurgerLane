import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  Animated,
  BackHandler,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  Settings,
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk-next';
import {Post} from '../helpers/Service';
import Constants from '../helpers/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const googleLogin = () => {
  const navigation = useNavigation();
  const googleWithLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const {photo, email, name, id} = userInfo.user;
        let obj = {...userInfo.user, socialType: 'GMAIL'};
        // checkIfSocialSignup(obj, "google");
        // checkEmail(email);
        register(userInfo?.user);
      }
      // console.log('userInfo================>', userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const register = user => {
    const formData = new FormData();

    formData.append('first_name', user?.name);
    formData.append('last_name', '');
    formData.append('email', user?.email);
    formData.append('phone', '12345678');
    formData.append('device_token', '');
    formData.append('player_id', '');
    formData.append('password', '123456');
    formData.append('password_confirmation', '123456');
    formData.append('google_id', user?.id);

    GoogleSignin.signOut();
    Post(Constants.googleRegister, formData).then(
      async res => {
        login(user);
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  const login = user => {
    console.log('google info of user', user);
    const formData = new FormData();

    formData.append('email', user?.email);
    formData.append('google_id', user?.id);

    Post(Constants.googleLogin, formData).then(
      async res => {
        if (res.access_token !== undefined) {
          await AsyncStorage.setItem('userDetail', JSON.stringify(res));
          console.log('user login sucessfully');
          navigation.push('BottomTabBar');
        } else {
          // Toaster(res?.message);
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  const facebookWithLogin = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        console.log(result);
        // alert(`loginres => ${JSON.stringify(result)}`)
        if (result.isCancelled) {
          console.log('cancelled', result);
        } else {
          getUserData();
        }
      },
    );
  };
  const getUserData = () => {
    AccessToken.getCurrentAccessToken().then(data => {
      console.log(data);
      let token = data.accessToken.toString();
      fetch(
        'https://graph.facebook.com/v2.5/me?fields=email,name,id,picture&access_token=' +
          token,
      )
        .then(response => response.json())
        .then(json => {
          console.log(json);

          // register(json);
        })
        .catch(() => {
          console.log('ERROR GETTING DATA FROM FACEBOOK');
        });
    });
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => googleWithLogin()}
        style={styles.loginWithGoogleButtonStyle}>
        <Image
          source={require('../../assets/images/google.png')}
          style={{width: 20, height: 20}}
        />
        <Text
          style={{
            ...Fonts.blackColor16Medium,
            marginLeft: 20,
          }}>
          {'  '}Log in with Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => facebookWithLogin()}
        style={styles.loginWithFacebookButtonStyle}>
        <Image
          source={require('../../assets/images/facebook.png')}
          style={{width: 20, height: 20}}
        />
        <Text
          style={{
            ...Fonts.whiteColor16Medium,
            marginLeft: 20,
          }}>
          Log in with Facebook
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default googleLogin;

const styles = StyleSheet.create({
  loginWithGoogleButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 25,
    margin: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    elevation: 6,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  loginWithFacebookButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B5998',
    elevation: 6,
    borderRadius: 25,
    margin: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding - 5.0,
  },
  phoneNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 4.0,
  },
  appLogoStyle: {
    width: 200.0,
    height: 150.0,
    alignSelf: 'center',
    marginTop: Sizes.fixPadding * 4.0,
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
});
