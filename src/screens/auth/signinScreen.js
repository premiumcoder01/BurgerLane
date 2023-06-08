import React, {Component} from 'react';
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
// import { withNavigation } from "react-navigation";
import {Colors, Fonts, Sizes} from '../../constants/styles';
import IntlPhoneInput from 'react-native-intl-phone-input';
import Toaster from '../../components/Toaster';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Settings} from 'react-native-fbsdk-next';
// import { NavigationEvents } from 'react-navigation';
import GoogleLogin from '../../components/googleLogin';

const {height} = Dimensions.get('screen');

class SigninScreen extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    GoogleSignin.configure({
      webClientId:
        '247876459223-j6bj3k1jb1a3sgdaefbg2drlqji3g2m0.apps.googleusercontent.com', // my clientID
      offlineAccess: false,
    });
    Settings.initializeSDK();
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
          toValue: -0.04 * height,
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

  registerHandler() {
    if (this.state.phoneNumber) {
      this.props.navigation.push('Register', {
        phoneNumber: this.state.phoneNumber.replace(/ /g, ''),
      });
    } else {
      Toaster(this.state.errMsg);
    }
  }

  state = {
    phoneNumber: '',
    backClickCount: 0,
    errMsg: 'Enter valid number',
    loading: false,
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        {/* <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} /> */}
        <View style={{flex: 1}}>
          {/* <Spinner color={'#fff'} visible={this.state.loading} /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Sizes.fixPadding}}>
            {this.appLogo()}
            {this.signinText()}
            {this.mobileNumberTextField()}
            {this.continueButton()}
            {this.otpInfo()}
            {this.loginAccount()}
            <GoogleLogin />
          </ScrollView>
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
      </SafeAreaView>
    );
  }

  loginAccount() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.push('Login')}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding * 5.0,
            textAlign: 'center',
            ...Fonts.grayColor17Medium,
          }}>
          Login
        </Text>
      </TouchableOpacity>
    );
  }

  otpInfo() {
    return (
      <Text
        style={{
          ...Fonts.grayColor15Medium,
          textAlign: 'center',
          marginVertical: 10,
        }}>
        We’ll send otp for verification
      </Text>
    );
  }

  continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.registerHandler()}
        style={styles.continueButtonStyle}>
        <Text style={{...Fonts.whiteColor16Medium}}>Continue</Text>
      </TouchableOpacity>
    );
  }

  mobileNumberTextField() {
    return (
      <IntlPhoneInput
        onChangeText={({phoneNumber}) =>
          this.setState({phoneNumber: phoneNumber})
        }
        defaultCountry="IN"
        containerStyle={styles.phoneNumberWrapStyle}
        dialCodeTextStyle={{...Fonts.blackColor15Medium}}
        phoneInputStyle={{
          flex: 1,
          marginLeft: Sizes.fixPadding, 
          ...Fonts.blackColor15Medium,
        }}
        placeholder="Phone Number"
        // dialCodeTextStyle={{ ...Fonts.blackColor16Medium }}
      />
    );
  }

  signinText() {
    return (
      <Text
        style={{
          textAlign: 'center',
          ...Fonts.grayColor17Medium,
          marginVertical: 10,
        }}>
        Signin with Phone Number
      </Text>
    );
  }

  appLogo() {
    return (
      <Image
        source={require('../../../assets/images/delivery.png')}
        style={styles.appLogoStyle}
        resizeMode="contain"
      />
    );
  }
}

const styles = StyleSheet.create({
  loginWithGoogleButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  loginWithFacebookButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B5998',
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding * 2,
    marginBottom: Sizes.fixPadding - 5.0,
  },
  phoneNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderRadius: 25,
    marginHorizontal: Sizes.fixPadding * 2,
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

SigninScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default SigninScreen;
