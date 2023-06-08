import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, View, StatusBar, Dimensions, TouchableOpacity, ScrollView, StyleSheet, Image, Text } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TextInput, Snackbar } from 'react-native-paper';

const { width } = Dimensions.get('screen');

class RatingScreen extends Component {

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
        rate1: true,
        rate2: false,
        rate3: false,
        rate4: false,
        rate5: false,
        review: '',
        isFavourite: false,
        showSnackBar: false,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <StatusBar backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
                    >
                        {this.restaurantInfo()}
                    </ScrollView>
                    {this.completeButton()}
                </View>
                <Snackbar
                    onDismiss={() => this.setState({ showSnackBar: false })}
                    visible={this.state.showSnackBar}
                    style={styles.snackBarStyle}
                >
                    {
                        this.state.isFavourite
                            ?
                            `Added to Favourite`
                            :
                            `Remove from Favourite`
                    }
                </Snackbar>
            </SafeAreaView>
        )
    }

    restaurantInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.grayColor16Medium }}>
                    Restaurant
                </Text>
                <View style={{
                    backgroundColor: Colors.whiteColor,
                    borderRadius: Sizes.fixPadding - 5.0,
                    padding: Sizes.fixPadding,
                }}>
                    {this.restaurantDetail()}
                    {this.divider()}
                    {this.ratingInfo()}
                    {this.reviewTextField()}
                </View>
            </View>
        )
    }

    completeButton() {
        return (
            <View style={styles.completeButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.props.navigation.pop()}
                    style={styles.completeButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>
                        Complete
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    reviewTextField() {
        return (
            <TextInput
                placeholder="Enter Note Here"
                placeholderTextColor='gray'
                multiline={true}
                numberOfLines={4}
                mode="outlined"
                onChangeText={text => this.setState({ review: text })}
                style={{
                    ...Fonts.blackColor16Medium,
                    backgroundColor: Colors.bodyBackColor,
                    marginTop: Sizes.fixPadding * 2.0,
                }}
                selectionColor={Colors.primaryColor}
                theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
            />
        )
    }

    ratingInfo() {
        return (
            <View>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor19Medium }}>
                    {`What do you think about\nthis restaurant?`}
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    {`Your feedback will help us improve\nrestaurant experience better.`}
                </Text>
                {this.rating()}
            </View>
        )
    }

    rating() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Sizes.fixPadding * 2.0,
            }}>
                <MaterialIcons
                    name="star"
                    size={33}
                    color={this.state.rate1 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (this.state.rate1) {
                            this.setState({
                                rate2: false,
                                rate3: false,
                                rate4: false,
                                rate5: false,
                            })
                        }
                        else {
                            this.setState({ rate1: true })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={this.state.rate2 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (this.state.rate2) {
                            this.setState({
                                rate1: true,
                                rate3: false,
                                rate4: false,
                                rate5: false,
                            })
                        }
                        else {
                            this.setState({
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={this.state.rate3 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (this.state.rate3) {
                            this.setState({
                                rate4: false,
                                rate5: false,
                                rate2: true,
                            })
                        }
                        else {
                            this.setState({
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={this.state.rate4 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (this.state.rate4) {
                            this.setState({
                                rate5: false,
                                rate3: true,
                            })
                        }
                        else {
                            this.setState({
                                rate4: true,
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={this.state.rate5 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (this.state.rate5) {
                            this.setState({
                                rate4: true,
                            })
                        }
                        else {
                            this.setState({
                                rate5: true,
                                rate4: true,
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
            </View>
        )
    }

    divider() {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 10.0, marginBottom: Sizes.fixPadding + 5.0, backgroundColor: Colors.grayColor, height: 0.50 }} />
        )
    }

    restaurantDetail() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../../assets/images/restaurant/restaurant_5.png')}
                        style={{ width: 90.0, height: 90.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={styles.restaurantInfoStyle}>
                        <Text numberOfLines={1} style={{
                            width: width / 2.0,

                            ...Fonts.blackColor16Medium
                        }}>
                            Kichi Coffee & Drink
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                color={Colors.grayColor}
                                size={18}
                            />
                            <Text numberOfLines={1} style={{ width: width / 2.1, marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                                76A England
                            </Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons
                    name={this.state.isFavourite ? "bookmark" : "bookmark-outline"}
                    color={Colors.grayColor}
                    size={22}
                    style={{ alignSelf: 'flex-start' }}
                    onPress={() => this.setState({ isFavourite: !this.state.isFavourite, showSnackBar: true })}
                />
            </View>
        )
    }

    header() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: Sizes.fixPadding * 2.0
            }}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    onPress={() => this.props.navigation.pop()}
                    style={{ marginVertical: Sizes.fixPadding + 5.0 }}
                />
                <Text style={{ ...Fonts.blackColor22Medium, marginBottom: Sizes.fixPadding + 2.0 }}>
                    Rating
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    restaurantInfoStyle: {
        paddingVertical: Sizes.fixPadding + 8.0,
        height: 90.0,
        marginLeft: Sizes.fixPadding,
        justifyContent: 'space-between'
    },
    completeButtonWrapStyle: {
        backgroundColor: Colors.whiteColor,
        padding: Sizes.fixPadding,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
    },
    completeButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    snackBarStyle: {
        backgroundColor: '#333333',
        position: 'absolute',
        bottom: 60.0,
        left: -10.0,
        right: -10.0,
        elevation: 0.0,
    }
})

RatingScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default RatingScreen;