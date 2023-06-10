import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import {Colors} from '../../constants/styles';
import {SafeAreaView} from 'react-native';
import {StatusBar} from 'react-native';
import Spinner from '../../components/Spinner';
import { useState } from 'react';

const {width} = Dimensions.get('screen');

const intialAmount = 2.5;

const Discover = () => {
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Spinner color={'#fff'} visible={loading} />
    </SafeAreaView>
  );
};

export default Discover;

const styles = StyleSheet.create({});
