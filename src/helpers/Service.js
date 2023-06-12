import axios from 'axios';
import Constants from './Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Post = async (url, data) => {
  // console.log('formData', data);
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  // console.log(`Bearer ${userDetail?.access_token || ''}`);
  // console.log(Constants.baseUrl + url, data);
  return axios
    .post(Constants.baseUrl + url, data, {
      headers: {
        Authorization: `Bearer ${userDetail?.access_token || ''}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      // console.log('responces user ka ', res.data);
      return res.data;
    })
    .catch(err => {
      console.log('err', err.response.data);
      return err;
    });
};

const PostGet = async url => {
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  return axios
    .post(Constants.baseUrl + url, {
      headers: {
        Authorization: `Bearer ${userDetail?.access_token || ''}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      // console.log('res', res);
      return res.data;
    })
    .catch(err => {
      console.log('err', err.response.data);
      return err;
    });
};

const GetApi = async (url, data) => {
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  return axios
    .get(Constants.baseUrl + url, {
      data,
      headers: {
        Authorization: `Bearer ${userDetail?.access_token || ''}`,
      },
    })
    .then(res => {
      // console.log('res', res.data);
      return res.data;
    })
    .catch(err => {
      console.log('err', err.response.data);
      return err;
    });
};

export {Post, GetApi, PostGet};
