import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  BackHandler,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';
import Toaster from '../../components/Toaster';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GoogleLogin from '../../components/googleLogin';

const {height} = Dimensions.get('screen');

class LoginScreen extends Component {
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
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton = () => {
    this.state.backClickCount === 1 ? BackHandler.exitApp() : this._spring();
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

  state = {
    password: '',
    email: '',
    loading: false,
    backClickCount: 0,
    errMsg: 'Please fill all details',
  };

  login = () => {
    // const data = {
    //   email: this.state.email,
    //   password: this.state.password,
    // };
    const formData = new FormData();

    formData.append('email', this.state.email);
    formData.append('password', this.state.password);

    if (this.state.email && this.state.password) {
      this.setState({loading: true});
      Post(Constants.login, formData).then(
        async res => {
          // console.log('first toke data', res);
          if (res.access_token !== undefined) {
            await AsyncStorage.setItem('userDetail', JSON.stringify(res));
            this.props.navigation.push('BottomTabBar');
          } else {
            Toaster(res?.message);
          }

          this.setState({loading: false});
        },
        err => {
          this.setState({loading: false});
          console.log(err.response.data);
        },
      );
    } else {
      Toaster(this.state.errMsg);
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <Spinner color={'#fff'} visible={this.state.loading} />
        <View style={{flex: 1}}>
          {this.backArrow()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Sizes.fixPadding}}>
            {this.appLogo()}
            {this.registerText()}
            {this.emailAddressTextField()}
            {this.passwordTextField()}
            {this.continueButton()}
            {this.registerAccount()}
            {this.forgetPassword()}
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

  continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.login()}
        style={styles.continueButtonStyle}>
        <Text style={{...Fonts.whiteColor16Medium}}>Continue</Text>
      </TouchableOpacity>
    );
  }

  registerAccount() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.navigate('Signin')}>
        <Text
          style={{
            marginVertical: Sizes.fixPadding + 9.0,
            textAlign: 'center',
            ...Fonts.grayColor17Medium,
          }}>
          Register
        </Text>
      </TouchableOpacity>
    );
  }

  forgetPassword() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.push('ForgetPassword')}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 8.0,
            textAlign: 'center',
            ...Fonts.grayColor17Medium,
          }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    );
  }

  emailAddressTextField() {
    return (
      <TextInput
        value={this.state.email}
        onChangeText={text => this.setState({email: text})}
        placeholder="Email Address"
        selectionColor={Colors.primaryColor}
        placeholderTextColor={Colors.grayColor}
        style={styles.textFieldStyle}
      />
    );
  }

  passwordTextField() {
    return (
      <TextInput
        value={this.state.password}
        onChangeText={text => this.setState({password: text})}
        secureTextEntry={true}
        placeholder="Password"
        selectionColor={Colors.primaryColor}
        placeholderTextColor={Colors.grayColor}
        style={styles.textFieldStyle}
      />
    );
  }

  // fullNameTextField() {
  //   return (
  //     <TextInput
  //       value={this.state.fullName}
  //       onChangeText={text => this.setState({fullName: text})}
  //       placeholder="Full Name"
  //       selectionColor={Colors.primaryColor}
  //       placeholderTextColor={Colors.grayColor}
  //       style={styles.textFieldStyle}
  //     />
  //   );
  // }

  // lastNameTextField() {
  //   return (
  //     <TextInput
  //       value={this.state.lastName}
  //       onChangeText={text => this.setState({lastName: text})}
  //       placeholder="Last Name"
  //       selectionColor={Colors.primaryColor}
  //       placeholderTextColor={Colors.grayColor}
  //       style={styles.textFieldStyle}
  //     />
  //   );
  // }

  registerText() {
    return (
      <Text
        style={{
          marginVertical: Sizes.fixPadding + 8.0,
          textAlign: 'center',
          ...Fonts.grayColor17Medium,
        }}>
        Login your account
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

  backArrow() {
    return <View style={{padding: Sizes.fixPadding * 2.0}} />;
  }
}

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 200.0,
    height: 150.0,
    alignSelf: 'center',
  },
  textFieldStyle: {
    ...Fonts.blackColor15Medium,
    backgroundColor: Colors.whiteColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2,
    borderRadius: 25,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    elevation: 3,
    marginVertical: Sizes.fixPadding,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding * 2,
    marginBottom: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding,
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

LoginScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default LoginScreen;
