import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';

const CustomSheet = (props) => {
  const toggleModal = () => {
    props.setModalVisible(!props.isModalVisible);
  };
  return (
    <Modal
      onBackdropPress={() => props.setModalVisible(false)}
      onBackButtonPress={() => props.setModalVisible(false)}
      isVisible={props.isModalVisible}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={900}
      backdropOpacity={0.5}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={500}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.barIcon} />
        {props.render}
      </View>
    </Modal>
  );
};

export default CustomSheet;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
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
