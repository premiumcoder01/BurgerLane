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

const {height} = Dimensions.get('screen');

class ResetPassword extends Component {
  constructor(props) {
    super(props);
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
    this.props.navigation.pop();
    return true;
  };

  state = {
    email: this.props?.route?.params?.email,
    password: '',
    confirmPassword: '',
    loading: false,
    errMsg: 'Password must be atleast 6 digits',
  };

  forgetPassword = () => {
    // const data = {
    //   email: this.state?.email,
    //   password: this.state?.password,
    //   password_confirmation: this.state?.confirmPassword,
    // };
    const formData = new FormData();

    formData.append('email', this.state.email);
    formData.append('password', this.state.password);
    formData.append('password_confirmation', this.state.confirmPassword);

    if (
      this.state.password.length > 5 &&
      this.state.confirmPassword > 6 &&
      this.state.password === this.state.confirmPassword
    ) {
      this.setState({loading: true});
      Post(Constants.resetPassword, formData).then(
        async res => {
          if (res.status === 200) {
            this.props.navigation.push('Login');
          } else {
            // Toaster(res?.message);
          }

          this.setState({loading: false});
        },
        err => {
          this.setState({loading: false});
          console.log(err.response.data);
        },
      );
    } else {
      Toaster(
        this.state.password !== this.state.confirmPassword
          ? 'The password confirmation and password must match.'
          : this.state.errMsg,
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
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
            {this.confirmPasswordTextField()}
            {this.continueButton()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.forgetPassword()}
        style={styles.continueButtonStyle}>
        <Text style={{...Fonts.whiteColor16Medium}}>Continue</Text>
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

  confirmPasswordTextField() {
    return (
      <TextInput
        value={this.state.confirmPassword}
        onChangeText={text => this.setState({confirmPassword: text})}
        secureTextEntry={true}
        placeholder="Confirm Password"
        selectionColor={Colors.primaryColor}
        placeholderTextColor={Colors.grayColor}
        style={styles.textFieldStyle}
      />
    );
  }

  registerText() {
    return (
      <Text
        style={{
          marginBottom: Sizes.fixPadding + 8.0,
          textAlign: 'center',
          ...Fonts.grayColor17Medium,
        }}>
        Reset Password
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
    return (
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={{padding: Sizes.fixPadding * 2.0}}
        onPress={() => this.props.navigation.pop()}
      />
    );
  }
}

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 200.0,
    height: 150.0,
    alignSelf: 'center',
    marginTop: Sizes.fixPadding * 2.5,
  },
  textFieldStyle: {
    ...Fonts.blackColor17Medium,
    backgroundColor: Colors.whiteColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    elevation: 0.3,
    marginVertical: Sizes.fixPadding,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding,
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

ResetPassword.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default ResetPassword;
