import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ConnectionP2P } from '../../services/ConnectionPeerToPeer.js'
import { Avatar } from '@rneui/themed';


const CallScreen = ({ route }) => {
  const [acceptedCall, setAcceptedCall] = useState(false);
  const [connecingCall, setConnectingCall] = useState(false);
  const [connectedCall, setConnectedCall] = useState(false);
  const [idCallIncoming, setIdCallIncoming] = useState(null);
  const [isCallerUser, setIsCallerUser] = useState(false);
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
   console.log(typeof route?.params.isCallerUser,  typeof("false"));
    if (route?.params?.isCallerUser === "false") {
      console.log("llamada entrando");
      setIdCallIncoming(route?.params?.idCallIncoming);
      setIsCallerUser(false)

    } else {
      setIsCallerUser(true)
      console.log("llamada saliendo");
    }
  }, [route]);

  return (
    <View style={styles.container} >
      <View style={{ backgroundColor: "red", flex: 8 }} >
          {(acceptedCall || isCallerUser) && <ConnectionP2P
            type={"caller"}
            isCallerUser={isCallerUser}
            connecting={value => setConnectingCall(value)}
            connected={value => setConnectedCall(value)}
            idCallIncoming={idCallIncoming}
            idUser={idUser?.idUser}
          />}
      </View>
      {(acceptedCall) ? (
        <View style={{ backgroundColor: "blue", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flex: 2 }} >
          <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor: 'gray',
                borderStyle: 'solid',
                borderWidth: 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor: 'green',
                borderStyle: 'solid',
                borderWidth: 1
              }}
            /></TouchableOpacity>
        </View>
      ) : (
        <View style={{ backgroundColor: "blue", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flex: 2 }} >
          <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor: 'red',
                borderStyle: 'solid',
                borderWidth: 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAcceptedCall(true)}
          >
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor: 'green',
                borderStyle: 'solid',
                borderWidth: 1
              }}
            /></TouchableOpacity>
        </View>
      )}

    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  buttonCall: {
    backgroundColor: 'red',
  }
})
export default CallScreen;
