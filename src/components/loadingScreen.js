import React from "react";
import { View } from "react-native";
// import * as Font from "expo-font";

export default class LoadingScreen extends React.Component {
    async componentDidMount() {
        this.props.navigation.navigate('Splash');
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
            </View>
        )
    }
}

