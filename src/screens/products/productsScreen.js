import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Fonts, Colors, Sizes } from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Constants from '../../helpers/Constant';
import { Post } from '../../helpers/Service';
import Spinner from '../../components/Spinner';

const juiceList = [
  {
    id: '1',
    image: require('../../../assets/images/products/lemon_juice.png'),
    name: 'Lemon Juice Fresh',
    amount: 5.2,
    isFavourite: false,
  },
  {
    id: '2',
    image: require('../../../assets/images/products/orange_juice.png'),
    name: 'Lemon Juice Fresh',
    amount: 4.5,
    isFavourite: false,
  },
];

const coffeeList = [
  {
    id: '1',
    image: require('../../../assets/images/products/lemon_juice.png'),
    name: 'Lemon Juice Fresh',
    amount: 5.2,
    isFavourite: false,
  },
  {
    id: '2',
    image: require('../../../assets/images/products/orange_juice.png'),
    name: 'Lemon Juice Fresh',
    amount: 4.5,
    isFavourite: false,
  },
];

const popularItemsList = [
  {
    id: '1',
    image: require('../../../assets/images/products/products_6.png'),
    foodName: 'Margherita Pizza',
    foodCategory: 'Delicious Pizza',
    amount: 5.0,
    isFavourite: false,
  },
  {
    id: '2',
    image: require('../../../assets/images/products/products_4.png'),
    foodName: 'Thin Crust Pizza',
    foodCategory: 'Delicious Pizza',
    amount: 12.0,
    isFavourite: false,
  },
  {
    id: '3',
    image: require('../../../assets/images/products/products_5.png'),
    foodName: 'Veg Burger',
    foodCategory: 'Fast Food',
    amount: 4.0,
    isFavourite: false,
  },
  {
    id: '4',
    image: require('../../../assets/images/products/products_6.png'),
    foodName: 'Fried Noodles',
    foodCategory: 'Chinese',
    amount: 11.0,
    isFavourite: false,
  },
  {
    id: '5',
    image: require('../../../assets/images/products/products_1.png'),
    foodName: 'Hakka Noodles',
    foodCategory: 'Chinese',
    amount: 7.0,
    isFavourite: false,
  },
  {
    id: '6',
    image: require('../../../assets/images/products/products_2.png'),
    foodName: 'Dry Manchuriyan',
    foodCategory: 'Chinese',
    amount: 9.9,
    isFavourite: false,
  },
];

const optionsList = [
  {
    id: '1',
    option: 'Add Lemon',
    isSelected: false,
  },
  {
    id: '2',
    option: 'Add Ice',
    isSelected: false,
  },
];
const fruits = [];
const Products = ({ props, popularItemList, productList, restroId }) => {
  const [sizeIndex, setSizeIndex] = useState(null);
  const [productAddOnId, setProductAddOnId] = useState(null);
  const [productAddOnListId, setProductAddOnListId] = useState(null);
  const [productAddOnIdArray, setProductAddOnIdArray] = useState([]);

  const navigation = useNavigation();
  const intialAmount = 2.5;

  const [qty, setQty] = useState(1);

  const [options, setOptions] = useState(optionsList);

  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [popularItems, setPopularItems] = useState(popularItemList);


  const [juices, setJuices] = useState(juiceList);
  const [productDetailsAddOns, setProductDetailsAddOns] = useState([]);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [loading, setloading] = useState(false);

  const [coffees, setCoffees] = useState(coffeeList);
  const productDetails = item => {
    setloading(true);
    const formData = new FormData();
    formData.append('item_id', item?.id);
    Post(Constants.productDetails, formData).then(
      async res => {
        setloading(false);
        if (res.Status === 200) {
          setProductDetailsAddOns(res.data?.product_details);
          setShowBottomSheet(true);
          setProductAddOnId(null);
          setProductAddOnListId(null);
          setProductAddOnIdArray([]);
          setAddOnPrice(0);
          setQty(1);
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
    formData.append('restaurant_id', restroId);
    formData.append('quantity', qty);
    formData.append('add_on_item', JSON.stringify(productAddOnIdArray))
    Post(Constants.addToCart, formData).then(
      async res => {
        if (res.Status === '200') {
          setShowBottomSheet(false);
          props.navigation.push('ConfirmOrder');
        }
      },
      err => {
        console.log(err.response.data);
      },
    );
  };
  return (
    <View style={styles.pageStyle}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        {popularItemsInfo()}
        {juiceInfo()}
        {/* {coffeeInfo()} */}
      </ScrollView>
      {custmizeBottomSheet()}
    </View>
  );

  function custmizeBottomSheet() {
    return (
      <BottomSheet
        isVisible={showBottomSheet}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <View
          style={{
            backgroundColor: Colors.whiteColor,
            borderTopRightRadius: Sizes.fixPadding * 2.0,
            borderTopLeftRadius: Sizes.fixPadding * 2.0,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowBottomSheet(false)}>
            <View style={styles.bottomSheetOpenCloseDividerStyle} />
            {addNewItemTitle()}
            {CustmizeItemInfo()}
          </TouchableOpacity>
          {/* {sizeTitle()} */}
          {/* {sizesInfoArray()} */}
          {productAddOn()}
          {/* {sizesInfo()} */}
          {/* {optionsTitle()} */}
          {/* {optionsInfo()} */}
          {addToCartAndItemsInfo()}
        </View>
      </BottomSheet>
    );
  }

  function addToCartAndItemsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          addToCart();
        }}
        style={styles.addToCartAndItemsInfoWrapStyle}>
        <View>
          <Text style={{ ...Fonts.darkPrimaryColor16Medium }}>{qty} ITEM</Text>
          <Text style={{ ...Fonts.whiteColor15Regular }}>
            {/* ${((productDetailsAddOns[0]?.price * qty)).toFixed(1)} */}
            ${((productDetailsAddOns[0]?.price * qty) + addOnPrice).toFixed(1)}
          </Text>
        </View>
        <Text style={{ ...Fonts.whiteColor16Medium }}>Add to Cart</Text>
      </TouchableOpacity>
    );
  }

  function updateOptions({ id }) {
    const newList =
      productDetailsAddOns[0]?.product_add_on[1]?.product_add_on_option.map(
        item => {
          if (item.id === id) {
            const updatedItem = { ...item, isSelected: !item.isSelected };
            return updatedItem;
          }
          return item;
        },
      );
    setOptions(newList);
  }

  function optionsInfo() {
    return (
      <View
        style={{
          paddingTop: Sizes.fixPadding,
          paddingRight: Sizes.fixPadding,
        }}>
        {productDetailsAddOns[0]?.product_add_on[1]?.product_add_on_option.map(
          item => (
            <View
              key={`${item.id}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={styles.optionWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => updateOptions({ id: item.id })}
                  style={{
                    ...styles.radioButtonStyle,
                    backgroundColor: item.isSelected
                      ? Colors.primaryColor
                      : Colors.whiteColor,
                  }}>
                  {item.isSelected ? (
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
              <Text style={{ ...Fonts.blackColor16Medium }}>${item?.price}</Text>
            </View>
          ),
        )}
      </View>
    );
  }

  function optionsTitle() {
    return (
      <View
        style={{
          backgroundColor: Colors.bodyBackColor,
          padding: Sizes.fixPadding,
        }}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Options</Text>
      </View>
    );
  }

  function sizesInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding,
        }}>
        {sizes()}
      </View>
    );
  }

  function sizes() {
    return productDetailsAddOns[0]?.product_add_on[0]?.product_add_on_option.map(
      (item, index) => (
        <View style={styles.sizesWrapStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSizeIndex(index)}
              style={{
                ...styles.radioButtonStyle,
                backgroundColor:
                  sizeIndex == index ? Colors.primaryColor : Colors.whiteColor,
              }}>
              {sizeIndex == index ? (
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
            {/* <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.grayColor14Medium,
              }}>
              ({contain})
            </Text> */}
          </View>
          <Text style={{ ...Fonts.blackColor16Medium }}>${item?.price}</Text>
        </View>
      ),
    );
  }

  function productAddOn() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          //paddingHorizontal: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding,
        }}>
        {productAddOnList()}
      </View>
    );
  }

  function productAddOnList() {
    return productDetailsAddOns[0]?.product_add_on.map(
      (item, index) => (

        <View>
          {/* <Text
              style={{
                // marginLeft: Sizes.fixPadding,
                ...Fonts.blackColor19Medium,
              }}>
              {item?.title}
            </Text> */}

          <View style={styles.sizeTitleStyle}>
            <Text style={{ ...Fonts.grayColor16Medium }}>{item?.title}</Text>
            <Text style={{ ...Fonts.grayColor16Medium }}>Price</Text>
          </View>
          {/* Array code  */}
          {productAddOnListArray(index, item?.is_multiple)}
          {/* end array code  */}

        </View>
      ),
    );
  }
  function setAddOnDetail(index_value, item_id, price) {
    //setProductAddOnIdArray(fruits);
    if (fruits.includes(item_id)) {
      setAddOnPrice(addOnPrice - price);
      for (var i = fruits.length - 1; i >= 0; i--) {
        if (fruits[i] === item_id) {
          fruits.splice(i, 1);
        }
      }
    } else {
      setAddOnPrice(addOnPrice + price);
      fruits.push(item_id);
    }


    setProductAddOnId(item_id);
    setProductAddOnListId(index_value);
    setProductAddOnIdArray(fruits);
    console.log(productAddOnIdArray);
  }

  function productAddOnListArray(index_value, is_multiple) {
    return is_multiple == 'true' ? productDetailsAddOns[0]?.product_add_on[index_value]?.product_add_on_option.map(
      (item, index) => (
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding,
          }}>
          {/* Array code  */}

          <View style={styles.sizesWrapStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}

                // onPress={() => {
                //   setProductAddOnId(item.id);
                //   setProductAddOnListId(index_value);
                //   setProductAddOnIdArray(item.id);
                // }}
                onPress={() => {
                  setAddOnDetail(index_value, item.id, parseInt(item.price));
                }}

                style={{
                  // marginLeft: Sizes.fixPadding,
                  ...styles.radioButtonStyle,
                  backgroundColor:
                    (productAddOnIdArray.includes(item.id)) ? Colors.primaryColor : Colors.whiteColor,
                }}>
                {(productAddOnIdArray.includes(item.id)) ? (
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
              {/* <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.grayColor14Medium,
              }}>
              ({contain})
            </Text> */}
            </View>
            <Text style={{ ...Fonts.blackColor16Medium }}>${item?.price}</Text>
          </View>

          {/* end array code  */}

        </View>
      ),
    ) : productDetailsAddOns[0]?.product_add_on[index_value]?.product_add_on_option.map(
      (item, index) => (
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding,
          }}>
          {/* Array code  */}

          <View style={styles.sizesWrapStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}

                // onPress={() => {
                //   setProductAddOnId(item.id);
                //   setProductAddOnListId(index_value);
                //   setProductAddOnIdArray(item.id);
                // }}
                onPress={() => {
                  setAddOnDetail(index_value, item.id, parseInt(item.price));
                }}

                style={{
                  // marginLeft: Sizes.fixPadding,
                  ...styles.radioButtonStyle,
                  backgroundColor:
                    productAddOnId == item.id ? Colors.primaryColor : Colors.whiteColor,
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
              {/* <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.grayColor14Medium,
              }}>
              ({contain})
            </Text> */}
            </View>
            <Text style={{ ...Fonts.blackColor16Medium }}>${item?.price}</Text>
          </View>

          {/* end array code  */}

        </View>
      ),
    );
  }



  function addNewItemTitle() {
    return (
      <Text
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor19Medium,
        }}>
        Add New Item
      </Text>
    );
  }

  function sizeTitle() {
    if (productDetailsAddOns[0]?.product_add_on.length >= 1) {
      return (
        <View style={styles.sizeTitleStyle}>
          <Text style={{ ...Fonts.grayColor16Medium }}>Size</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>Price</Text>
        </View>
      );
    }
  }

  function CustmizeItemInfo() {
    return (
      <View style={styles.custmizeItemInfoWrapStyle}>
        <Image
          source={{ uri: productDetailsAddOns[0]?.image }}
          style={{
            width: 80.0,
            height: 80.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
        <View
          style={{
            flex: 1,
            marginVertical: Sizes.fixPadding - 7.0,
            justifyContent: 'space-between',
            marginLeft: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.blackColor16Medium }}>
            {productDetailsAddOns[0]?.name}
          </Text>
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...Fonts.primaryColor20MediumBold }}>
              ${productDetailsAddOns[0]?.price}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  qty > 1 ? setQty(qty - 1) : null;
                }}
                style={{
                  backgroundColor: qty > 1 ? Colors.primaryColor : '#E0E0E0',
                  ...styles.qtyAddRemoveButtonStyle,
                }}>
                <MaterialIcons
                  name="remove"
                  color={qty > 1 ? Colors.whiteColor : Colors.blackColor}
                  size={18}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: Sizes.fixPadding,
                  ...Fonts.blackColor16Medium,
                }}>
                {qty}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setQty(qty + 1)}
                style={{
                  backgroundColor: Colors.primaryColor,
                  ...styles.qtyAddRemoveButtonStyle,
                }}>
                <MaterialIcons name="add" color={Colors.whiteColor} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function coffeeInfo() {
    return (
      <View style={styles.coffeeInfoWrapStyle}>
        <Text style={{ ...Fonts.blackColor19Medium }}>Coffee</Text>
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 5.0,
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor14Medium,
          }}>
          2 items
        </Text>
        {coffees.map(item => (
          <View key={`${item.id}`}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: Sizes.fixPadding * 2.0,
              }}>
              <Image
                source={item.image}
                style={{
                  width: 90.0,
                  height: 100.0,
                  borderRadius: Sizes.fixPadding - 5.0,
                }}
              />
              <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ ...Fonts.blackColor16Medium }}>{item.name}</Text>
                  <MaterialIcons
                    name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={Colors.grayColor}
                    onPress={() => {
                      handleCoffeesUpdate({ id: item.id });
                      ToastAndroid.showWithGravity(
                        !item.isFavourite
                          ? 'Added to Favourite'
                          : 'Remove from Favourite',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        ToastAndroid.CENTER,
                      );
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginVertical: Sizes.fixPadding - 5.0,
                    ...Fonts.grayColor14Regular,
                  }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                    ${item.amount.toFixed(1)}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setShowBottomSheet(true)}
                    style={styles.addIconWrapStyle}>
                    <MaterialIcons
                      name="add"
                      size={17}
                      color={Colors.whiteColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function handleCoffeesUpdate({ id }) {
    const newList = coffees.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, isFavourite: !item.isFavourite };
        return updatedItem;
      }
      return item;
    });
    setCoffees(newList);
  }

  function juiceInfo() {
    return (
      <View style={styles.juiceInfoWrapStyle}>
        {productList?.map(item => (
          <View key={`${item.id}`}>
            {item?.item_category_list.length !== 0 && (
              <>
                <Text style={{ ...Fonts.blackColor19Medium }}>{item?.name}</Text>
                <Text
                  style={{
                    marginBottom: Sizes.fixPadding + 5.0,
                    marginTop: Sizes.fixPadding - 5.0,
                    ...Fonts.grayColor14Medium,
                  }}>
                  {item?.item_category_list.length} items
                </Text>
              </>
            )}

            {item?.item_category_list?.map(item => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: Sizes.fixPadding * 2.0,
                  }}>
                  <Image
                    source={{ uri: item?.items?.image }}
                    style={{
                      width: 90.0,
                      height: 100.0,
                      borderRadius: Sizes.fixPadding - 5.0,
                    }}
                  />
                  <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{ ...Fonts.blackColor16Medium }}>
                        {item?.items?.name}
                      </Text>
                      <MaterialIcons
                        name={
                          item.isFavourite ? 'bookmark' : 'bookmark-outline'
                        }
                        size={22}
                        color={Colors.grayColor}
                        onPress={() => {
                          handleJuicesUpdate({ id: item.id });
                          ToastAndroid.showWithGravity(
                            !item.isFavourite
                              ? 'Added to Favourite'
                              : 'Remove from Favourite',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            ToastAndroid.CENTER,
                          );
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        marginVertical: Sizes.fixPadding - 5.0,
                        ...Fonts.grayColor14Regular,
                      }}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </Text>
                    <TouchableOpacity onPress={() => {
                      productDetails(item?.items);
                    }}>


                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                          ${item?.items?.price}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          //onPress={() => setShowBottomSheet(true)}
                          onPress={() => {
                            productDetails(item?.items);
                          }}
                          style={styles.addIconWrapStyle}>
                          <MaterialIcons
                            name="add"
                            size={17}
                            color={Colors.whiteColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  function handleJuicesUpdate({ id }) {
    const newList = productList.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, isFavourite: !item.isFavourite };
        return updatedItem;
      }
      return item;
    });
    setJuices(newList);
  }

  function popularItemsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.popularItemInfoWrapStyle}>
        {/* <Spinner color={'#fff'} visible={loading} /> */}
        <Image
          source={{ uri: item?.image }}
          style={styles.popularItemImageStyle}
        />
        <MaterialIcons
          name={item.isFavourite ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={Colors.whiteColor}
          style={{ position: 'absolute', right: 10.0, top: 10.0 }}
          onPress={() => {
            handlePopularItemsUpdate({ id: item.id, restaurant_id: item.restaurant_id });
            ToastAndroid.showWithGravity(
              !item.isFavourite
                ? 'Added to Favourite'
                : 'Remove from Favourite',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              ToastAndroid.CENTER,
            );
          }}
        />
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}>
          <Text style={{ ...Fonts.blackColor15Medium }}>{item?.name}</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}>
            {item?.cat_name}
          </Text>
          <TouchableOpacity onPress={() => {
            productDetails(item);
          }}>
            <View
              style={{
                marginTop: Sizes.fixPadding - 7.0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                ${item?.price}
              </Text>
              <View style={styles.addIconWrapStyle}>
                <MaterialIcons
                  name="add"
                  size={17}
                  color={Colors.whiteColor}
                  onPress={() => {
                    productDetails(item);
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding,
        }}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ ...Fonts.blackColor19Medium }}>Popular Items</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PopularItems')}>
            <Text style={{ ...Fonts.primaryColor16Medium }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={popularItemList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  function handlePopularItemsUpdate({ id, restaurant_id }) {
    const newList = popularItemList.map(item => {
      if (item.id === id) {
        const formData = new FormData();
        formData.append('item_id', id);
        formData.append('restaurant_id', restaurant_id);
        Post(Constants.favouriteFood, formData).then(
          async res => {
            if (res.status === 200) {

              const updatedItem = { ...item, isFavourite: !item.isFavourite };
              return updatedItem;
            }
          },
          err => {
            //   this.setState({ loading: false });
            console.log(err.response.data);
          },
        );
      }
      return item;
    });
    console.log("newList=>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newList);
    setPopularItems(newList);
  }

};

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
  },
  popularItemInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  popularItemImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  addIconWrapStyle: {
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
  },
  snackBarStyle: {
    position: 'absolute',
    bottom: -10.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: '#333333',
    elevation: 0.0,
  },
  animatedView: {
    backgroundColor: '#333333',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coffeeInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 3.0,
  },
  addToCartAndItemsInfoWrapStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  radioButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
  },
  optionWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizesWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
  sizeTitleStyle: {
    backgroundColor: Colors.bodyBackColor,
    padding: Sizes.fixPadding,
    flexDirection: 'row',
    marginBottom: Sizes.fixPadding,
    justifyContent: 'space-between',
  },
  custmizeItemInfoWrapStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: Sizes.fixPadding,
  },
  qtyAddRemoveButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetOpenCloseDividerStyle: {
    backgroundColor: Colors.grayColor,
    height: 4.0,
    borderRadius: Sizes.fixPadding,
    width: 40.0,
    alignSelf: 'center',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  addressWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  juiceInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
});

export default Products;
