import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, createRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import Toaster from '../../components/Toaster';
import { GetApi, Post } from '../../helpers/Service';
import Constants from '../../helpers/Constant';
import Spinner from '../../components/Spinner';
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditDeliveryAddress = props => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [house_no, setHouseNo] = useState('');
    const [area, setArea] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address_type, setAddressType] = React.useState('Home');
    const [loading, setLoading] = useState(false);
    const [addressId, setAddressId] = useState();

    useEffect(() => {
        setAddressId(props?.route?.params?.addressId);
        if (addressId != undefined) {
            getAddressDetail();
        }
    }, [addressId]);

    const getAddressDetail = () => {
        setLoading(true);
        GetApi(Constants.get_address_detail + '/' + addressId).then(
            async res => {
                setLoading(false);
                if (res.status == 200) {
                    console.log("address-detail");
                    console.log(res.data);
                    setName(res.data.name);
                    setPhone(res.data.phone);
                    setPincode(res.data.pincode);
                    setArea(res.data.area);
                    setHouseNo(res.data.house_no);
                    setLandmark(res.data.landmark);
                    setCity(res.data.city);
                    setState(res.data.state);
                    setAddressType(res.data.address_type);

                }
            },
            err => {
                setLoading(false);
                console.log(err);
            },
        );
    };

    const submit = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('pincode', pincode);
        formData.append('house_no', house_no);
        formData.append('area', area);
        formData.append('landmark', landmark);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('address_type', address_type);
        formData.append('address_id', addressId);
        Post(Constants.update_address, formData).then(
            async res => {
                if (res.status === 200) {
                    //this.props.navigation.pop()
                    Toaster('Successfully updated address');
                    props.navigation.push('BottomTabBar');
                    //this.setState({ offerList: res?.data?.restaurant });
                }
                setLoading(false);
            },
            err => {
                setLoading(false);
                console.log(err.response.data);
            },
        );
    }

    return (
        <View style={{ backgroundColor: "#fff", height: "100%" }}>
            <Spinner color={'#fff'} visible={loading} />
            <ScrollView>
                <View style={{
                    backgroundColor: Colors.whiteColor,
                    paddingHorizontal: Sizes.fixPadding * 2.0,
                    flexDirection: 'row',
                    //justifyContent: 'space-between',
                }}>
                    <MaterialIcons
                        name="arrow-back"
                        color={Colors.blackColor}
                        size={24}
                        onPress={() => props.navigation.pop()}
                        style={{ marginVertical: Sizes.fixPadding + 5.0, marginRight: 24 }}
                    />
                    <Text style={{ ...Fonts.blackColor22Medium, marginVertical: Sizes.fixPadding + 1.0 }}>
                        Edit Delivery Address
                    </Text>
                </View>
                <Text style={styles.labelStyle}>Name</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={name}
                    onChangeText={(actualData) => setName(actualData)}
                />
                <Text style={styles.labelStyle}>Phone</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType='numeric'
                    style={styles.input}
                    value={phone}
                    maxLength={12}
                    onChangeText={(actualData) => setPhone(actualData)}
                />
                <Text style={styles.labelStyle}>Pincode</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={pincode}
                    onChangeText={(actualData) => setPincode(actualData)}
                />
                <Text style={styles.labelStyle}>Flat,House no.</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={house_no}
                    onChangeText={(actualData) => setHouseNo(actualData)}
                />
                <Text style={styles.labelStyle}>Area,Street,Sector</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={area}
                    onChangeText={(actualData) => setArea(actualData)}
                />
                <Text style={styles.labelStyle}>Landmark</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={landmark}
                    onChangeText={(actualData) => setLandmark(actualData)}
                />
                <Text style={styles.labelStyle}>City</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={city}
                    onChangeText={(actualData) => setCity(actualData)}
                />
                <Text style={styles.labelStyle}>State</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    value={state}
                    onChangeText={(actualData) => setState(actualData)}
                />
                <Text style={styles.labelStyle}>Address Type</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row" }}>
                        <RadioButton
                            value="Home"
                            color='#000000'
                            status={address_type === 'Home' ? 'checked' : 'unchecked'}
                            onPress={() => setAddressType('Home')}
                        />
                        <Text onPress={() => setAddressType('Home')} style={{ marginTop: 6, color: '#000000' }}>Home</Text>

                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <RadioButton
                            value="Office"
                            color='#000000'
                            status={address_type === 'Office' ? 'checked' : 'unchecked'}
                            onPress={() => setAddressType('Office')}
                        />
                        <Text onPress={() => setAddressType('Office')} style={{ marginTop: 6, color: '#000000' }}>Office</Text>

                    </View>

                </View>
                <TouchableOpacity style={styles.addBtn}
                    onPress={() => {
                        if (!name || !phone || !pincode || !house_no || !area || !city || !state) {
                            Toaster('Please fill all the required fields');
                            return;
                        } else {
                            submit();

                        }
                    }}>
                    <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>Update</Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    )
}

export default EditDeliveryAddress

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#F0F0F0",
        padding: 10,
        borderRadius: 4,
        elevation: 2,
        shadowColor: "#f7f7f7",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        color: "#000000",

    },
    labelStyle: {
        color: "#000000",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },
    addBtn: {
        backgroundColor: "#FF69B4",
        paddingTop: 12,
        paddingBottom: 15,
        borderColor: "#9AC96D",
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 130,
    },

})