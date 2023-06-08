import React, {Component} from 'react';
import {SafeAreaView, View, Image, StatusBar} from 'react-native';
import {Colors} from '../constants/styles';
import {Bounce, Pulse} from 'react-native-animated-spinkit';
// import { withNavigation } from "react-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';

class SplashScreen extends Component {
  render() {
    setTimeout(async () => {
      const user = await AsyncStorage.getItem('userDetail');
      const onBoardingHandler = await AsyncStorage.getItem('onBoardingHandler');
      let userDetail = JSON.parse(user);
      const token = userDetail?.access_token;
      onBoardingHandler === 'false' && token
        ? this.props.navigation.push('BottomTabBar')
        : onBoardingHandler === 'false'
        ? this.props.navigation.navigate('Login')
        : this.props.navigation.navigate('Onboarding');
    }, 2000);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={require('../../assets/images/delivery.png')}
            style={{
              width: 200,
              height: 150,
              alignSelf: 'center',
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
          <Pulse
            size={40}
            color={Colors.primaryColor}
            style={{alignSelf: 'center'}}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default SplashScreen;
