import React from 'react';
import { Component } from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  TextInput,
} from 'react-native';
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from '../../constants/styles';
import CollapsingToolbar from '../../components/sliverAppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { useEffect } from 'react';
import Constants from '../../helpers/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GetApi, Post, PostGet } from '../../helpers/Service';
import { Alert } from 'react-native';
import { ToastAndroid } from 'react-native';
// import { TransitionPresets } from "react-navigation-stack";

class SearchScreen extends Component {
  state = {
    search: '',
    suggestionsLists: [],
    loading: true,
    searchHistory: [],
    searchResults: [],
  };

  componentDidMount() {
    this.history();
  }

  history = () => {
    this.setState({ loading: true });
    Post(Constants.searchTab).then(
      async res => {
        if (res.status === 200) {
          this.setState({
            suggestionsLists: res?.data?.suggestions,
            searchHistory: res?.data?.searchHistories,
          });
        } else {
          // Toaster(res?.message)
        }

        this.setState({ loading: false });
      },
      err => {
        this.setState({ loading: false });
        console.log(err.response.data);
      },
    );
  };

  restaurantListCategory = item => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append('category_id', item.id);
    formData.append('latitude', '28.629341719747938');
    formData.append('longitude', '77.38402881349394');

    Post(Constants.restaurantByCategory, formData).then(
      async res => {
        if (res.status === 200) {
          this.props.navigation.navigate('CategoryList', {
            item: res,
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

  saveHistory = item => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append('item_id', item?.id);
    formData.append('item_name', item?.name);
    formData.append('restaurant_id', item?.restaurant_id);

    Post(Constants.saveHistory, formData).then(
      async res => {
        if (res.status === 200) {
          this.props.navigation.navigate('RestaurantDetail', {
            restaurant_id: item?.restaurant_id,
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

  // componentDidMount() {
  //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  // }

  // componentWillUnmount() {
  //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  // }

  // handleBackButton = () => {
  //     this.props.navigation.pop();
  //     return true;
  // };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <CollapsingToolbar
          element={
            <View style={styles.searchFieldAndExitTextWrapStyle}>
              <View style={styles.searchFieldWrapStyle}>
                <MaterialIcons
                  name="search"
                  size={25}
                  color={Colors.whiteColor}
                />
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.lightPrimaryColor16Regular,
                  }}
                  placeholder="Search"
                  aut
                  selectionColor={Colors.primaryColor}
                  placeholderTextColor="#EAB4BE"
                  onChangeText={text => {
                    this.setState({ search: text });
                    this.setState({ loading: true });
                    const formData = new FormData();
                    formData.append('search', text);
                    Post(Constants.searchResultAutoComplete, formData).then(
                      async res => {
                        if (res.status === 200) {
                          console.log('text' + JSON.stringify(res?.data));
                          this.setState({ searchResults: res?.data });
                        } else {
                          // Toaster(res?.message)
                        }

                        this.setState({ loading: false });
                      },
                      err => {
                        this.setState({ loading: false });
                        console.log(err.response.data);
                      },
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.pop()}
                style={{ flex: 0.22, marginLeft: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.whiteColor17Regular }}>Exit</Text>
              </TouchableOpacity>
            </View>
          }
          toolbarColor={Colors.primaryColor}
          toolbarMinHeight={0}
          toolbarMaxHeight={95}
          isImage={false}
          childrenMinHeight={750}>
          <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <View style={styles.pageStyle}>
              {this.historyInfo()}
              {this.suggetionsInfo()}
            </View>
          </View>
        </CollapsingToolbar>
      </SafeAreaView>
    );
  }

  suggetionsInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 10.0,
            ...Fonts.blackColor19Medium,
            zIndex: -999
          }}>
          Suggestions
        </Text>
        {this.state.suggestionsLists.length !== 0 ? (
          this.state.suggestionsLists.map(item => (
            <View key={`${item.id}`}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.restaurantListCategory(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  zIndex: -999,
                  marginBottom: Sizes.fixPadding * 2.0,
                }}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 65.0,
                    height: 65.0,
                    borderRadius: Sizes.fixPadding,
                  }}
                />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding * 2.0,
                    ...Fonts.blackColor19Medium,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ ...Fonts.blackColor15Medium }}>
              No Suggestions to Show!
            </Text>
          </View>
        )}
      </View>
    );
  }



  historyInfo() {
    return (
      <View
        style={{
          position: 'relative',
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
          zIndex: -10,
        }}>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ ...Fonts.blackColor19Medium }}>History</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.setState({ loading: true });
              Post(Constants.searchDeleteAll).then(
                async res => {
                  if (res.status === 200) {
                    this.setState({ loading: false });
                    ToastAndroid.show(
                      'Search History Deleted Successfully!',
                      ToastAndroid.CENTER,
                    );
                  } else {
                    // Toaster(res?.message)
                  }

                  this.setState({
                    loading: false,
                    searchHistories: res?.data?.searchHistories,
                  });
                },
                err => {
                  this.setState({ loading: false });
                  console.log(err.response.data);
                },
              );
            }}>
            <Text style={{ ...Fonts.primaryColor16Medium }}>Clear all</Text>
          </TouchableOpacity>
        </View>
        {this.state.searchHistory.length !== 0 ? (
          this.state.searchHistory.map(item => (
            <View key={`${item.id}`}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('RestaurantDetail', {
                      restaurant_id: item?.restaurant_id,
                    })
                  }}
                >
                  <Text style={{ ...Fonts.grayColor16Medium }}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ loading: true });
                    const formData = new FormData();
                    formData.append('id', item?.id);
                    Post(Constants.searchDelete, formData).then(
                      async res => {
                        if (res.status === 200) {
                          this.props.navigation.push('Search')
                        } else {
                        }
                        // this.setState({
                        //   loading: false,
                        //   searchHistories: res?.data?.searchHistories,
                        // });
                      },
                      err => {
                        this.setState({ loading: false });
                        console.log(err.response.data);
                      },
                    );
                  }}
                  activeOpacity={0.8}>
                  <MaterialIcons
                    name="close"
                    size={19}
                    color={Colors.grayColor}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: Colors.grayColor,
                  height: 0.5,
                  marginVertical: Sizes.fixPadding,
                }}
              />
            </View>
          ))
        ) : (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ ...Fonts.blackColor15Medium }}>
              No Search History to Show!
            </Text>
          </View>
        )}
        {this.state.searchHistory.length > 5 && (
          <Text style={{ ...Fonts.primaryColor16Medium }}>View More</Text>
        )}
        {this.state.search !== '' && (
          <View
            style={{
              position: 'absolute',
              top: '-20%',
              zIndex: 1000,
              alignSelf: 'center',
              width: '100%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              flexDirection: 'column',
            }}>
            {this.state.searchResults?.length !== 0 ? (
              this.state?.searchResults.map(item => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.saveHistory(item)}
                  style={{ marginBottom: 10, backgroundColor: 'white' }}>
                  <Text style={{ fontSize: 14, color: 'black' }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ ...Fonts.blackColor15Medium }}>
                  No Search Results to Show!
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
    paddingBottom: Sizes.fixPadding * 6.0,
  },
  searchFieldWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkPrimaryColor,
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    flex: 1,
  },
  searchFieldAndExitTextWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding * 2.0,
  },
});

// SearchScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default SearchScreen;
