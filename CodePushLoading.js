import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import codePush from 'react-native-code-push';

const CodePushLoading = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState('');

  useEffect(() => {
    const updateDialog = {
      title: 'Actualización  disponible',
      mandatoryContinueButtonLabel: 'Continuar',
      mandatoryUpdateMessage:
        'Hay una actualización disponible que debe instalarse.',
      optionalUpdateMessage:
        'Hay una actualización disponible. ¿Deseas instalarlo?',
      optionalIgnoreButtonLabel: 'Ignorar',
      optionalInstallButtonLabel: 'Instalar'
    };
    
    codePush.sync(
      {updateDialog, installMode: codePush.InstallMode.IMMEDIATE},
      status => {
        switch (status) {
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            // Show "downloading" modal
            console.log('Downloading modal', );
            // codePush.InstallMode.IMMEDIATE
            setModalVisible(true);
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            // Hide "downloading" modal
            console.log('Hide downloading modal');
            setModalVisible(false);
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        /* Update download modal progress */
        console.log(receivedBytes + ' of ' + totalBytes + ' received.');
        let percent = Math.round((receivedBytes / totalBytes) * 100);
        setLoadingPercent(percent);
      },
    );
    
  }, []);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Descargando...</Text>
            <Text style={styles.modalText}>{loadingPercent + ' %'}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CodePushLoading;
