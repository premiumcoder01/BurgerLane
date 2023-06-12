import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {Colors, Sizes, Fonts} from '../../constants/styles';
import HTMLView from 'react-native-htmlview';
import MapView, {Marker} from 'react-native-maps';

const {width} = Dimensions.get('screen');

const Information = props => {
  const [data, setData] = useState([]);

  const renderData = () => {
    setData(props?.restaurantDetails);
  };

  useEffect(() => {
    renderData();
  }, []);

  console.log(data);
  return (
    <View style={styles.pageStyle}>
      <View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 2.0,
          }}>
          <Text
            style={{
              marginBottom: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor19Medium,
            }}>
            Informations
          </Text>

          <HTMLView
            textComponentProps={{style: {color: 'black'}}}
            value={props?.restaurantDetails?.description}></HTMLView>
        </View>
        <View style={{paddingBottom: 60, padding: 30}}>
          {props && (
            <MapView
              style={styles.mapStyle}
              initialRegion={{
                latitude: 28.627981,
                longitude: 77.3648567,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              customMapStyle={mapStyle}>
              <Marker
                draggable
                coordinate={{
                  latitude: 28.627981,
                  longitude: 77.3648567,
                }}
                onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
                title={props?.restaurantDetails?.name}
                description={props?.restaurantDetails?.description}
              />
            </MapView>
          )}
        </View>
        <Image
          source={require('../../../assets/images/restaurant_location.jpg')}
          style={{
            height: 200.0,
            width: width - 30.0,
            alignSelf: 'center',
            borderColor: Colors.whiteColor,
            borderWidth: 2.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
  },
  mapStyle: {
    height: 300,
    width: 300,
  },
});

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];

export default Information;
