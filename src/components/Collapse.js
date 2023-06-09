import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Colors, Sizes} from '../constants/styles';
import SafeArea from '../helpers/SafeArea';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HEADER_EXPANDED_HEIGHT = 200;
const HEADER_COLLAPSED_HEIGHT = 56;

const TITLE_EXPANDED_HEIGHT = 24;
const TITLE_COLLAPSED_HEIGHT = 16;
const {width: SCREEN_WIDTH} = Dimensions.get('screen');

export default class Collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      open: true,
    };
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerSlide = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 32],
      extrapolate: 'clamp',
    });

    const headerTitleSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [TITLE_EXPANDED_HEIGHT, TITLE_COLLAPSED_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
      outputRange: [0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <SafeArea
        statusBarColor={
          this.state.open ? this.props.headerColor : this.props.headerColorDark
        }
        bottomBarColor={
          this.props.bottomBarColor
            ? this.props.bottomBarColor
            : Colors.primaryColor
        }
        statusBarStyle={this.state.open ? 'light-content' : 'light-content'}>
        <View style={styles.container}>
          <Animated.View
            onLayout={event => this.onLayout(event)}
            style={[
              styles.header,
              {
                height: headerHeight,
                backgroundColor: this.props.headerColor
                  ? this.props.headerColor
                  : Colors.primaryColor,
              },
            ]}>
            <Animated.Text
              style={[
                styles.headerTitle,
                styles.maxHeader,
                {
                  color: Colors.whiteColor,
                  paddingLeft: headerSlide,
                  fontSize: headerTitleSize,
                  opacity: headerTitleOpacity,
                },
              ]}>
              {this.props.title ? this.props.title : ' Title'}
            </Animated.Text>
            <View style={styles.appBar}>
              <TouchableOpacity onPress={() => this.props.backPress()}>
                <MaterialIcons
                  name="arrow-back"
                  size={25}
                  color={Colors.whiteColor}
                />
              </TouchableOpacity>
              {!this.state.open && (
                <Text style={styles.minHeader}>
                  {this.props.title ? this.props.title : 'Title'}
                </Text>
              )}
            </View>

            <Animated.Image
              style={[styles.image, {opacity: imageOpacity}]}
              source={this.props.image}
            />
          </Animated.View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
              {
                useNativeDriver: false,
                // listener: event => this.handleScroll(event),
              },
            )}
            scrollEventThrottle={16}>
            {this.props.children}
          </ScrollView>
        </View>
      </SafeArea>
    );
  }

  onLayout(event) {
    const {x, y, height, width} = event.nativeEvent.layout;
    this.setState({open: height === HEADER_COLLAPSED_HEIGHT ? false : true});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollContainer: {
    paddingTop: HEADER_EXPANDED_HEIGHT,
  },
  header: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    zIndex: 2,
  },
  title: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  headerTitle: {
    letterSpacing: 0,
    textAlign: 'center',
    position: 'absolute',
    bottom: 16,
    zIndex: 99,
  },
  maxHeader: {
    fontSize: 24,
    left: 16,
    lineHeight: 38,
  },
  minHeader: {
    fontSize: 16,
    paddingLeft: 16,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  backIcon: {
    zIndex: 99,
    height: 20,
    width: 20,
  },
  image: {
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,.2)',
    left: 0,
    right: 0,
    height: 200,
    width: SCREEN_WIDTH,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 16,
  },
});
