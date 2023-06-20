import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RadioButton} from 'react-native-paper';
import Toaster from '../../components/Toaster';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geocode from 'react-geocode';
import Spinner from '../../components/Spinner';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const AddDeliveryAddress = props => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [house_no, setHouseNo] = useState('');
  const [area, setArea] = useState({
    title: 'Select',
    type: '',
    location: '',
  });
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address_type, setAddressType] = React.useState('Home');
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getLocation();
      setArea({...area, title: 'Select'});
    });
    return () => {
      willFocusSubscription;
    };
  }, []);

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const GooglePlacesInput = async text => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=AIzaSyDkAmiEffMR4r0r9zziv66pyEGNJSSnGN0&input=${text}`;
    try {
      let check = true;
      if (Platform.OS === 'android') {
        check = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }

      if (check) {
        setShowList(true);
        const result = await axios.request({
          method: 'post',
          url: apiUrl,
        });
        if (result) {
          const {
            data: {predictions},
          } = result;
          setPredictions(predictions);
          setShowList(true);
        }
      } else {
        getLocation();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkLocation = async add => {
    try {
      Geocode.setApiKey('AIzaSyDkAmiEffMR4r0r9zziv66pyEGNJSSnGN0');
      if (add) {
        Geocode.fromAddress(add).then(
          response => {
            console.log(response.results[0].geometry.location);
            setLocation(response.results[0].geometry.location);
          },
          error => {
            console.error(error);
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };



  const submit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('pincode', pincode);
    formData.append('house_no', house_no);
    formData.append('area', area.location);
    formData.append('landmark', landmark);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('address_type', address_type);
    Post(Constants.post_address, formData).then(
      async res => {
        if (res.status === 200) {
          Toaster('Successfully added address');
          props.navigation.push('Discover', {location: location});
        }
        setLoading(false);
      },
      err => {
        setLoading(false);
        console.log('error aagya h ' + err.response.data);
      },
    );
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Spinner color={'#fff'} visible={loading} />
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={24}
          onPress={() => props.navigation.pop()}
          style={{marginVertical: Sizes.fixPadding + 5.0}}
        />
        <Text
          style={{
            ...Fonts.blackColor22Medium,
            marginVertical: Sizes.fixPadding + 1.0,
          }}>
          Add Delivery Address
        </Text>
        <View />
      </View>
      <ScrollView>
        <Text style={styles.labelStyle}>Name</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={name}
          onChangeText={actualData => setName(actualData)}
        />
        <Text style={styles.labelStyle}>Phone</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          style={styles.input}
          value={phone}
          maxLength={12}
          onChangeText={actualData => setPhone(actualData)}
        />
        <Text style={styles.labelStyle}>Pincode</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={pincode}
          onChangeText={actualData => setPincode(actualData)}
        />
        <Text style={styles.labelStyle}>Flat,House no.</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={house_no}
          onChangeText={actualData => setHouseNo(actualData)}
        />
        <Text style={styles.labelStyle}>Area,Street,Sector</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={area.location}
          // onChangeText={actualData => setArea(actualData)}
          onChangeText={text => {
            GooglePlacesInput(text);
            setArea({...area, location: text});
          }}
        />

        {prediction != '' && showList && (
          <View style={prediction && styles.list}>
            {prediction.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgrey',
                  marginHorizontal: 20,
                  paddingBottom: 5,
                }}>
                <Ionicons
                  name="location"
                  size={18}
                  color="#1D1D1D"
                  style={{marginHorizontal: 5}}
                />
                <Text
                  style={{color: 'black'}}
                  onPress={() => {
                    console.log(item);
                    checkLocation(item.description);
                    setShowList(false);
                    setArea({...area, location: item.description});
                  }}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.labelStyle}>Landmark</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={landmark}
          onChangeText={actualData => setLandmark(actualData)}
        />
        <Text style={styles.labelStyle}>City</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={city}
          onChangeText={actualData => setCity(actualData)}
        />
        <Text style={styles.labelStyle}>State</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={state}
          onChangeText={actualData => setState(actualData)}
        />
        <Text style={styles.labelStyle}>Address Type</Text>
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
              value="Home"
              color="#000000"
              status={address_type === 'Home' ? 'checked' : 'unchecked'}
              onPress={() => setAddressType('Home')}
            />
            <Text
              onPress={() => setAddressType('Home')}
              style={{marginTop: 0, color: '#000000'}}>
              Home
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
              value="Office"
              color="#000000"
              status={address_type === 'Office' ? 'checked' : 'unchecked'}
              onPress={() => setAddressType('Office')}
            />
            <Text
              onPress={() => setAddressType('Office')}
              style={{marginTop: 0, color: '#000000'}}>
              Office
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (
              !name ||
              !phone ||
              !pincode ||
              !house_no ||
              !area ||
              !city ||
              !state
            ) {
              Toaster('Please fill all the required fields');
              return;
            } else {
              submit();
            }
          }}>
          <Text style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddDeliveryAddress;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 3,
    marginHorizontal: 20,
    marginVertical: 5,
    color: '#000000',
  },
  labelStyle: {
    color: '#000000',
    marginHorizontal: 25,
    marginTop: 5,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#F2647C',
    paddingTop: 12,
    paddingBottom: 15,
    borderRadius: 25,
    elevation: 6,
    margin: 20,
    marginBottom: 50,
  },
});
