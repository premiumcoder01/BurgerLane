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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';
import Toaster from '../../components/Toaster';

class RegisterScreen extends Component {
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
    fullName: '',
    lastName: '',
    password: '',
    email: '',
    singleFile: '',
    loading: false,
    errMsg: 'Please fill all details',
    emailValidate: false,
  };

  params = this.props?.route?.params;

  validateEmail = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      this.setState({email: text, emailValidate: false});
      return false;
    } else {
      this.setState({email: text, emailValidate: true});
      console.log('Email is Correct');
    }
  };

  register = () => {
    // const data = {
    //   first_name: this.state.fullName,
    //   last_name: this.state.lastName,
    //   email: this.state.email,
    //   phone: this.props?.route?.params?.phoneNumber,
    //   device_token: Constants.deviceTokenId,
    //   player_id: '',
    //   password: this.state.password,
    //   password_confirmation: this.state.password,
    // };

    const formData = new FormData();

    formData.append('first_name', this.state.fullName);
    formData.append('last_name', this.state.lastName);
    formData.append('email', this.state.email);
    formData.append('phone', this.props?.route?.params?.phoneNumber);
    formData.append('device_token', Constants.deviceTokenId);
    formData.append('player_id', '');
    formData.append('password', this.state.password);
    formData.append('password_confirmation', this.state.password);
    // formData.append('profile_image', {
    //   uri: this.state.singleFile[0]?.uri,
    //   type: this.state.singleFile[0]?.type,
    //   name: this.state.singleFile[0]?.name,
    // });

    if (
      this.state.fullName &&
      this.state.lastName &&
      this.state.emailValidate &&
      this.state.password.length > 5
    ) {
      this.setState({loading: true});
      Post(Constants.register, formData).then(
        async res => {
          if (res.access_token !== undefined) {
            await AsyncStorage.setItem('userDetail', JSON.stringify(res));
            this.props.navigation.push('Verification', {
              email: this.state.email,
            });
          } else {
            console.log('res?.message', res?.message);
            res?.message?.email !== undefined
              ? Toaster(res?.message?.email[0])
              : res?.message?.phone !== undefined
              ? Toaster(res?.message?.phone[0])
              : Toaster(res?.message);
            // if (res?.message?.email !== undefined) {
            //   Toaster(res?.message?.email[0]);
            // }
            // if (res?.message?.phone !== undefined) {
            //   Toaster(res?.message?.phone[0]);
            // } else {
            //   Toaster(res?.message);
            // }
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
        this.state.emailValidate === false && this.state.email
          ? 'Email is not correct'
          : this.state.password
          ? 'Password must be atleast 6'
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
            {this.fullNameTextField()}
            {this.lastNameTextField()}
            {this.passwordTextField()}
            {this.emailAddressTextField()}
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
        onPress={() => this.register()}
        style={styles.continueButtonStyle}>
        <Text style={{...Fonts.whiteColor16Medium}}>Continue</Text>
      </TouchableOpacity>
    );
  }

  emailAddressTextField() {
    return (
      <TextInput
        value={this.state.email}
        onChangeText={text => this.validateEmail(text)}
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

  fullNameTextField() {
    return (
      <TextInput
        value={this.state.fullName}
        onChangeText={text => this.setState({fullName: text})}
        placeholder="Full Name"
        selectionColor={Colors.primaryColor}
        placeholderTextColor={Colors.grayColor}
        style={styles.textFieldStyle}
      />
    );
  }

  lastNameTextField() {
    return (
      <TextInput
        value={this.state.lastName}
        onChangeText={text => this.setState({lastName: text})}
        placeholder="Last Name"
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
        Register your account
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
    marginBottom: 10,
  },
  textFieldStyle: {
    ...Fonts.blackColor16Medium,
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
    elevation:3,
    marginTop: Sizes.fixPadding,
  },
});

RegisterScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default RegisterScreen;
