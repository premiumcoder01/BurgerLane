import React, { useState } from "react";
import { View, Text, Image, Animated, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "../../helpers/Constant";
import { useEffect } from "react";

const { width } = Dimensions.get('screen');

const favouriteFoodList = [
    {
        key: '1',
        image: require('../../../assets/images/products/orange_juice.png'),
        name: 'Orange Juice',
        deliveredFrom: 'Bar 61 Restaurant',
        rating: 4.5,
        amount: 12.5,
    },
    {
        key: '2',
        image: require('../../../assets/images/products/products_4.png'),
        name: 'Delicious Pizza',
        deliveredFrom: 'Core by Clare Smyth',
        rating: 4.2,
        amount: 15.9,
    },
    {
        key: '3',
        image: require('../../../assets/images/products/products_10.png'),
        name: 'Choco Lava Cake',
        deliveredFrom: 'Amrutha Lounge',
        rating: 5.0,
        amount: 8.7,
    },
];

const rowSwipeAnimatedValues = {};

Array(favouriteFoodList.length + 1)
    .fill('')
    .forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });

const FavouriteFoods = ({ }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState(favouriteFoodList);
    const [favouriteFoods, setFavouriteFoods] = useState([]);

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
        const { key, value } = swipeData;
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
            setFavouriteFoods(res?.data?.data?.FavouriteFood);
          })
          .catch(err => {
            console.log('err', err.response.data);
          });
      };

      useEffect(()=>{
        favouriteTabHandler()
      }, [])

      console.log("yoos" + JSON.stringify(favouriteFoods))

    const renderItem = data => (
        <TouchableHighlight
            style={{ backgroundColor: Colors.bodyBackColor }}
            activeOpacity={0.9}
        >
            <View style={styles.orderWrapStyle}>
                <Image
                    source={data.item.image}
                    style={styles.restaurantImageStyle}
                />
                <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding, justifyContent: 'space-between' }}>
                    <Text numberOfLines={1} style={{ maxWidth: width / 1.8, ...Fonts.blackColor16Medium }}>
                        {data.item.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons
                            name="home"
                            color={Colors.grayColor}
                            size={20}
                        />
                        <Text numberOfLines={1} style={{ maxWidth: width / 1.8, marginLeft: Sizes.fixPadding - 8.0, ...Fonts.grayColor14Medium }}>
                            {data.item.deliveredFrom}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="star"
                                color={Colors.ratingColor}
                                size={20}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 8.0, ...Fonts.grayColor14Medium }}>
                                {data.item.rating.toFixed(1)}
                            </Text>
                        </View>
                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                            ${data.item.amount.toFixed(1)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={{ alignItems: 'center', flex: 1, }}>
            <TouchableOpacity
                style={styles.backDeleteContinerStyle}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    scale: rowSwipeAnimatedValues[
                                        data.item.key
                                    ].interpolate({
                                        inputRange: [45, 90],
                                        outputRange: [0, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <MaterialIcons
                        name="delete"
                        size={24}
                        color={Colors.whiteColor}
                        style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ ...Fonts.whiteColor14Regular }}>
                        Delete
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {
                favouriteFoods.length == 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="bookmark-outline" size={60} color={Colors.grayColor} />
                        <Text style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding * 2.0 }}>
                            No Item in Favourite Foods
                        </Text>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <SwipeListView
                            data={favouriteFoods}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-110}
                            onSwipeValueChange={onSwipeValueChange}
                            contentContainerStyle={{
                                paddingTop: Sizes.fixPadding * 2.0,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
            }
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                Item Removed
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    orderWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 100.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    },
    orderIdIndicatorStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 11.0,
        height: 11.0,
        borderRadius: 5.5,
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
})

export default FavouriteFoods;