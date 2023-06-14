import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Modal from 'react-native-modal';

const ProductsData = ({popularItemList, productList, restroId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [qty, setQty] = useState('');
  const [selectOptions, setSelectOptions] = useState(null);
  const [selectSize, setSelectSize] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePopularItemsUpdate = ({id, restaurant_id}) => {
    const newList = popularItemList.map(item => {
      if (item.id === id) {
        const formData = new FormData();
        formData.append('item_id', id);
        formData.append('restaurant_id', restaurant_id);
        Post(Constants.favouriteFood, formData).then(
          async res => {
            if (res.status === 200) {
              const updatedItem = {...item, isFavourite: !item.isFavourite};
              // console.log(updatedItem);
              return updatedItem;
            }
          },
          err => {
            console.log(err.response.data);
          },
        );
      }
    });
    return newList;
  };

  const addItem = item => {
    const formData = new FormData();
    formData.append('item_id', item?.id);
    Post(Constants.productDetails, formData).then(
      async res => {
        if (res.Status === 200) {
          res?.data?.product_details.map(item => {
            item.qty = 1;
          });
          // console.log(res?.data?.product_details[0].product_add_on);
          setCartData(res?.data?.product_details);
          setQty(res?.data?.product_details[0].qty);
          setModalVisible(true);
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  // console.log('selectOptions', selectOptions, 'selectSize', selectSize);

  const OptionList = ({options, selectedOption, onSelectOption}) => {
    return (
      <View>
        {options.map(option => (
          <Pressable
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            key={option.id}
            onPress={() => onSelectOption(option)}>
            <Text
              style={{
                ...Fonts.blackColor15Regular,
                fontWeight:
                  selectedOption && selectedOption.id === option.id
                    ? 'bold'
                    : 'normal',
              }}>
              {option.title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  ...Fonts.blackColor15Regular,
                  fontWeight:
                    selectedOption && selectedOption.id === option.id
                      ? 'bold'
                      : 'normal',
                  marginRight: 10,
                }}>
                {option.price}
              </Text>
              <MaterialCommunityIcons
                name={
                  selectedOption && selectedOption.id === option.id
                    ? 'checkbox-marked'
                    : 'checkbox-blank-outline'
                }
                size={18}
                color={
                  selectedOption && selectedOption.id === option.id
                    ? Colors.primaryColor
                    : Colors.grayColor
                }
              />
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const productAddOnListArray = (index_value, is_multiple) => {
    const onSelectOption = option => {
      if (selectSize && selectSize.id === option.id) {
        // If the same option is selected again, unselect it
        setSelectSize(null);
      } else {
        setSelectSize(option);
      }
    };

    return is_multiple == 'true' ? (
      <OptionList
        options={cartData[0]?.product_add_on[index_value].product_add_on_option}
        selectedOption={selectSize}
        onSelectOption={onSelectOption}
      />
    ) : (
      cartData[0]?.product_add_on[index_value].product_add_on_option.map(
        (item, index) => {
          return (
            <Pressable
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => setSelectOptions(index)}>
              <Text
                style={{
                  ...Fonts.blackColor15Regular,
                  fontWeight: selectOptions === index ? 'bold' : 'normal',
                }}>
                {item.title}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Regular,
                    fontWeight: selectOptions === index ? 'bold' : 'normal',
                    marginRight: 10,
                  }}>
                  {item.price}
                </Text>
                <MaterialCommunityIcons
                  name={
                    selectOptions === index
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={18}
                  color={
                    selectOptions === index
                      ? Colors.primaryColor
                      : Colors.grayColor
                  }
                />
              </View>
            </Pressable>
          );
        },
      )
    );
  };

  return (
    <ScrollView
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
                <View style={{width: 130}}>
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
                    }}
                    onPress={() => addItem(item)}>
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
                  <TouchableOpacity
                    onPress={() => {
                      handlePopularItemsUpdate({
                        id: item.id,
                        restaurant_id: item.restaurant_id,
                      });
                    }}
                    style={{position: 'absolute', right: 20, top: 10}}>
                    <AntDesign
                      name={item.isFavourite ? 'heart' : 'hearto'}
                      size={22}
                      color={
                        item.isFavourite
                          ? Colors.primaryColor
                          : Colors.whiteColor
                      }
                    />
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
                      <View style={{width: 130}}>
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
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        backdropOpacity={0.5}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={styles.modal}>
        <View style={styles.modalContent}>
          {/* <View style={styles.barIcon} /> */}
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.whiteColor,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              elevation: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: cartData[0]?.image}}
                  resizeMode="contain"
                  style={{height: 60, width: 60, borderRadius: 10}}
                />
                <Text
                  style={{
                    ...Fonts.blackColor15Regular,
                    marginLeft: 20,
                    fontWeight: 'bold',
                  }}>
                  {cartData[0]?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#FCE0E5',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors.primaryColor,
                }}>
                <MaterialIcons
                  name="remove"
                  color={Colors.blackColor}
                  size={18}
                  onPress={() =>
                    qty < 2 ? setModalVisible(false) : setQty(qty - 1)
                  }
                />
                <Text
                  style={{...Fonts.blackColor15Regular, marginHorizontal: 10}}>
                  {qty}
                </Text>
                <MaterialIcons
                  name="add"
                  color={Colors.blackColor}
                  size={18}
                  onPress={() => setQty(qty + 1)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              margin: 10,
              marginTop: 20,
              padding: 10,
              backgroundColor: Colors.whiteColor,
              elevation: 3,
              borderRadius: 10,
            }}>
            <Text style={{...Fonts.blackColor15Regular, fontWeight: 'bold'}}>
              Add Ons
            </Text>
            {cartData[0]?.product_add_on.map((item, index) => {
              return (
                <View style={{marginTop: 20}}>
                  <Text
                    style={{
                      ...Fonts.blackColor14Regular,
                      marginBottom: 10,
                      fontWeight: 'bold',
                    }}>
                    {item.title}
                  </Text>
                  {/* Size options */}

                  {productAddOnListArray(index, item?.is_multiple)}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProductsData;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    // paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 300,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
