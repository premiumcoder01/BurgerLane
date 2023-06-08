import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Post } from "../../helpers/Service";
import { useEffect } from "react";
import { useState } from "react";
import Constants from "../../helpers/Constant";


const HistoryOrders = ({ props }) => {

    const [historyList, setHistoryList] = useState([]);

    const onGoingOrders = async() => {
        Post(Constants.onGoingOrders).then(
          async res => {
            if (res.status === 200) {
              console.log("responstes" + JSON.stringify(res?.data?.orders));
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
                historyList.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => props.navigation.push('OrderInformation')}
                            style={styles.orderWrapStyle}
                        >
                            <Image
                                source={{uri: item?.restaurant?.image}}
                                style={styles.restaurantImageStyle}
                            />
                            <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding + 10.0, justifyContent: 'space-between' }}>
                                <Text style={{ ...Fonts.blackColor16Medium }}>
                                    {item.outlet_name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
                                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor14Medium }}>
                                            {item.order_item?.quantity} Item
                                        </Text>
                                    </View>
                                    <Text style={{ ...Fonts.grayColor14Medium }}>
                                        {item.order_date}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </ScrollView >
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

export default HistoryOrders;