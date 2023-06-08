import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import { Post } from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';

const { width } = Dimensions.get('screen');

class ProfileScreen extends Component {
  state = {
    logoutDialog: false,
    loading: false,
    userDetail: {},
  };

  componentDidMount() {
    this.editProfileHandler();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.editProfileHandler();
      },
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <Spinner color={'#fff'} visible={this.state.loading} />
        <View style={{ flex: 1 }}>
          {this.header()}
          {this.userInfo()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Sizes.fixPadding * 7.0,
              backgroundColor: Colors.bodyBackColor,
            }}>
            {this.paymentAddressAndVoucherSetting()}
            {this.settingsInfo()}
            {this.logOutInfo()}
          </ScrollView>
        </View>
        {this.logoutDialog()}
      </SafeAreaView>
    );
  }

  paymentAddressAndVoucherSetting() {
    return (
      <View style={styles.paymentAddressAndVoucherSettingWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.navigation.push('PaymentMethods')}>
          {this.settings({
            icon: (
              <MaterialIcons
                name="credit-card"
                size={24}
                color={Colors.grayColor}
              />
            ),
            setting: 'Payment Methods',
          })}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.navigation.push('Address')}>
          {this.settings({
            icon: (
              <MaterialIcons
                name="location-on"
                size={24}
                color={Colors.grayColor}
              />
            ),
            setting: 'Address',
          })}
        </TouchableOpacity>
        {this.settings({
          icon: (
            <MaterialIcons
              name="local-attraction"
              size={24}
              color={Colors.grayColor}
            />
          ),
          setting: 'My Vouchers',
        })}
      </View>
    );
  }

  logoutDialog() {
    return (
      <Dialog.Container
        visible={this.state.logoutDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding - 5.0,
            }}>
            You sure want to logout?
          </Text>
          <View style={styles.cancelAndLogoutButtonWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ logoutDialog: false })}
              style={styles.cancelButtonStyle}>
              <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={async () => {
                this.setState({ logoutDialog: false });
                this.props.navigation.push('Login');
                await AsyncStorage.removeItem('userDetail');
              }}
              style={styles.logOutButtonStyle}>
              <Text style={{ ...Fonts.whiteColor16Medium }}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  logOutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.setState({ logoutDialog: true })}
        style={styles.logOutInfoWrapStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="logout" size={24} color={Colors.grayColor} />
          {/* <MaterialCommunityIcons name="login-variant" size={24} color={Colors.grayColor} /> */}
          <Text
            style={{
              ...Fonts.blackColor15Medium,
              marginLeft: Sizes.fixPadding,
              width: width / 1.8,
            }}>
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15}
          color={Colors.grayColor}
        />
      </TouchableOpacity>
    );
  }

  settingsInfo() {
    return (
      <View style={styles.settingInfoWrapStyle}>
        <TouchableOpacity activeOpacity={0.9}>
          {this.settings({
            icon: (
              <MaterialIcons
                name="notifications"
                size={24}
                color={Colors.grayColor}
              />
            ),
            setting: 'Notifications',
          })}
        </TouchableOpacity>
        {this.settings({
          icon: (
            <MaterialIcons name="language" size={24} color={Colors.grayColor} />
          ),
          setting: 'Language',
        })}
        {this.settings({
          icon: (
            <MaterialIcons name="settings" size={24} color={Colors.grayColor} />
          ),
          setting: 'Settings',
        })}
        {this.settings({
          icon: (
            <MaterialIcons
              name="group-add"
              size={26}
              color={Colors.grayColor}
            />
          ),
          setting: 'Invite Friends',
        })}
        {this.settings({
          icon: (
            <MaterialIcons
              name="headset-mic"
              size={22}
              color={Colors.grayColor}
            />
          ),
          setting: 'Support',
        })}
      </View>
    );
  }

  settings({ icon, setting }) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}>
        <View style={styles.settingStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon}
            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginLeft: Sizes.fixPadding,
                width: width / 1.8,
              }}>
              {setting}
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={15}
            color={Colors.grayColor}
          />
        </View>
      </TouchableOpacity>
    );
  }

  editProfileHandler = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    let userDetail = JSON.parse(user);
    this.setState({ loading: true });
    const formData1 = new FormData();

    formData1.append('user_id', userDetail?.user?.id);

    Post(Constants.getUserProfile, formData1).then(
      async res => {
        if (res.status === 200) {
          this.setState({ userDetail: res.data });
        }
        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };

  userInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          this.props.navigation.push('EditProfile', {
            item: this.state.userDetail,
          })
        }
        style={styles.userInfoWrapStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: this.state.userDetail?.profile_image }}
            style={{
              width: 70.0,
              height: 70.0,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
            resizeMode="cover"
          />
          <View style={styles.userInfoStyle}>
            <Text
              style={{
                ...Fonts.blackColor17Medium,
                width: width / 2.3,
              }}>
              {this.state.userDetail?.name}
            </Text>
            <Text style={{ ...Fonts.grayColor16Medium }}>
              {this.state.userDetail?.phone}
            </Text>
          </View>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15}
          color={Colors.grayColor}
        />
      </TouchableOpacity>
    );
  }

  header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor22Medium,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}>
        Profile
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  userInfoWrapStyle: {
    flexDirection: 'row',
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizes.fixPadding * 2.0,
  },
  userInfoStyle: {
    height: 80.0,
    justifyContent: 'space-between',
    paddingVertical: Sizes.fixPadding + 4.0,
    marginLeft: Sizes.fixPadding,
  },
  logOutInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 7.0,
    flexDirection: 'row',
    marginVertical: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#F1F1F1',
    borderWidth: 2.0,
  },
  settingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderColor: '#F1F1F1',
    borderWidth: 2.0,
  },
  settingStyle: {
    flexDirection: 'row',
    marginVertical: Sizes.fixPadding - 1.0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 90,
    paddingHorizontal: Sizes.fixPadding * 3.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: '#E0E0E0',
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 5.0,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Sizes.fixPadding + 5.0,
  },
  paymentAddressAndVoucherSettingWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderColor: '#F1F1F1',
    borderWidth: 2.0,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding * 2.0,
  },
});

// export default ProfileScreen;
export default ProfileScreen;
