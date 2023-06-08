import React from "react";
import { Component } from "react";
import { SafeAreaView, BackHandler, View, StatusBar, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Text, Image, TouchableOpacity } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
// import { TransitionPresets } from "react-navigation-stack";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Dialog from "react-native-dialog";
import { GetApi } from '../../helpers/Service';
import Constants from '../../helpers/Constant';

const { width } = Dimensions.get('screen');

const paymentMethods = [
    {
        id: '1',
        image: require('../../../assets/images/payment/visa.png'),
        number: '**** **** **** *316',
    },
    {
        id: '2',
        image: require('../../../assets/images/payment/master_card.png'),
        number: '**** **** **** *316',
    }
];

class ConfirmOrderScreen extends Component {
    state = {
        cartDetails: {},
        address: [],
        orderId: '',
        totalAmount: '',
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        this.orderDetails();
    }

    orderDetails = () => {
        this.setState({ loading: true });
        GetApi(
            Constants.orderDetails,
        ).then(
            async res => {
                if (res.status === 200) {
                    console.log('data--------------', res.data);
                    this.setState({
                        orderId: res?.data?.order_id,
                        cartDetails: res?.data?.cart_detail,
                        address: res?.data?.address,
                        totalAmount: res?.data?.total_amount,
                        // popularItems: res?.data?.popularItems?.data,
                        // productCategories: res?.data?.categories,
                    });
                }
                this.setState({ loading: false });
            },
            err => {
                this.setState({ loading: false });
                console.log(err.response.data);
            },
        );
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        voucherFocus: false,
        currentPaymentIndex: paymentMethods[0].id,
        showSuccessDialog: false,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <StatusBar backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {this.deliveryToInfo()}
                        {this.deliveryTimeInfo()}
                        {this.orderInfo()}
                        {this.addVoucherInfo()}
                        {this.noteInfo()}
                        {this.paymentMethod()}
                        {this.confirmButton()}
                    </ScrollView>
                    {this.successDialog()}
                </View>
            </SafeAreaView>
        )
    }

    successDialog() {
        return (
            <Dialog.Container
                visible={this.state.showSuccessDialog}
                contentStyle={styles.dialogWrapStyle}
                headerStyle={{ margin: 0.0 }}
            >
                <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                    <View style={styles.successIconWrapStyle}>
                        <MaterialIcons name="done" size={35} color={Colors.primaryColor} />
                    </View>
                    <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding + 5.0 }}>
                        Your order has been placed!
                    </Text>
                </View>
            </Dialog.Container>
        )
    }

    confirmButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    this.setState({ showSuccessDialog: true })
                    setTimeout(() => {
                        this.setState({ showSuccessDialog: false })
                        this.props.navigation.push('BottomTabBar');
                    }, 2000);
                }}
                style={styles.confirmButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Confirm
                </Text>
            </TouchableOpacity>
        )
    }

    paymentMethod() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ currentPaymentIndex: item.id })}
                style={{
                    ...styles.paymentMethodWrapStyle,
                    borderColor: this.state.currentPaymentIndex == item.id ? Colors.primaryColor : Colors.grayColor,
                }}>
                <Image
                    source={item.image}
                    style={{ width: 50.0, height: 50.0, }}
                    resizeMode="contain"
                />
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor19Medium }}>
                    {item.number}
                </Text>
                {
                    this.state.currentPaymentIndex == item.id
                        ?
                        <View style={styles.paymentMethodSelectorStyle}>
                            <MaterialIcons
                                name="done"
                                size={15}
                                color={Colors.whiteColor}
                            />
                        </View>
                        :
                        null
                }
            </TouchableOpacity>
        )
        return (
            <FlatList
                horizontal
                data={paymentMethods}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
            />
        )
    }

    noteInfo() {
        return (
            <View>
                <View style={{
                    backgroundColor: Colors.bodyBackColor,
                    padding: Sizes.fixPadding,
                    marginTop: Sizes.fixPadding - 5.0,
                }}>
                    <Text style={{ ...Fonts.grayColor16Medium }}>
                        Note
                    </Text>
                </View>
                <TextInput
                    placeholder="Enter Note Here"
                    textAlignVertical="top"
                    style={{ marginVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding + 5.0, ...Fonts.blackColor15Regular, marginHorizontal: Sizes.fixPadding, backgroundColor: Colors.bodyBackColor }}
                    multiline={true}
                    numberOfLines={5}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                />
            </View>
        )
    }

    addVoucherInfo() {
        return (
            <View>
                <View style={{
                    backgroundColor: Colors.bodyBackColor,
                    padding: Sizes.fixPadding,
                    marginTop: Sizes.fixPadding
                }}>
                    <Text style={{ ...Fonts.grayColor16Medium }}>
                        Add Voucher
                    </Text>
                </View>
                <View style={styles.addVoucherInfoWrapStyle}>
                    <View style={{ flex: 1, }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <MaterialIcons
                                name="local-attraction"
                                color={Colors.primaryColor}
                                size={24}
                            />
                            <TextInput
                                style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.primaryColor14Medium }}
                                placeholder="Add Voucher Code"
                                selectionColor={Colors.primaryColor}
                                placeholderTextColor={Colors.primaryColor}
                                onFocus={() => this.setState({ voucherFocus: true })}
                                onBlur={() => this.setState({ voucherFocus: false })}
                            />
                        </View>
                        <View style={{ backgroundColor: this.state.voucherFocus ? Colors.primaryColor : Colors.grayColor, height: 1.0, }} />
                    </View>
                    <View style={styles.applyButtonStyle}>
                        <Text style={{ ...Fonts.whiteColor14Regular }}>
                            Apply
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    orderInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding, marginTop: Sizes.fixPadding, }}>
                <View style={{ marginBottom: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center', }}>
                    <Image
                        source={{
                            uri: this.state.cartDetails?.item_detail?.image,
                        }}
                        style={{ width: 80.0, height: 80.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
                        <Text style={{ ...Fonts.blackColor16Medium }}>
                            {this.state.cartDetails?.item_detail?.name}
                        </Text>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...Fonts.grayColor14Medium }}>
                                Price : {this.state.cartDetails?.item_detail?.price}
                            </Text>
                            <Text style={{ ...Fonts.grayColor14Medium, marginLeft: width / 3 }}>
                                Qty : {this.state.cartDetails?.quantity}
                            </Text>
                        </View>

                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor16Medium, width: width / 2 }}>
                        {this.state.cartDetails?.item_detail?.name}
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium, width: width / 3 }}>
                        {this.state.cartDetails?.item_detail?.price} * {this.state.cartDetails?.quantity}
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium, width: width / 2 }}>
                        ${this.state.cartDetails?.item_detail?.price * this.state.cartDetails?.quantity}
                    </Text>
                </View>
                {/* Add On item list */}



                {this.state.cartDetails?.add_on_item.map(item => (
                    <View key={`${item.id}`} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...Fonts.blackColor16Medium, width: width / 2 }}>
                            {item?.add_on_item?.title}
                        </Text>
                        <Text style={{ ...Fonts.blackColor16Medium, width: width / 3 }}>
                            {item?.add_on_item?.price} * 1
                        </Text>
                        <Text style={{ ...Fonts.blackColor16Medium, width: width / 2 }}>
                            ${item?.add_on_item?.price}
                        </Text>
                    </View>
                ))}
                {/* End of add on list  */}
                {/* <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Ship Fee (2.4 Km)
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        $1.3
                    </Text>
                </View> */}
                <View style={{ marginVertical: Sizes.fixPadding + 2.0, backgroundColor: Colors.grayColor, height: 0.50, }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                        Total
                    </Text>
                    <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                        ${this.state.totalAmount}
                    </Text>
                </View>
            </View>
        )
    }

    deliveryTimeInfo() {
        return (
            <View style={styles.deliveryTimeWrapStyle}>
                <Text style={{ ...Fonts.grayColor16Medium }}>
                    Delivery Time
                </Text>
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor17Medium }}>
                    45 min
                </Text>
            </View>
        )
    }

    deliveryToInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding, }}>
                <View style={styles.deliveryToTitleWrapStyle}>
                    <Text style={{ ...Fonts.blackColor17Medium }}>
                        Delivery to
                    </Text>
                    <TouchableOpacity onPress={() => {
                        this.setState({ showAddressSheet: false });
                        //this.props.navigation.push('AddNewDeliveryAddress');
                        this.props.navigation.push('AddDeliveryAddress');
                    }}>
                        <Text style={{ ...Fonts.blueColor17Medium }}>
                            Add New Address
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.deliveryInfoWrapStyle}>
                    <Image
                        source={require('../../../assets/images/restaurant_location.jpg')}
                        style={{ width: 120.0, height: 120.0, }}
                    />
                    <View style={{ marginVertical: Sizes.fixPadding, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => this.props.navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor16Medium }}>
                                {this.state.address?.house_no},{this.state.address?.city}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="person"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => this.props.navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor14Regular }}>
                                {this.state.address?.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="phone"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => this.props.navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor14Regular }}>
                                {this.state.address?.phone}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    header() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginBottom: Sizes.fixPadding + 5.0 }}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    onPress={() => this.props.navigation.pop()}
                    style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                />
                <View style={styles.confirmOrderTitleWithIdWrapStyle}>
                    <Text style={{ ...Fonts.blackColor22Medium }}>
                        Confirm Order
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor17Medium }}>
                            ID:
                        </Text>
                        <Text style={{ ...Fonts.blackColor17Medium }}>
                            {this.state.orderId}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    confirmButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 150,
        backgroundColor: Colors.whiteColor,
        paddingTop: Sizes.fixPadding,
        alignItems: 'center',
        paddingBottom: Sizes.fixPadding * 4.0,
    },
    successIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.5,
        width: 70.0,
        height: 70.0,
        borderRadius: 35.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding + 5.0,
    },
    paymentMethodWrapStyle: {
        borderWidth: 1.0,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        paddingLeft: Sizes.fixPadding,
        paddingRight: Sizes.fixPadding * 4.0,
        marginRight: Sizes.fixPadding * 2.0,
    },
    paymentMethodSelectorStyle: {
        position: 'absolute',
        right: 0.0,
        top: 0.0,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Sizes.fixPadding - 2.0,
        paddingBottom: Sizes.fixPadding,
        paddingRight: Sizes.fixPadding + 2.0,
        paddingLeft: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding,
        borderBottomLeftRadius: Sizes.fixPadding + 20.0,
    },
    addVoucherInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: Sizes.fixPadding + 5.0,
    },
    applyButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        marginLeft: Sizes.fixPadding + 5.0,
    },
    deliveryTimeWrapStyle: {
        backgroundColor: Colors.bodyBackColor,
        padding: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Sizes.fixPadding - 5.0,
    },
    deliveryToTitleWrapStyle: {
        marginBottom: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deliveryInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderColor: '#E0E0E0',
        borderWidth: 1.0,
        flexDirection: 'row',
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0
    },
    confirmOrderTitleWithIdWrapStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

// ConfirmOrderScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default ConfirmOrderScreen;