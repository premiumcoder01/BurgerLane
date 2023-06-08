import React, { Component } from "react";
import { SafeAreaView, View, BackHandler, StatusBar, StyleSheet, FlatList, Dimensions, Text } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import { TransitionPresets } from "react-navigation-stack";

const { width } = Dimensions.get('screen');

const addressesList = [
    {
        id: '1',
        addressOff: 'Home',
        address: '76A, Eight Avenue, Andora Mercy, New York City, US.',
        name: 'Fannie Jackson',
        phoneNumber: '123456789',
    },
    {
        id: '2',
        addressOff: 'My Work',
        address: '76A, Eight Avenue, Andora Mercy, New York City, US.',
        name: 'Fannie Jackson',
        phoneNumber: '123456789',
    }
];

class AddressScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop()
        return true;
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <StatusBar backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    {this.addresses()}
                    {this.addNewAddressBotton()}
                </View>
            </SafeAreaView>
        )
    }

    addNewAddressBotton() {
        return (
            <View style={styles.addNewAddressButtonStyle}>
                <Text style={{ ...Fonts.grayColor17Medium }}>
                    Add new Address
                </Text>
            </View>
        )
    }

    addresses() {
        const renderItem = ({ item }) => (
            <View style={styles.addressWrapStyle}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <View>
                        <Text style={{ ...Fonts.blackColor19Medium }}>
                            {item.addressOff}
                        </Text>
                        <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                size={24}
                                color={Colors.grayColor}
                            />
                            <Text style={{ maxWidth: width / 1.4, marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                                {item.address}
                            </Text>
                        </View>
                        <View style={{ marginVertical: Sizes.fixPadding - 4.0, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="person"
                                size={24}
                                color={Colors.grayColor}
                            />
                            <Text style={{ maxWidth: width / 1.4, marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="phone"
                                size={24}
                                color={Colors.grayColor}
                            />
                            <Text style={{ maxWidth: width / 1.4, marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                                {item.phoneNumber}
                            </Text>
                        </View>
                    </View>
                    <MaterialIcons
                        name="keyboard-arrow-right"
                        size={26}
                        color={Colors.grayColor}
                    />
                </View>
            </View>
        )
        return (
            <View>
                <FlatList
                    data={addressesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    header() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, marginVertical: Sizes.fixPadding + 5.0 }}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => this.props.navigation.pop()}
                />
                <Text style={{ marginBottom: Sizes.fixPadding, marginTop: Sizes.fixPadding + 5.0, ...Fonts.blackColor22Medium }}>
                    Address
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addressWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 4.0,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 8.0,
    },
    addNewAddressButtonStyle: {
        borderRadius: Sizes.fixPadding,
        borderStyle: "dashed",
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 10.0,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

// AddressScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default AddressScreen;