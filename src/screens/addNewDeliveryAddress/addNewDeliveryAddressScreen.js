import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  BackHandler,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { TransitionPresets } from 'react-navigation-stack';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';

const LATITUDE = 28.629341719747938;
const LONGITUDE = 77.38402881349394;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = 0.1;

const defaultMarker = {
  latitude: 28.629341719747938,
  longitude: 77.38402881349394,
};

class AddNewDeliveryAddressScreen extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      poi: null,
    };

    this.onPoiClick = this.onPoiClick.bind(this);
  }

  onPoiClick(e) {
    const poi = e.nativeEvent;
    this.setState({ poi });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {/* {this.header()} */}
          {this.map()}
          {this.addressInfo()}
        </View>
      </SafeAreaView>
    );
  }

  addressInfo() {
    return (
      <View style={styles.addressInfoWrapStyle}>
        <View style={styles.sheetIndicatorStyle} />
        <Text
          style={{
            marginVertical: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding,
            ...Fonts.blackColor19Medium,
          }}>
          Type your Address
        </Text>
        <View style={styles.addressTextFieldWrapStyle}>
          <MaterialIcons
            name="location-on"
            size={24}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder="Type your address here"
            style={{
              ...Fonts.blackColor15Medium,
              flex: 1,
              marginLeft: Sizes.fixPadding,
            }}
            selectionColor={Colors.primaryColor}
            placeholderTextColor={Colors.primaryColor}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.navigation.pop()}
          style={styles.addNewAddressButtonStyle}>
          <Text style={{ ...Fonts.whiteColor16Medium }}>Add new Address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  map() {
    return (
      <MapView
        provider={this.props.provider}
        style={{ width: '100%', height: '100%' }}
        initialRegion={this.state.region}
        onPoiClick={this.onPoiClick}>
        {this.state.poi == null ? (
          <Marker coordinate={defaultMarker}>
            <Image
              source={require('../../../assets/images/custom_marker.png')}
              style={{ width: 30.0, height: 30.0 }}
            />
          </Marker>
        ) : null}
        {this.state.poi && (
          <Marker coordinate={this.state.poi.coordinate}>
            <Image
              source={require('../../../assets/images/custom_marker.png')}
              style={{ width: 30.0, height: 30.0 }}
            />
          </Marker>
        )}
      </MapView>
    );
  }

  header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Colors.blackColor}
          onPress={() => this.props.navigation.pop()}
          style={{ position: 'absolute', left: 20.0 }}
        />
        <Text
          style={{
            ...Fonts.blackColor19Medium,
            marginLeft: Sizes.fixPadding + 5.0,
          }}>
          Add New Delivery Address
        </Text>
      </View>
    );
  }
}

AddNewDeliveryAddressScreen.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  addNewAddressButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 5.0,
    margin: Sizes.fixPadding * 2.0,
  },
  addressTextFieldWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  sheetIndicatorStyle: {
    backgroundColor: '#9E9E9E',
    borderRadius: Sizes.fixPadding,
    width: 40.0,
    height: 4.0,
    alignSelf: 'center',
  },
  addressInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    position: 'absolute',
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
    paddingTop: Sizes.fixPadding,
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1.0,
  },
});

// AddNewDeliveryAddressScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default AddNewDeliveryAddressScreen;
