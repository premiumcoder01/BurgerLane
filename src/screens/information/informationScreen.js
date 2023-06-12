import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Colors, Sizes, Fonts} from '../../constants/styles';
import HTMLView from 'react-native-htmlview';
import MapView, {Marker} from 'react-native-maps';

const {width} = Dimensions.get('screen');

const Information = restaurantDetails => {
  const [data, setData] = useState([]);



  return (
    <ScrollView style={styles.pageStyle}>
      {restaurantDetails == undefined ? (
        <View>
          <Text>No Restaurant Available</Text>
        </View>
      ) : (
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

            {/* <HTMLView
              textComponentProps={{style: {color: 'black'}}}
              value={
                restaurantDetails.restaurantDetails.description
              }></HTMLView> */}
          </View>
          <View style={{padding: 30, borderRadius: 50}}>
            {restaurantDetails && (
              <MapView
                style={styles.mapStyle}
                showsCompass
                showsMyLocationButton
                showsScale
                zoomTapEnabled
                zoomEnabled
                zoomControlEnabled
                initialRegion={{
                  latitude: 28.627981,
                  longitude: 77.3648567,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  draggable
                  coordinate={{
                    latitude: 28.627981,
                    longitude: 77.3648567,
                  }}
                  // onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
                  title={restaurantDetails.restaurantDetails.name}
                  // description={restaurantDetails.restaurantDetails.description}
                />
              </MapView>
            )}
          </View>
        </View>
      )}
    </ScrollView>
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

export default Information;
