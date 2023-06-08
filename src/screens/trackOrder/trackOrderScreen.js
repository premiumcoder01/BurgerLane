import React, { Component, useState } from "react";
import { BackHandler, View, Dimensions, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import BottomSheet from 'reanimated-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import { withNavigation } from "react-navigation";
// import { TouchableOpacity as TouchableOpacity } from "react-native-gesture-handler";
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../constants/key";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get('screen');

class TrackOrderScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        let timer = setInterval(this.tick, 5000);
        this.setState({ timer });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        clearInterval(this.state.timer);
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        timer: null,
        counter: 20
    };

    tick = () => {
        this.state.counter <= 0
            ?
            clearInterval(this.state.timer)
            :
            this.setState({
                counter: this.state.counter - 5
            });
    }

    render() {
        return (
            <>
                {this.header()}
                <TrackOrder
                    time={this.state.counter}
                    props={this.props}
                />
            </>
        )
    }

    header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    Tracking on Map
                </Text>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={25}
                    style={{ position: 'absolute', left: 15.0, }}
                    onPress={() => this.props.navigation.pop()}
                />
            </View>
        )
    }
}

const TrackOrder = ({ time, props }) => {

    const pickupMarker = {
        latitude: 37.78825,
        longitude: -122.4324,
    };

    const deliveryMarker = {
        latitude: 37.77825,
        longitude: -122.4424,
    };

    const sheetRef = React.useRef(null);

    const [isRating, setIsRating] = useState(false);

    const [sheetOpen, setSheetOpen] = useState(false);

    const [rate1, setRate1] = useState(true);
    const [rate2, setRate2] = useState(false);
    const [rate3, setRate3] = useState(false);
    const [rate4, setRate4] = useState(false);
    const [rate5, setRate5] = useState(false);

    const [reviewType1, setReviewType1] = useState(false);
    const [reviewType2, setReviewType2] = useState(false);
    const [reviewType3, setReviewType3] = useState(false);

    const ratingContent = () => (
        <View style={styles.bottomSheetWrapStyle}>
            {backArrow()}
            <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                AWESOME!
            </Text>
            {ratingCountInfo()}
            {rating()}
            {divider()}
            {reviewType()}
            {completeButton()}
        </View>
    )

    function ratingCountInfo() {
        return (
            <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                {`You rates Devin `}
                {
                    rate1 == true && rate2 == true && rate3 == true && rate4 == true && rate5 == true
                        ?
                        `5`
                        :
                        rate1 == true && rate2 == true && rate3 == true && rate4 == true
                            ?
                            `4`
                            :
                            rate1 == true && rate2 == true && rate3 == true ?
                                `3`
                                :
                                rate1 == true && rate2 == true
                                    ?
                                    '2'
                                    :
                                    `1`
                }
                {` Stars`}
            </Text>
        )
    }

    function backArrow() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsRating(false)}
            >
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    style={{ marginTop: Sizes.fixPadding - 5.0 }}
                />
            </TouchableOpacity>
        )
    }

    function completeButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => props.navigation.pop()}
                style={styles.completeButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Complete
                </Text>
            </TouchableOpacity>
        )
    }

    function reviewType() {
        return (
            <>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType1(!reviewType1)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType1 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType1 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Enthusiastic
                    </Text>
                </View>
                <View style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType2(!reviewType2)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType2 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType2 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Fast
                    </Text>
                </View>
                <View style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType3(!reviewType3)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType3 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType3 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Friendly
                    </Text>
                </View>
            </>
        )
    }

    function rating() {
        return (
            <View style={styles.ratingWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate1) {
                            setRate2(false)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate1 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate2) {
                            setRate1(true)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate2 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate3) {
                            setRate4(false)
                            setRate5(false)
                            setRate2(true)
                        }
                        else {
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate3 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate4) {
                            setRate5(false)
                            setRate3(true)
                        }
                        else {
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate4 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate5) {
                            setRate4(true)
                        }
                        else {
                            setRate5(true)
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate5 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const trackContent = () => (
        <View style={styles.bottomSheetWrapStyle}>
            {
                sheetOpen ?
                    foodComingInfoShort()
                    :
                    foodComingInfoMore()
            }
            {orderInfo()}
            {divider()}
            {userInfo()}
            {divider()}
            {tripInfo()}
            {divider()}
            {time == 0
                ?
                reviewInfo()
                :
                null
            }
        </View>
    );

    function reviewInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding - 5.0, alignItems: 'center' }}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    HOW IS YOUR DELIVERY BOY?
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    {`Your feedback will help us improve\ndelivery experience better.`}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setIsRating(true)}
                    style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function foodComingInfoShort() {
        return (
            <View>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor15Regular }}>
                    Your food is coming in 0:{time.toString().length == 1 ? `0${time}` : time}
                </Text>
                {divider()}
            </View>
        )
    }

    function foodComingInfoMore() {
        return (
            <>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                    Your food is coming in 0:{time.toString().length == 1 ? `0${time}` : time}
                </Text>
                <View
                    style={{ marginVertical: Sizes.fixPadding - 3.0, backgroundColor: Colors.grayColor, height: 0.50 }}
                />
                <Text style={{ marginBottom: Sizes.fixPadding * 2.0, textAlign: 'center', ...Fonts.blackColor17Medium }}>
                    (Slide up to show more detail..)
                </Text>
            </>
        )
    }

    function trip({ isDone, job, jobTime }) {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{
                        ...styles.trackingFlowDoneIconWrapStyle,
                        backgroundColor: isDone ? Colors.primaryColor : Colors.whiteColor,
                    }}>
                        {
                            isDone ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </View>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                        {job}
                    </Text>
                </View>
                <Text style={isDone ? { ...Fonts.blackColor15Medium } : { ...Fonts.grayColor15Medium }}>
                    {jobTime}
                </Text>
            </View>
        )
    }

    function tripFlowIndicator({ isDone }) {
        return (
            <View style={{
                ...styles.tripFlowIndicatorStyle,
                backgroundColor: isDone ? Colors.primaryColor : Colors.grayColor,
            }} />
        )
    }

    function tripInfo() {
        return (
            <View>
                <Text style={{ marginBottom: Sizes.fixPadding - 3.0, ...Fonts.blackColor19Medium }}>
                    TRIP
                </Text>
                {trip({
                    isDone: time <= 20 ? true : false,
                    job: 'Confirm Your Order',
                    jobTime: '9:15'
                })}
                {tripFlowIndicator({ isDone: time <= 20 ? true : false })}
                {
                    time != 0 ?
                        <>
                            {trip({
                                isDone: time <= 15 ? true : false,
                                job: 'Delivery Boy go to Reastaurant',
                                jobTime: '9:15'
                            })}
                            {tripFlowIndicator({ isDone: time <= 15 ? true : false, })}
                            {trip({
                                isDone: time <= 10 ? true : false,
                                job: 'Waiting',
                                jobTime: '9:20'
                            })}
                            {tripFlowIndicator({ isDone: time <= 10 ? true : false })}
                            {trip({
                                isDone: time <= 5 ? true : false,
                                job: 'On the Way',
                                jobTime: '9:20'
                            })}
                            {tripFlowIndicator({ isDone: time <= 5 ? true : false })}
                            {trip({
                                isDone: time <= 0 ? true : false,
                                job: 'Delivered',
                                jobTime: '9:25'
                            })}
                        </>
                        :
                        <>
                            {trip({
                                isDone: time <= 0 ? true : false,
                                job: 'Delivered',
                                jobTime: '9:25'
                            })}
                        </>
                }
            </View>
        )
    }

    function userInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../../assets/images/user_profile/user_6.jpg')}
                        style={{ width: 60.0, height: 60.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={styles.userInfoWrapStyle}>
                        <Text numberOfLines={1} style={{ width: width / 2.0, ...Fonts.blackColor16Medium }}>
                            Devin Stokes
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star" size={18} color={Colors.orangeRatingColor} />
                            <Text style={{ ...Fonts.blackColor16Medium }}>
                                4.5
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        ...styles.messageAndPhoneIconWrapStyle,
                        backgroundColor: '#2196F3',
                    }}>
                        <MaterialIcons name="message" size={24} color={Colors.whiteColor} />
                    </View>
                    <View style={{
                        ...styles.messageAndPhoneIconWrapStyle,
                        backgroundColor: '#4CAF50',
                        marginLeft: Sizes.fixPadding
                    }}>
                        <MaterialIcons name="phone" size={24} color={Colors.whiteColor} />
                    </View>
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: Colors.grayColor,
                height: 0.50,
                marginVertical: Sizes.fixPadding
            }} />
        )
    }

    function orderInfo() {
        return (
            <View
                style={styles.orderWrapStyle}>
                <Image
                    source={require('../../../assets/images/restaurant/restaurant_5.png')}
                    style={styles.restaurantImageStyle}
                />
                <View style={styles.orderInfoStyle}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Kichi Coffee & Drink
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.orderIdIndicatorStyle}>
                        </View>
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                            43e4215
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...Fonts.grayColor14Medium }}>
                            4 Items
                        </Text>
                        <Text style={{ ...Fonts.primaryColor15Regular }}>
                            On the Way
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, }}>
            {mapInfo()}
            <BottomSheet
                ref={sheetRef}
                snapPoints={[600, 100, 100]}
                borderRadius={Sizes.fixPadding * 2.0}
                enabledBottomInitialAnimation={true}
                renderContent={isRating ? ratingContent : trackContent}
                onOpenEnd={() => setSheetOpen(true)}
                onCloseEnd={() => setSheetOpen(false)}
            />
        </View>
    )

    function mapInfo() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}  >
                <MapView
                    style={{ flex: 1, }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                    mapType="terrain"
                >
                    <MapViewDirections
                        origin={pickupMarker}
                        destination={deliveryMarker}
                        // apikey={Key.apiKey}
                        apikey="AIzaSyDkAmiEffMR4r0r9zziv66pyEGNJSSnGN0"
                        lineDashPattern={[1]}
                        lineCap="square"
                        strokeColor="#297AC6"
                        strokeWidth={2}
                    />
                    <Marker coordinate={pickupMarker}>
                        <Image
                            source={require('../../../assets/images/driver-marker.png')}
                            style={{ width: 40.0, height: 20.0 }}
                            resizeMode="contain"
                        />
                    </Marker>
                    <Marker coordinate={deliveryMarker}>
                        <Image
                            source={require('../../../assets/images/custom_marker.png')}
                            style={{ width: 30.0, height: 30.0 }}
                        />
                    </Marker>
                </MapView >
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        height: 56.0,
    },
    orderWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 90.0,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    orderIdIndicatorStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 11.0,
        height: 11.0,
        borderRadius: 5.5,
    },
    completeButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 3.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 3.0,
    },
    reviewTypeSclectorStyle: {
        width: 23.0,
        height: 23.0,
        borderRadius: 11.5,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
    },
    bottomSheetWrapStyle: {
        backgroundColor: 'white',
        padding: Sizes.fixPadding + 5.0,
        height: 600,
        borderTopColor: '#cccccc',
        borderTopWidth: 0.50,
    },
    trackingFlowDoneIconWrapStyle: {
        width: 18.0,
        height: 18.0,
        borderRadius: 9.0,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripFlowIndicatorStyle: {
        marginVertical: -2.0,
        marginLeft: Sizes.fixPadding - 1.0,
        height: 30.0,
        width: 0.50,
    },
    userInfoWrapStyle: {
        paddingVertical: Sizes.fixPadding - 5.0,
        height: 60.0,
        justifyContent: 'space-between',
        marginLeft: Sizes.fixPadding
    },
    messageAndPhoneIconWrapStyle: {
        width: 40.0,
        height: 40.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
    },
    orderInfoStyle: {
        marginHorizontal: Sizes.fixPadding,
        flex: 1,
        paddingVertical: Sizes.fixPadding + 2.0,
        justifyContent: 'space-between'
    },
})

// TrackOrderScreen.navigationOptions = () => {
//     return {
//         header: () => null
//     }
// }

export default TrackOrderScreen;