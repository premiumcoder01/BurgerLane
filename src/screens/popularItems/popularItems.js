import React, { useEffect, useState } from 'react';
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
import Constants from '../../helpers/Constant';
import { Post } from '../../helpers/Service';
import Spinner from '../../components/Spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const PopularItems = () => {
  const navigation = useNavigation();
  const [popularItems1, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const popularItemsList = () => {
    Post(Constants.popularList).then(
      async res => {
        if (res.Status === 200) {
          setPopularItems(res.data.popularItems);
        }
        setLoading(false);
      },
      err => {
        setLoading(false);
        console.log(err.response.data);
      },
    );
  };

  useEffect(() => {
    popularItemsList();
  }, []);

  function handleJuicesUpdate({ id }) {
    const newList = popularItems1.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, isFavourite: !item?.isFavourite };
        return updatedItem;
      }
      return item;
    });
    setPopularItems(newList);
  }

  const renderItem = ({ item }) => (
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
          <Text style={{ ...Fonts.blackColor16Medium }}>{item?.items?.name}</Text>
          <MaterialIcons
            name={item?.isFavourite ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={Colors.grayColor}
            onPress={() => {
              handleJuicesUpdate({ id: item.id });
              ToastAndroid.showWithGravity(
                !item?.isFavourite
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
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text>
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
            //   onPress={() => setShowBottomSheet(true)}
            style={styles.addIconWrapStyle}>
            <MaterialIcons name="add" size={17} color={Colors.whiteColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  return (
    <View>
      <Spinner color={'#fff'} visible={loading} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={{ ...Fonts.blackColor22Medium }}>Product List</Text>
        <View />
      </View>
      <FlatList
        data={popularItems1}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: Sizes.fixPadding,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PopularItems;

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    padding: Sizes.fixPadding,
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
