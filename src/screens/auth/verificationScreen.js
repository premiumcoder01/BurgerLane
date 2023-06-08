import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { withNavigation } from "react-navigation";
import {Colors, Sizes, Fonts} from '../../constants/styles';
import Dialog from 'react-native-dialog';
import {Bounce} from 'react-native-animated-spinkit';
import Constants from '../../helpers/Constant';
import {Post} from '../../helpers/Service';
import Toaster from '../../components/Toaster';
import { Alert } from 'react-native';

const {width} = Dimensions.get('screen');

class VerificationScreen extends Component {
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
    isLoading: false,
    firstDigit: '',
    secondDigit: '',
    thirdDigit: '',
    forthDigit: '',
    loading: false,
  };

  params = this.props?.route?.params;

  verifyOtp = () => {
    this.setState({loading: false});
    // const data = {
    //   email: this.props?.route?.params?.email,
    //   otp:
    //     this.state.firstDigit +
    //     '' +
    //     this.state.secondDigit +
    //     '' +
    //     this.state.thirdDigit +
    //     '' +
    //     this.state.forthDigit,
    // };

    const formData = new FormData();

    formData.append('email', this.props?.route?.params?.email);
    formData.append(
      'otp',
      this.state.firstDigit +
        '' +
        this.state.secondDigit +
        '' +
        this.state.thirdDigit +
        '' +
        this.state.forthDigit,
    );
    Post(Constants.verifyOtp, formData).then(
      async res => {
        if (res.status === 200) {
          setTimeout(() => {
            this.props?.route?.params?.from === 'forgetPassword'
              ? this.props.navigation.navigate('ResetPassword', {
                  email: this.props?.route?.params?.email,
                })
              : this.props.navigation.navigate('BottomTabBar');
          }, 2000);
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
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding}}>
          {this.backArrow()}
          {this.verificationInfo()}
          {this.otpFields()}
          {this.resendInfo()}
          {this.submitButton()}
        </ScrollView>
        {this.loading()}
      </SafeAreaView>
    );
  }

  backArrow() {
    return (
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={Colors.blackColor}
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        onPress={() => this.props.navigation.pop()}
      />
    );
  }

  loading() {
    return (
      <Dialog.Container
        visible={this.state.isLoading}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{margin: 0.0}}>
        <View
          style={{
            marginTop: Sizes.fixPadding + 5.0,
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Bounce size={50} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            Please Wait..
          </Text>
        </View>
      </Dialog.Container>
    );
  }

  submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.verifyOtp()}
        style={styles.submitButtonStyle}>
        <Text style={{...Fonts.whiteColor16Medium}}>Submit</Text>
      </TouchableOpacity>
    );
  }

  resendInfo() {
    return (
      <View style={styles.resendInfoWrapStyle}>
        <Text style={{...Fonts.grayColor15Medium}}>
          Didn’t receive OTP Code!
        </Text>
        <Text
          style={{
            ...Fonts.blackColor16Medium,
            marginLeft: Sizes.fixPadding - 5.0,
          }}>
          Resend
        </Text>
      </View>
    );
  }

  otpFields() {
    return (
      <View style={styles.otpFieldsContentStyle}>
        <View style={styles.textFieldContentStyle}>
          <TextInput
            value={this.state.firstDigit}
            selectionColor={Colors.primaryColor}
            style={{...Fonts.blackColor17Medium, paddingLeft: Sizes.fixPadding}}
            onChangeText={text => {
              this.setState({firstDigit: text});
              this.secondTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            value={this.state.secondDigit}
            selectionColor={Colors.primaryColor}
            style={{...Fonts.blackColor17Medium, paddingLeft: Sizes.fixPadding}}
            ref={input => {
              this.secondTextInput = input;
            }}
            keyboardType="numeric"
            onChangeText={text => {
              this.setState({secondDigit: text});
              this.thirdTextInput.focus();
            }}
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            style={{...Fonts.blackColor17Medium, paddingLeft: Sizes.fixPadding}}
            keyboardType="numeric"
            value={this.state.thirdDigit}
            ref={input => {
              this.thirdTextInput = input;
            }}
            onChangeText={text => {
              this.setState({thirdDigit: text});
              this.forthTextInput.focus();
            }}
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            style={{...Fonts.blackColor17Medium, paddingLeft: Sizes.fixPadding}}
            keyboardType="numeric"
            value={this.state.forthDigit}
            ref={input => {
              this.forthTextInput = input;
            }}
            onChangeText={text => {
              this.setState({forthDigit: text});
              this.setState({isLoading: true});
              setTimeout(() => {
                this.setState({isLoading: false});
                this.verifyOtp();
              }, 2000);
            }}
          />
        </View>
      </View>
    );
  }

  verificationInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.5,
          marginBottom: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}>
        <Text
          style={{
            paddingBottom: Sizes.fixPadding,
            ...Fonts.blackColor22Medium,
          }}>
          Verification
        </Text>
        <Text
          style={{
            ...Fonts.grayColor15Medium,
            lineHeight: 22.0,
          }}>
          Enter the OTP code from the phone we just sent you.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  otpFieldsContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  textFieldContentStyle: {
    height: 55.0,
    width: 55.0,
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.0,
  },
  submitButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 3.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 80,
    paddingBottom: Sizes.fixPadding * 3.0,
  },
  resendInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
});

VerificationScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default VerificationScreen;
