import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  BackHandler,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts, Colors, Sizes} from '../../constants/styles';
import Feather from 'react-native-vector-icons/Feather';
import Dialog from 'react-native-dialog';
import {Dimensions} from 'react-native';
import {BottomSheet} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { TransitionPresets } from 'react-navigation-stack';
import {Component} from 'react';
import {Post} from '../../helpers/Service';
import Constants from '../../helpers/Constant';
// import { withNavigation } from "react-navigation";
import Spinner from '../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

const {width} = Dimensions.get('screen');

class EditProfileScreen extends Component {
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    this.requestCameraPermission();
    this.requestGalleryPermission();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton = () => {
    this.props.navigation.pop();
    return true;
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Gallery Permission',
          message: 'App needs access to your Gallery ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.WRITE_EXTERNAL_STORAGE) {
        console.log('Gallery permission given');
      } else {
        console.log('Gallery permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  userDetail = this.props.route.params.item;

  render() {
    return (
      <EditProfile
        navigation={this.props.navigation}
        userDetail={this.userDetail}
      />
    );
  }
}

const EditProfile = ({navigation, userDetail}) => {
  const [fullNameDialog, setFullnameDialog] = useState(false);
  const [lastNameDialog, setLastnameDialog] = useState(false);
  const [fullName, setFullName] = useState(userDetail?.first_name);
  const [lastName, setLastName] = useState(userDetail?.last_name);

  const [changeText, setChangeText] = useState(fullName);
  const [changeText1, setChangeText1] = useState(lastName);

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState('123456');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePassword, setChangePassword] = useState(password);

  const [phoneDialog, setPhoneDialog] = useState(false);
  const [phone, setPhone] = useState(userDetail?.phone);
  const [changePhone, setChangePhone] = useState(phone);

  const [emialDialog, setEmailDialog] = useState(false);
  const [email, setEmail] = useState(userDetail?.email);
  const [changeEmail, setChangeEmail] = useState(email);

  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState({});
  const [fileData, setFileData] = useState('');
  const [fileUri, setFileUri] = useState(userDetail?.profile_image);

  const launchCamera = () => {
    setIsBottomSheet(false);
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      console.log('Response = ', response.assets[0]);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        // alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        setFilePath(response.assets[0]);
        setFileData(response.assets[0]?.fileName);
        setFileUri(response.assets[0]?.uri);
      }
    });
  };

  const launchImageLibrary = () => {
    setIsBottomSheet(false);
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        setFilePath(response.assets[0]);
        setFileData(response.assets[0]?.fileName);
        setFileUri(response.assets[0]?.uri);
      }
    });
  };

  const updateProfile = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    let userDetail = JSON.parse(user);
    setLoading(true);
    const formData1 = new FormData();

    formData1.append('first_name', fullName);
    formData1.append('last_name', lastName);
    formData1.append('email', email);
    formData1.append('profile_image', {
      uri: filePath?.uri,
      type: filePath?.type,
      name: filePath?.fileName,
    });
    formData1.append('user_id', userDetail?.user?.id);

    Post(Constants.updateProfile, formData1).then(
      async res => {
        if (res.status === 200) {
          ToastAndroid.show(res?.message, ToastAndroid.LONG);
        }
        setLoading(false);
      },
      err => {
        setLoading(false);
        console.log(err.response.data);
      },
    );
  };

  const changePasswordApi = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    let userDetail = JSON.parse(user);
    setLoading(true);
    const formData1 = new FormData();

    formData1.append('user_id', userDetail?.user?.id);
    formData1.append('old_password', oldPassword);
    formData1.append('new_password', newPassword);
    formData1.append('confirm_password', changePassword);

    Post(Constants.updatePassword, formData1).then(
      async res => {
        if (res.status === 200) {
          setPasswordDialog(false);
          ToastAndroid.show(JSON.stringify(res?.message), ToastAndroid.LONG);
        }
        setLoading(false);
      },
      err => {
        setLoading(false);
        console.log(err.response.data);
      },
    );
  };

  function backArrowAndSave() {
    return (
      <View style={styles.backArrowAndSaveContainerStyle}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="black"
          onPress={() => navigation.pop()}
        />

        <TouchableOpacity activeOpacity={0.9} onPress={() => updateProfile()}>
          <Text style={{...Fonts.blueColor17Medium}}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function profilePhoto() {
    return (
      <View style={styles.profilePhotoWrapStyle}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={{uri: fileUri ? fileUri : null}}
            style={styles.profilePhotoStyle}
            resizeMode="cover"
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsBottomSheet(true)}
            style={styles.addPhotoContainerStyle}>
            <Ionicons name="ios-add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function formData({title, value}) {
    return (
      <View style={styles.formDataContainerStyle}>
        <View style={{width: width / 3.0}}>
          <Text style={{...Fonts.grayColor16Medium}}>{title}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width / 1.85,
          }}>
          <Text style={{...Fonts.blackColor17Medium}}>{value}</Text>
          <Feather name="chevron-right" size={24} color={Colors.grayColor} />
        </View>
      </View>
    );
  }

  function editFullNameDialog() {
    return (
      <Dialog.Container
        visible={fullNameDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}>
            Change FullName
          </Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1.0,
              width: '100%',
            }}>
            <TextInput
              value={changeText}
              onChangeText={value => setChangeText(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setFullnameDialog(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...Fonts.blackColor16Medium}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setFullnameDialog(false);
                setFullName(changeText);
              }}
              style={styles.okButtonStyle}>
              <Text style={{...Fonts.whiteColor16Medium}}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function editLastNameDialog() {
    return (
      <Dialog.Container
        visible={lastNameDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}>
            Change FullName
          </Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1.0,
              width: '100%',
            }}>
            <TextInput
              value={changeText1}
              onChangeText={value => setChangeText1(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setLastnameDialog(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...Fonts.blackColor16Medium}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setLastnameDialog(false);
                setLastName(changeText1);
              }}
              style={styles.okButtonStyle}>
              <Text style={{...Fonts.whiteColor16Medium}}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function editPasswordDialog() {
    return (
      <Dialog.Container
        visible={passwordDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}>
            Change Your Password
          </Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              width: '100%',
            }}>
            <TextInput
              onChangeText={value => setOldPassword(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
              placeholder="Old Password"
              secureTextEntry={true}
            />
          </View>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              width: '100%',
              marginTop: Sizes.fixPadding,
            }}>
            <TextInput
              onChangeText={value => setNewPassword(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
              placeholder="New Password"
              secureTextEntry={true}
            />
          </View>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              width: '100%',
              marginTop: Sizes.fixPadding,
            }}>
            <TextInput
              onChangeText={value => setChangePassword(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
              placeholder="Confirm New Password"
              secureTextEntry={true}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPasswordDialog(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...Fonts.blackColor16Medium}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                changePasswordApi();
              }}
              style={styles.okButtonStyle}>
              <Text style={{...Fonts.whiteColor16Medium}}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function editPhoneDialog() {
    return (
      <Dialog.Container
        visible={phoneDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}>
            Change Phone Number
          </Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1.0,
              width: '100%',
            }}>
            <TextInput
              value={changePhone}
              onChangeText={value => setChangePhone(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
              keyboardType="numeric"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20.0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPhoneDialog(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...Fonts.blackColor16Medium}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPhoneDialog(false);
                setPhone(changePhone);
              }}
              style={styles.okButtonStyle}>
              <Text style={{...Fonts.whiteColor16Medium}}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function editEmailDialog() {
    return (
      <Dialog.Container
        visible={emialDialog}
        contentStyle={styles.dialogContainerStyle}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              paddingBottom: Sizes.fixPadding * 3.0,
            }}>
            Change Email
          </Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1.0,
              width: '100%',
            }}>
            <TextInput
              value={changeEmail}
              onChangeText={value => setChangeEmail(value)}
              style={{
                ...Fonts.blackColor16Medium,
                paddingBottom: Sizes.fixPadding,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Sizes.fixPadding * 2.0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setEmailDialog(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...Fonts.blackColor16Medium}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setEmailDialog(false);
                setEmail(changeEmail);
              }}
              style={styles.okButtonStyle}>
              <Text style={{...Fonts.whiteColor16Medium}}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function showBottomSheet() {
    return (
      <BottomSheet
        isVisible={isBottomSheet}
        containerStyle={{backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsBottomSheet(false)}
          style={styles.bottomSheetStyle}>
          <Text
            style={{
              ...Fonts.blackColor19Medium,
              textAlign: 'center',
              marginBottom: Sizes.fixPadding * 2.0,
            }}>
            Choose Option
          </Text>

          <TouchableOpacity
            onPress={() => launchCamera()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="ios-camera" size={20} color="#4C4C4C" />
            <Text
              style={{
                ...Fonts.blackColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => launchImageLibrary()}
            style={{flexDirection: 'row', marginTop: Sizes.fixPadding * 2.0}}>
            <MaterialIcons name="photo-album" size={20} color="#4C4C4C" />
            <Text
              style={{
                ...Fonts.blackColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}>
              Upload from Gallery
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Spinner color={'#fff'} visible={loading} />
      <View style={{flex: 1}}>
        {backArrowAndSave()}
        {profilePhoto()}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setFullnameDialog(true);
            setChangeText(fullName);
          }}>
          {formData({title: 'Full Name', value: fullName})}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setLastnameDialog(true);
            setChangeText1(lastName);
          }}>
          {formData({title: 'Last Name', value: lastName})}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setPasswordDialog(true);
            setChangePassword(password);
          }}>
          {formData({title: 'Password', value: '******'})}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setChangePhone(phone);
            setPhoneDialog(true);
          }}>
          {formData({title: 'Phone', value: phone})}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setChangeEmail(email);
            setEmailDialog(true);
          }}>
          {formData({title: 'Email', value: email})}
        </TouchableOpacity>
        {editFullNameDialog()}
        {editLastNameDialog()}
        {editPasswordDialog()}
        {editPhoneDialog()}
        {editEmailDialog()}
        {showBottomSheet()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backArrowAndSaveContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: Sizes.fixPadding * 2.0,
    marginRight: Sizes.fixPadding,
    marginTop: Sizes.fixPadding + 5.0,
  },
  addPhotoContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1.0,
    backgroundColor: '#FF9800',
    height: 25.0,
    width: 25.0,
    borderRadius: Sizes.fixPadding + 2.0,
    position: 'absolute',
    bottom: 5.0,
    right: 5.0,
  },
  profilePhotoWrapStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50.0,
    marginBottom: Sizes.fixPadding * 3.0,
  },
  formDataContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Sizes.fixPadding - 5.0,
    height: 65.0,
    borderColor: '#F6F6F6',
    elevation: 1,
    marginHorizontal: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding + 5.0,
    borderWidth: 1.0,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: Sizes.fixPadding,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 90,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    flex: 0.45,
    backgroundColor: '#E0E0E0',
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 5.0,
  },
  okButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Sizes.fixPadding + 5.0,
  },
  bottomSheetStyle: {
    backgroundColor: 'white',
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 2.0,
  },
  profilePhotoStyle: {
    height: 100.0,
    width: 100.0,
    borderRadius: Sizes.fixPadding - 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
});

// EditProfileScreen.navigationOptions = () => {
//     return {
//         header: () => null,
//         ...TransitionPresets.SlideFromRightIOS,
//     }
// }

export default EditProfileScreen;
