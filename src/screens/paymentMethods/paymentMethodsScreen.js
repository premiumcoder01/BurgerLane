import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, View, StatusBar, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import { TransitionPresets } from "react-navigation-stack";
import { BottomSheet } from "react-native-elements";

const paymentMethodsList = [
    {
        id: '1',
        image: require('../../../assets/images/payment/visa.png'),
        number: ' **** **** *157',
        expireYear: '2020'
    },
    {
        id: '2',
        image: require('../../../assets/images/payment/master_card.png'),
        number: ' **** **** *987',
        expireYear: '2022'
    }
];

const cardTypesList = [
    {
        id: '1',
        image: require('../../../assets/images/payment/visa.png'),
        type: 'Visa Card',
    },
    {
        id: '2',
        image: require('../../../assets/images/payment/master_card.png'),
        type: 'Master Card',
    }
];

class PatymentMethodsScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        paymentMethodsData: paymentMethodsList,
        showCardTypesSheet: false,
        defaultCardType: cardTypesList[0].type,
        defaultCardImage: cardTypesList[0].image,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <StatusBar backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1, }}>
                    {this.header()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {this.paymentMethods()}
                        {this.addNewPaymentMethodInfo()}
                        {this.cardNumberTextField()}
                        {this.validThruAndCVVInfo()}
                        {this.completeButton()}
                    </ScrollView>
                </View>
                {this.chooseCardTypeSheet()}
            </SafeAreaView>
        )
    }

    chooseCardTypeSheet() {
        return (
            <BottomSheet
                isVisible={this.state.showCardTypesSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showCardTypesSheet: false })}
                    style={{ backgroundColor: 'white', paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding + 5.0 }}
                >
                    <Text style={{ marginBottom: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                        Choose Card Type
                    </Text>
                    {this.cardTypes()}
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    cardTypes() {
        return (
            <>
                {
                    cardTypesList.map((item) => (
                        <View key={`${item.id}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => this.setState({ defaultCardImage: item.image, defaultCardType: item.type, showCardTypesSheet: false })}
                                style={styles.cardTypesWrapStyle}
                            >
                                <Image
                                    source={item.image}
                                    style={{ width: 40.0, height: 40.0, }}
                                    resizeMode="contain"
                                />
                                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                                    {item.type}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </>
        )
    }

    completeButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.pop()}
                style={styles.completeButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Complete
                </Text>
            </TouchableOpacity>
        )
    }

    validThruAndCVVInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Sizes.fixPadding + 5.0
            }}>
                <TextInput
                    placeholder="Valid Thru"
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                    style={{
                        flex: 1,
                        ...styles.textFieldStyle,
                    }}
                />
                <TextInput
                    placeholder="CVV"
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                    style={{
                        flex: 1,
                        ...styles.textFieldStyle,
                    }}
                />
            </View>
        )
    }

    cardNumberTextField() {
        return (
            <TextInput
                keyboardType="numeric"
                placeholder="Card Number"
                placeholderTextColor={Colors.grayColor}
                selectionColor={Colors.primaryColor}
                style={styles.textFieldStyle}
            />
        )
    }

    addNewPaymentMethodInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Add New Payment Method
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showCardTypesSheet: true })}
                    style={styles.addNewPaymentMethodWrapStyle}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={this.state.defaultCardImage}
                            style={{ height: 50.0, width: 50.0, }}
                            resizeMode="contain"
                        />
                        <View style={{ marginLeft: Sizes.fixPadding }}>
                            <Text style={{ ...Fonts.blackColor17Medium }}>
                                {this.state.defaultCardType}
                            </Text>
                        </View>
                    </View>
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={18}
                        color={Colors.grayColor}
                        style={{ marginRight: Sizes.fixPadding }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    paymentMethods() {
        return (
            <View>
                {this.state.paymentMethodsData.map((item) => (
                    <View key={`${item.id}`}>
                        <View style={styles.paymentMethodWrapStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={item.image}
                                    style={{ height: 50.0, width: 50.0, }}
                                    resizeMode="contain"
                                />
                                <View style={{ marginLeft: Sizes.fixPadding }}>
                                    <Text style={{ ...Fonts.blackColor17Medium }}>
                                        {item.number}
                                    </Text>
                                    <Text style={{ ...Fonts.grayColor16Medium }}>
                                        {item.expireYear}
                                    </Text>
                                </View>
                            </View>
                            <MaterialIcons
                                name="close"
                                size={18}
                                color={Colors.grayColor}
                                style={{ marginRight: Sizes.fixPadding }}
                                onPress={() => this.removePaymentMethod({ id: item.id })}
                            />
                        </View>
                    </View>
                ))
                }
            </View>
        )
    }

    removePaymentMethod({ id }) {
        let filterArray = this.state.paymentMethodsData.filter((val, i) => {
            if (val.id !== id) {
                return val;
            }
        })
        this.setState({ paymentMethodsData: filterArray })
    }

    header() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, marginVertical: Sizes.fixPadding + 5.0 }}>
                <MaterialIcons name="arrow-back" size={24} color="black"
                    onPress={() => this.props.navigation.pop()}
                />
                <Text style={{ marginBottom: Sizes.fixPadding, marginTop: Sizes.fixPadding + 5.0, ...Fonts.blackColor22Medium }}>
                    Payment Methods
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    paymentMethodWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    completeButtonStyle: {
        marginVertical: Sizes.fixPadding + 10.0,
        backgroundColor: Colors.primaryColor,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
    },
    textFieldStyle: {
        ...Fonts.blackColor16Medium,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 1.0,
        borderRadius: Sizes.fixPadding - 5.0
    },
    addNewPaymentMethodWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
        marginTop: Sizes.fixPadding * 2.0,
    },
    cardTypesWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 8.0,
    }
})

// PatymentMethodsScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default PatymentMethodsScreen;