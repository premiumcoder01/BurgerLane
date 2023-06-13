import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductsData = ({popularItemList, productList, restroId}) => {
  return (
    <ScrollView
      // contentContainerStyle={{flexGrow: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        paddingVertical: 20,
      }}>
      {/* popular item */}
      <View style={{marginHorizontal: 20}}>
        <Text style={{...Fonts.blackColor19Medium}}>Popular Items</Text>

        <FlatList
          data={popularItemList}
          keyExtractor={item => `${item.id}`}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 20}}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 0.5,
                  marginVertical: 10,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderStyle: 'dashed',
                  borderRightColor: 'rgba(161,155,183,1)',
                }}
              />
            );
          }}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 5,
                  backgroundColor: Colors.whiteColor,
                  paddingBottom: 20,
                }}>
                <View>
                  <Text style={{...Fonts.blackColor15Medium}}>{item.name}</Text>
                  <Text
                    style={{
                      ...Fonts.grayColor14Medium,
                      fontSize: 12,
                      marginBottom: 10,
                    }}>
                    ({item.cat_name})
                  </Text>
                  <Text
                    style={{
                      ...Fonts.blackColor14Regular,
                      fontWeight: 'bold',
                    }}>
                    $ {item.price}
                  </Text>
                </View>
                <View
                  style={{
                    position: 'relative',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <Image
                    source={{uri: item.image}}
                    resizeMode="contain"
                    style={{height: 150, width: 150, borderRadius: 20}}
                  />
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: '#FCE0E5',
                      width: 100,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: Colors.primaryColor,
                      position: 'absolute',
                      bottom: -20,
                    }}>
                    <Text
                      style={{
                        ...Fonts.primaryColor16Medium,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}>
                      Add
                    </Text>
                    <Text
                      style={{
                        ...Fonts.primaryColor16Medium,
                        fontSize: 18,
                        position: 'absolute',
                        right: 10,
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* product list  */}
      <View style={{marginHorizontal: 20}}>
        {productList.map(item => {
          return (
            <View key={item.id}>
              {item?.item_category_list.length !== 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{...Fonts.blackColor19Medium}}>
                    {item?.name}{' '}
                    <Text style={{...Fonts.blackColor14Regular, marginLeft: 5}}>
                      ({item?.item_category_list.length})
                    </Text>
                  </Text>
                </View>
              )}
              <FlatList
                data={item?.item_category_list}
                keyExtractor={item => `${item.id}`}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingVertical: 20}}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        height: 0.5,
                        marginVertical: 10,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderStyle: 'dashed',
                        borderRightColor: 'rgba(161,155,183,1)',
                      }}
                    />
                  );
                }}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 5,
                        backgroundColor: Colors.whiteColor,
                        paddingBottom: 25,
                      }}>
                      <View>
                        <Text style={{...Fonts.blackColor15Medium}}>
                          {item?.items?.name}
                        </Text>

                        <Text
                          style={{
                            ...Fonts.blackColor14Regular,
                            fontWeight: 'bold',
                            marginVertical: 5,
                          }}>
                          $ {item?.items?.price}
                        </Text>
                        <Text
                          style={{
                            marginVertical: Sizes.fixPadding - 5.0,
                            ...Fonts.grayColor14Regular,
                            width: 150,
                          }}>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry....
                        </Text>
                      </View>
                      <View
                        style={{
                          position: 'relative',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}>
                        <Image
                          source={{uri: item?.items?.image}}
                          resizeMode="contain"
                          style={{height: 150, width: 150, borderRadius: 20}}
                        />
                        <TouchableOpacity
                          style={{
                            padding: 10,
                            backgroundColor: '#FCE0E5',
                            width: 100,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: Colors.primaryColor,
                            position: 'absolute',
                            bottom: -20,
                          }}>
                          <Text
                            style={{
                              ...Fonts.primaryColor16Medium,
                              textAlign: 'center',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}>
                            Add
                          </Text>
                          <Text
                            style={{
                              ...Fonts.primaryColor16Medium,
                              fontSize: 18,
                              position: 'absolute',
                              right: 10,
                            }}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ProductsData;

const styles = StyleSheet.create({});
