import React, {Component, Fragment} from 'react';
import {SafeAreaView, View, StatusBar, StyleSheet} from 'react-native';
import { Colors } from '../constants/styles';

export default class SafeArea extends Component {
  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={[
            styles.safeAreaTop,
            {
              backgroundColor: this.props.statusBarColor
                ? this.props.statusBarColor
                : Colors.whiteColor,
            },
          ]}
        />
        <StatusBar
          backgroundColor={this.props.statusBarColor}
          barStyle={this.props.statusBarStyle}
        />
        <SafeAreaView
          style={[
            styles.safeAreaBottom,
            {
              backgroundColor: this.props.bottomBarColor
                ? this.props.bottomBarColor
                : Colors.whiteColor,
            },
          ]}>
          <View style={styles.container}>{this.props.children}</View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: Colors.whiteColor,
  },
  safeAreaBottom: {
    flex: 1,
    backgroundColor: Colors.grayColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});