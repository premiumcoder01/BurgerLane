import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Fonts, Colors, Sizes, ToastAndroid} from '../../constants/styles';
import {GetApi, Post} from '../../helpers/Service';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import Constants from '../../helpers/Constant';
import Modal from 'react-native-modal';
const width = Dimensions.get('screen');

const allItems = [];

const CategoryList = item => {
  const route = useRoute();
  const data = route.params.item;
  const [loading, setLoading] = useState(false);

  const [productDetailsAddOns, setProductDetailsAddOns] = useState([]);
  const [productAddOnId, setProductAddOnId] = useState(null);
  const [productAddOnIdArray, setProductAddOnIdArray] = useState([]);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [qty, setQty] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const handlePopularItemsUpdate = ({id, restaurant_id}) => {
    const newList = data.map(item => {
      if (item.id === id) {
        const formData = new FormData();
        formData.append('item_id', id);
        formData.append('restaurant_id', restaurant_id);
        Post(Constants.favouriteFood, formData).then(
          async res => {
            if (res.status === 200) {
              const updatedItem = {...item, isFavourite: !item.isFavourite};
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addItem = item => {
    setLoading(true);
    const formData = new FormData();
    formData.append('item_id', item?.item_id);
    Post(Constants.productDetails, formData).then(
      async res => {
        setLoading(false);
        if (res.Status === 200) {
          setProductDetailsAddOns(res.data?.product_details);
          setProductAddOnId(null);
          setProductAddOnIdArray([]);
          setAddOnPrice(0);
          setQty(1);
          setModalVisible(true);
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  const addToCart = () => {
    const formData = new FormData();
    formData.append('item_id', productDetailsAddOns[0]?.id);
    formData.append('restaurant_id', productDetailsAddOns[0]?.restaurant_id);
    formData.append('quantity', qty);
    formData.append('add_on_item', JSON.stringify(productAddOnIdArray));
    Post(Constants.addToCart, formData).then(
      async res => {
        if (res.Status === '200') {
          setModalVisible(false);
          navigation.navigate('ConfirmOrder');
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };

  function setAddOnDetail(index_value, item_id, price) {
    if (allItems.includes(item_id)) {
      setAddOnPrice(addOnPrice - price);
      for (var i = allItems.length - 1; i >= 0; i--) {
        if (allItems[i] === item_id) {
          allItems.splice(i, 1);
        }
      }
    } else {
      setAddOnPrice(addOnPrice + price);
      allItems.push(item_id);
    }
    setProductAddOnId(item_id);
    setProductAddOnIdArray(allItems);
  }

  function productAddOnListArray(index_value, is_multiple) {
    return is_multiple == 'true'
      ? productDetailsAddOns[0]?.product_add_on[
          index_value
        ]?.product_add_on_option.map((item, index) => (
          <View>
            <View style={styles.sizesWrapStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    setAddOnDetail(index_value, item.id, parseInt(item.price));
                  }}
                  style={{
                    ...styles.radioButtonStyle,
                    backgroundColor: productAddOnIdArray.includes(item.id)
                      ? Colors.primaryColor
                      : Colors.whiteColor,
                  }}>
                  {productAddOnIdArray.includes(item.id) ? (
                    <MaterialIcons
                      name="done"
                      size={18}
                      color={Colors.whiteColor}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor16Medium,
                  }}>
                  {item?.title}
                </Text>
              </View>
              <Text style={{...Fonts.blackColor16Medium}}>$ {item?.price}</Text>
            </View>
          </View>
        ))
      : productDetailsAddOns[0]?.product_add_on[
          index_value
        ]?.product_add_on_option.map((item, index) => (
          <View>
            <View style={styles.sizesWrapStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setAddOnDetail(index_value, item.id, parseInt(item.price));
                  }}
                  style={{
                    ...styles.radioButtonStyle,
                    backgroundColor:
                      productAddOnId == item.id
                        ? Colors.primaryColor
                        : Colors.whiteColor,
                  }}>
                  {productAddOnId == item.id ? (
                    <MaterialIcons
                      name="done"
                      size={18}
                      color={Colors.whiteColor}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor16Medium,
                  }}>
                  {item?.title}
                </Text>
              </View>
              <Text style={{...Fonts.blackColor16Medium}}>$ {item?.price}</Text>
            </View>
          </View>
        ));
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <Spinner color={'#fff'} visible={loading} />
      <View
        style={{
          backgroundColor: Colors.primaryColor,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingTop: 20,
        }}>
        <AntDesign
          name="arrowleft"
          size={22}
          color={Colors.whiteColor}
          onPress={() => navigation.goBack()}
        />
        <Text style={{...Fonts.whiteColor17Regular, fontWeight: 'bold'}}>
          Category List
        </Text>
        <View />
      </View>
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
        keyExtractor={item => `${item.id}`}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={styles.allRestaurentsInfoWrapStyle}>
              <View>
                <Image
                  source={{
                    uri: `https://burgerlane.isynbus.com/${item?.image}`,
                  }}
                  style={styles.allRestaurentImageStyle}
                />
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
                      item.isFavourite ? Colors.primaryColor : Colors.whiteColor
                    }
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingHorizontal: Sizes.fixPadding - 5.0,
                  paddingBottom: Sizes.fixPadding,
                  paddingTop: Sizes.fixPadding - 5.0,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    ...Fonts.blackColor14Regular,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                  }}>
                  {item?.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: Sizes.fixPadding,
                    ...Fonts.grayColor14Medium,
                    fontWeight: 'bold',
                    fontSize: 12,
                    alignSelf: 'center',
                  }}>
                  Price : {item?.price}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    backgroundColor: '#FCE0E5',
                    // width: 100,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.primaryColor,
                    marginTop: 10,
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
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* modal */}
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
        <View
          style={{
            backgroundColor: '#fff',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            minHeight: 100,
          }}>
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
                  source={{uri: productDetailsAddOns[0]?.image}}
                  resizeMode="contain"
                  style={{height: 60, width: 60, borderRadius: 10}}
                />
                <Text
                  style={{
                    ...Fonts.blackColor15Regular,
                    marginLeft: 20,
                    fontWeight: 'bold',
                  }}>
                  {productDetailsAddOns[0]?.name}
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
                  onPress={() => {
                    qty < 2 ? setIsCartModal(false) : setQty(qty - 1);
                  }}
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
          {/* addon */}
          {productDetailsAddOns[0]?.product_add_on.length !== 0 ? (
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
                Add On
              </Text>
              {productDetailsAddOns[0]?.product_add_on.map((item, index) => {
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
                    {/* Array code  */}
                    {productAddOnListArray(index, item?.is_multiple)}
                    {/* end array code  */}
                  </View>
                );
              })}
            </View>
          ) : null}

          <TouchableOpacity
            style={{
              padding: 10,
              paddingVertical: 15,
              backgroundColor: Colors.primaryColor,
              borderRadius: 10,
              margin: 10,
            }}
            onPress={() => {
              addToCart();
            }}>
            <Text
              style={{
                ...Fonts.whiteColor16Regular,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Add Items $ {productDetailsAddOns[0]?.price * qty + addOnPrice}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  allRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 150,
    marginBottom: 20,
    elevation: 5,
  },
  allRestaurentImageStyle: {
    height: 150,
    resizeMode: 'contain',
    width: 150,
    borderRadius: 100,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  radioButtonStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
  },

  sizesWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
});
