import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import Constants from "../../helpers/Constant";
import { GetApi, Post, PostGet } from "../../helpers/Service";


const OngoingOrders = ({ props }) => {

    const [onGoingOrdersList, setOnGoingOrdersList] = useState([]);
    const [historyList, setHistoryList] = useState([]);

    const onGoingOrders = async() => {
        Post(Constants.onGoingOrders).then(
          async res => {
            if (res.status === 200) {
              console.log("response" + JSON.stringify(res?.data?.orders));
              setOnGoingOrdersList(res?.data?.orders?.ongoing);
              setHistoryList(res?.data?.orders?.history);

            } else {
              // Toaster(res?.message)
              console.log("message" + JSON.stringify(res))
            }
          },
          err => {
            console.log(err.response.data);
          },
        );
      };

      useEffect(()=>{
        onGoingOrders();
      },[])

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: Sizes.fixPadding,
                paddingBottom: Sizes.fixPadding * 7.0,
            }}
        >
            {
                onGoingOrdersList.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => props.navigation.push('TrackOrder')}
                            style={styles.orderWrapStyle}>
                            <Image
                                source={{uri: item?.restaurant?.image}}
                                style={styles.restaurantImageStyle}
                            />
                            <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding + 2.0, justifyContent: 'space-between' }}>
                                <Text style={{ ...Fonts.blackColor16Medium }}>
                                    {item?.outlet_name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.orderIdIndicatorStyle}>
                                    </View>
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                                        {item?.order_id}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ ...Fonts.grayColor14Medium }}>
                                        {item?.order_item?.quantity} Items
                                    </Text>
                                    <Text style={
                                        item.isWaiting
                                            ?
                                            { ...Fonts.blueColor15Regular }
                                            :
                                            { ...Fonts.primaryColor15Regular }
                                    }>
                                        {
                                            item?.order_status?.name
                                        }
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </ScrollView>
    )
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
    }
})

export default OngoingOrders;