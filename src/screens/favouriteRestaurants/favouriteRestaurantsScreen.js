import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Snackbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helpers/Constant';
import axios from 'axios';
import { useEffect } from 'react';

const {width} = Dimensions.get('screen');

const restaurantsList = [
  {
    key: '1',
    image: require('../../../assets/images/restaurant/restaurant_5.png'),
    name: 'Bar 61 Restaurant',
    address: '76A England',
    rating: 4.5,
    distance: 0.5,
    isFavourite: false,
  },
  {
    key: '2',
    image: require('../../../assets/images/restaurant/restaurant_4.png'),
    name: 'Core by Clare Smyth',
    address: '220 Opera Street',
    rating: 4.2,
    distance: 1.8,
    isFavourite: false,
  },
  {
    key: '3',
    image: require('../../../assets/images/restaurant/restaurant_3.png'),
    name: 'Amrutha Lounge',
    address: '90B Silicon Velley',
    rating: 5.0,
    distance: 0.7,
    isFavourite: false,
  },
];

const rowSwipeAnimatedValues = {};

Array(restaurantsList.length + 1)
  .fill('')
  .forEach((_, i) => {
    rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
  });

const FavouriteRestaurants = ({props}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);

  const [listData, setListData] = useState(restaurantsList);
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setShowSnackBar(true);
    setListData(newData);
  };

  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  const favouriteTabHandler = async () => {

    const user = await AsyncStorage.getItem('userDetail');
    let userDetail = JSON.parse(user);
    console.log(`Bearer ${userDetail?.access_token}`);

    return axios
      .get(Constants.baseUrl + "customer/favourite-tab", {
        headers: {
        //   Authorization: `Bearer ${userDetail?.access_token || ''}`,
        Authorization:  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5N2FmZjU1OC0xYmFlLTRmNDEtYWMwMi1lNTMwNDlhOTQ0MjIiLCJqdGkiOiJkNzQ2MjlkNTUwYTgyZDI5MWFiNzE4NDg1ZDdhZDRhNzBlMmNkNTE0YTQyZjE5ZTk5Nzc3YmE3YmUyMmY1YjY3YTA5Y2IwZmQwNGYwMjdkNCIsImlhdCI6MTY2NzgyNjUxOS4zMzI3NzIsIm5iZiI6MTY2NzgyNjUxOS4zMzI3NzYsImV4cCI6MTY5OTM2MjUxOS4zMjc4NjYsInN1YiI6IjM3Iiwic2NvcGVzIjpbXX0.Y3jNF3F0zJJZGOit_8miPm_-pQfO067w_PGhmhYCa8zQKze8yqqfIEbcabY79wQANV5VtzvxXtXCX7GtNnMJCE0H-JHTsTijjxXI53dHpvRgSrak4DKh-QX2b6meQuljztOynpSCC940EWIGPjGL8M245vgD7_S-AB5Knn2S9czCXgC17Qpb6KLixVN9WLFUl09UoFsGlWakeXnIStrrfM31ycGKWhITwA1CNZKTTP-DpYu0vBS-GK7SMfpvhN_VPlvswlJKr1pK-9hp7XDxeQZPo14-azCYY_C74E16BCZYbuwQs_eb0Uf4d_YAEL8HmOfr69qMGgtaNi4J96gpIpeMsW5W_iaIU5F7anI_RbNexE7K0dG9ooA60O0aw0ywC3LQGGV0aDCDaWIZ38j11y8UoIHerAqwXXLCQ3gcmxW2fArybHMAriiLn9HQuDpPyvdlCq4w83bJgRF6VqaG4Zk4JlAVOOaQmS5hkajd163X_eukAXKlh07tSatDUUv85T6E7xQaGSdmxkSyMNrSnx83L3uMb89tHMRd7dBOr-pSnJxpObjLVJ4ZXitFwN8qPbt8sxT6k9GOKC1lzH4r57Dc-IULYeZHgK8XfOQ5RdV8mMj1NMYyJFqQaJAhlM_zjafQbkpH558vTmpqGexVjt_ndNXlZkwI-6Z_0jHkvf0',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log('response', res.data);
        setFavouriteRestaurants(res?.data?.data?.FavouriteRestaurant);
      })
      .catch(err => {
        console.log('err', err.response.data);
      });
  };

  useEffect(()=>{
    favouriteTabHandler();
  }, [])

  const renderItem = data => (
    <TouchableHighlight
      style={{backgroundColor: Colors.bodyBackColor}}
      activeOpacity={0.9}>
      <View style={styles.restaurantWrapStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={{uri: data?.item?.favourite_restaurant?.image}} style={styles.restaurantImageStyle} />
          <View
            style={{
              width: width / 2.0,
              marginLeft: Sizes.fixPadding,
              height: 100.0,
              justifyContent: 'space-evenly',
            }}>
            <Text numberOfLines={1} style={{...Fonts.blackColor16Medium}}>
              {data?.item?.favourite_restaurant?.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={Colors.grayColor}
              />
              <Text numberOfLines={1} style={{...Fonts.grayColor14Medium}}>
              {data?.item?.favourite_restaurant?.address}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 8.0,
                  ...Fonts.grayColor14Medium,
                }}>
                  {data?.item?.favourite_restaurant?.rating}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            marginRight: Sizes.fixPadding + 10.0,
            alignSelf: 'flex-end',
            ...Fonts.grayColor14Medium,
          }}>
         10 km
        </Text>
      </View>
    </TouchableHighlight>
  );

  // const renderHiddenItem = (data, rowMap) => (
  //   <View style={{alignItems: 'center', flex: 1}}>
  //     <TouchableOpacity
  //       style={styles.backDeleteContinerStyle}
  //       onPress={() => deleteRow(rowMap, data.item.key)}>
  //       <Animated.View
  //         style={[
  //           {
  //             transform: [
  //               {
  //                 scale: rowSwipeAnimatedValues[data.item.key].interpolate({
  //                   inputRange: [45, 90],
  //                   outputRange: [0, 1],
  //                   extrapolate: 'clamp',
  //                 }),
  //               },
  //             ],
  //           },
  //         ]}>
  //         <MaterialIcons
  //           name="delete"
  //           size={24}
  //           color={Colors.whiteColor}
  //           style={{alignSelf: 'center'}}
  //         />
  //         <Text style={{...Fonts.whiteColor14Regular}}>Delete</Text>
  //       </Animated.View>
  //     </TouchableOpacity>
  //   </View>
  // );

  return (
    <View style={{flex: 1}}>
      {favouriteRestaurants?.length == 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <MaterialIcons
            name="bookmark-outline"
            size={60}
            color={Colors.grayColor}
          />
          <Text
            style={{
              ...Fonts.grayColor17Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            No Item in Favourite Restaurants
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <SwipeListView
            data={favouriteRestaurants}
            renderItem={renderItem}
            rightOpenValue={-110}
            onSwipeValueChange={onSwipeValueChange}
            contentContainerStyle={{
              paddingTop: Sizes.fixPadding * 2.0,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <Snackbar
        style={styles.snackBarStyle}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}>
        Item Removed
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  restaurantWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding,
  },
  restaurantImageStyle: {
    width: 90.0,
    height: 100.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  snackBarStyle: {
    position: 'absolute',
    bottom: 58.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: '#333333',
    elevation: 0.0,
  },
  backDeleteContinerStyle: {
    alignItems: 'center',
    bottom: 10.0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    backgroundColor: Colors.redColor,
    right: 0,
  },
});

export default FavouriteRestaurants;
