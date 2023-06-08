import React, { useState } from "react";
import { Component } from "react";
import { SafeAreaView, View, StatusBar, Dimensions, Text } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { TabView, TabBar } from 'react-native-tab-view';
import OngoingOrders from "../ongoingOrders/ongoingOrdersList";
import HistoryOrders from "../historyOrders/historyOrdersList";

const { width } = Dimensions.get('screen');

class OrderByScreen extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <StatusBar backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <TabBarView props={this.props} />
                </View>
            </SafeAreaView>
        )
    }

    header() {
        return (
            <View style={{ backgroundColor: Colors.whiteColor, paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Order
                </Text>
            </View>
        )
    }
}

const TabBarView = ({ props }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Ongoing' },
        { key: 'second', title: 'History' },
    ]);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <OngoingOrders props={props} />;
            case 'second':
                return <HistoryOrders props={props} />;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}

            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{ height: 2.5, backgroundColor: Colors.primaryColor, }}
                    tabStyle={{
                        width: width / 2,
                        height: 52.0,
                    }}
                    scrollEnabled={true}
                    style={{ backgroundColor: Colors.whiteColor }}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={
                            focused ?
                                { ...Fonts.primaryColor16Medium }
                                :
                                { ...Fonts.lightGrayColor16Medium }
                        }>
                            {route.title}
                        </Text>
                    )}
                />
            )
            }
        />
    )
}

OrderByScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default OrderByScreen;