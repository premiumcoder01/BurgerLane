import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  BackHandler,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GetApi} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import Spinner from '../../components/Spinner';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import Lottie from 'lottie-react-native';
import Modal from 'react-native-modal';
import paymentData from './paymentData';

const {width} = Dimensions.get('screen');

const ConfirmOrder = () => {
  console.log(paymentData);
  const gst = 30;
  const deliveryCharge = 100;
  const navigation = useNavigation();
  const [cardDetail, setCardDetail] = useState({});
  const [address, setAddress] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [couponsCode, setCouponCode] = useState('');
  const [orderId, setOrderId] = useState('');
  const [select, setSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const orderDetails = () => {
    setLoading(true);
    GetApi(Constants.orderDetails).then(
      async res => {
        if (res.status === 200) {
          console.log(
            'data--------------',
            res?.data?.cart_detail?.add_on_item,
          );
          setCardDetail(res?.data?.cart_detail);
          setAddress(res?.data?.address);
          setTotalAmount(res?.data?.total_amount);
          setOrderId(res?.data?.order_id);
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
        console.log(err.response.data);
      },
    );
  };

  useEffect(() => {
    orderDetails();
  }, []);

  const handleCheckout = () => {
    setModalVisible(true);
    setTimeout(() => {
      navigation.navigate('BottomTabBar');
    }, 3000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Spinner color={'#fff'} visible={loading} />
      {/* header */}
      <View
        style={{
          //   flex: 1,
          margin: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={{...Fonts.blackColor16Medium}}>Confirm Order</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...Fonts.grayColor16Medium}}>ID:</Text>
          <Text style={{...Fonts.blackColor16Medium, marginLeft: 5}}>
            {orderId}
          </Text>
        </View>
      </View>
      {/* MAIN COMPONENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Address section */}
        <View style={{marginHorizontal: 20, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{...Fonts.blackColor17Medium}}>Delivery to</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddDeliveryAddress');
              }}>
              <Text style={{...Fonts.primaryColor14Medium}}>
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.whiteColor,
              elevation: 4,
              marginVertical: 10,
              flexDirection: 'row',
              borderRadius: 15,
            }}>
            <MapView
              style={{width: 100, height: 100}}
              showsCompass
              showsMyLocationButton
              initialRegion={{
                latitude: 28.627981,
                longitude: 77.3648567,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                draggable
                coordinate={{
                  latitude: 28.627981,
                  longitude: 77.3648567,
                }}
              />
            </MapView>
            <View
              style={{
                marginVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="location-on"
                  color={Colors.blackColor}
                  size={20}
                  onPress={() => navigation.goBack()}
                  style={{marginLeft: Sizes.fixPadding * 2.0}}
                />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding - 2.0,
                    ...Fonts.blackColor14Regular,
                  }}>
                  {address?.house_no}, {address?.area}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="person"
                  color={Colors.blackColor}
                  size={20}
                  onPress={() => navigation.goBack()}
                  style={{marginLeft: Sizes.fixPadding * 2.0}}
                />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding - 2.0,
                    ...Fonts.blackColor14Regular,
                  }}>
                  {address?.name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="phone"
                  color={Colors.blackColor}
                  size={20}
                  onPress={() => navigation.goBack()}
                  style={{marginLeft: Sizes.fixPadding * 2.0}}
                />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding - 2.0,
                    ...Fonts.blackColor14Regular,
                  }}>
                  {address?.phone}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* dilivery time section  */}
        <View
          style={{
            padding: 10,
            backgroundColor: Colors.whiteColor,
            elevation: 5,
            flexDirection: 'row',
            margin: 20,
            marginTop: 10,
            borderRadius: 15,
            alignItems: 'center',
          }}>
          <MaterialIcons name="timelapse" color={Colors.green} size={24} />
          <Text style={{...Fonts.blackColor14Regular, marginLeft: 10}}>
            Delivery in{' '}
            <Text style={{...Fonts.blackColor14Regular, fontWeight: 'bold'}}>
              35-40 min
            </Text>
          </Text>
        </View>

        {/* order info */}
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
          <Text style={{...Fonts.grayColor16Medium, textAlign: 'center'}}>
            ITEM(S) ADDED
          </Text>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
        </View>
        <View
          style={{
            padding: 10,
            margin: 20,
            marginTop: 10,
            backgroundColor: Colors.whiteColor,
            elevation: 4,
            borderRadius: 15,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: cardDetail?.item_detail?.image}}
              style={{
                width: 80,
                height: 80,
                borderRadius: Sizes.fixPadding,
              }}
            />
            <View style={{marginLeft: Sizes.fixPadding + 5.0}}>
              <Text style={{...Fonts.blackColor16Medium}}>
                {cardDetail?.item_detail?.name}
              </Text>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{...Fonts.blackColor14Regular}}>
                  Price : {cardDetail?.item_detail?.price}
                </Text>
              </View>
            </View>
          </View>
          {/* qty */}
          <View
            style={{
              flexDirection: 'row',
              //   alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View>
              <Text style={{...Fonts.blackColor16Medium}}>
                {cardDetail?.item_detail?.name}
              </Text>
              <Text style={{...Fonts.blackColor14Regular}}>
                {cardDetail?.item_detail?.price} * {cardDetail?.quantity}
              </Text>
            </View>

            <Text style={{...Fonts.blackColor15Regular, fontWeight: 'bold'}}>
              ${cardDetail?.item_detail?.price * cardDetail?.quantity}
            </Text>
          </View>
          {/* addon items */}
          <View>
            <Text
              style={{
                ...Fonts.darkPrimaryColor15Medium,
                textAlign: 'center',
                fontSize: 13,
              }}>
              Add on Items
            </Text>
            {cardDetail &&
              cardDetail?.add_on_item?.map(item => {
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={{...Fonts.blackColor16Medium}}>
                        {item?.add_on_item?.title}
                      </Text>
                      <Text style={{...Fonts.blackColor14Regular}}>
                        {item?.add_on_item?.price} * 1
                      </Text>
                    </View>

                    <Text
                      style={{
                        ...Fonts.blackColor15Regular,
                        fontWeight: 'bold',
                      }}>
                      ${item?.add_on_item?.price}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
        {/* coupons */}
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
          <Text style={{...Fonts.grayColor16Medium, textAlign: 'center'}}>
            SAVING CORNER
          </Text>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
        </View>
        <View
          style={{
            margin: 20,
            backgroundColor: Colors.whiteColor,
            padding: 10,
            elevation: 4,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Lottie
            source={require('../../../assets/images/coupons.json')}
            autoPlay
            loop
            style={{height: 40, width: 40}}
          />
          <TextInput
            value={couponsCode}
            onChangeText={e => setCouponCode(e)}
            placeholder="Type coupon code here"
            placeholderTextColor={Colors.grayColor}
            style={{
              width: '60%',
              borderBottomWidth: 0.5,
              borderColor: Colors.grayColor,
              height: 40,
              color: Colors.blackColor,
            }}
          />
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor:
                couponsCode.length !== 0
                  ? Colors.primaryColor
                  : Colors.grayColor,
              borderRadius: 10,
            }}
            disabled={couponsCode.length !== 0 ? false : true}>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                color: Colors.whiteColor,
                fontWeight: 'bold',
              }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
        {/* bill summary */}
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
          <Text style={{...Fonts.grayColor16Medium, textAlign: 'center'}}>
            BILL SUMMARY
          </Text>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
        </View>
        <View
          style={{
            margin: 20,
            backgroundColor: Colors.whiteColor,
            padding: 10,
            elevation: 4,
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.blackColor14Regular, fontWeight: 'bold'}}>
              Sub Total
            </Text>
            <Text style={{...Fonts.blackColor14Regular, fontWeight: 'bold'}}>
              $ {totalAmount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
              }}>
              Gst
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              $ {gst}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
              }}>
              Delivery Charge
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              $ {deliveryCharge}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.grayColor,
              marginVertical: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              Grand Total
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              $ {totalAmount + gst + deliveryCharge}
            </Text>
          </View>
        </View>

        {/* Preferred Payment */}
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
          <Text style={{...Fonts.grayColor16Medium, textAlign: 'center'}}>
            Preferred Payment
          </Text>
          <View
            style={{width: 80, height: 1, backgroundColor: Colors.grayColor}}
          />
        </View>
        <View
          style={{
            margin: 20,
            padding: 10,
            backgroundColor: Colors.whiteColor,
            borderRadius: 10,
            elevation: 4,
          }}>
          {paymentData.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <MaterialIcons
                  name={
                    select === index
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  color={
                    select === index ? Colors.primaryColor : Colors.grayColor
                  }
                  size={24}
                  onPress={() => setSelect(index)}
                />
                <View
                  style={{
                    marginRight: 10,
                  }}>
                  <Image
                    source={item.image}
                    style={{height: 50, width: 50, borderRadius: 100}}
                    resizeMode="contain"
                  />
                </View>
                <Text style={{...Fonts.blackColor15Medium}}>{item.title}</Text>
              </View>
            );
          })}
        </View>

        {/* Pay button */}
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: Colors.primaryColor,
            borderRadius: 10,
            marginHorizontal: 20,
            marginBottom: 10,
          }}
          onPress={() => handleCheckout()}>
          <Text
            style={{
              color: Colors.whiteColor,
              ...Fonts.whiteColor15Medium,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}>
            Place Order
          </Text>
        </TouchableOpacity>
        <Modal
          onBackButtonPress={() => setModalVisible(false)}
          isVisible={isModalVisible}
          swipeDirection="down"
          onSwipeComplete={toggleModal}
          animationIn="fadeIn"
          animationOut="slideOutDown"
          animationInTiming={600}
          backdropOpacity={0.5}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          style={{
            flex: 1,
            margin: 0,
          }}>
          <View
            style={{
              backgroundColor: Colors.primaryColor,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Lottie
              source={require('../../../assets/images/thanks.json')}
              autoPlay
              loop
              style={{height: 150, width: 150}}
            />
            <Text style={{...Fonts.whiteColor22Medium}}>
              Your order has been placed..
            </Text>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({});
