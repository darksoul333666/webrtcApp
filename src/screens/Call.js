import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ConnectionP2P } from '../../services/ConnectionPeerToPeer.js'
import { Avatar } from '@rneui/themed';
import InCallManager from 'react-native-incall-manager';


const CallScreen = ({ route }) => {
  const [acceptedCall, setAcceptedCall] = useState(false);
  const [connectingCall, setConnectingCall] = useState(false);
  const [connectedCall, setConnectedCall] = useState(false);
  const [idCallIncoming, setIdCallIncoming] = useState(null);
  const [isCallerUser, setIsCallerUser] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  useEffect(() => {
    if (route?.params?.isCallerUser === "false") {
      setIdCallIncoming(route?.params?.idCallIncoming);
      InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
      setIsCallerUser(false)
    } else {
      setIsCallerUser(true);

    }
  }, [route]);

  const renderTabCallInProgress = () => {
    return (
      <View style={styles.tabCallInprogress} >
        <TouchableOpacity
          onPress={()=> setIsSpeakerOn(!isSpeakerOn)}
          >
           <Avatar
              size={72}
              rounded
              icon={{ name: isSpeakerOn ? 'volume-up' : 'volume-down', type: 'font-awesome-5' }}
              containerStyle={{
                opacity: isSpeakerOn  ? 1 : .5
              }}
            />
        </TouchableOpacity>
        <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'phone', type: 'font-awesome-5', color:'white' }}
              containerStyle={{
                backgroundColor: '#DA1717'
              }}
            />
        </TouchableOpacity>
        <TouchableOpacity
         onPress={()=> setIsMicrophoneOn(!isMicrophoneOn)}
        >
            <Avatar
              size={72}
              rounded
              icon={{ name: isMicrophoneOn ? 'microphone' : 'microphone-slash', type: 'font-awesome-5' }}
              containerStyle={{
                opacity: isMicrophoneOn ? 1 : .5
              }}

            />
        </TouchableOpacity>
      </View>
    )
  };
  const renderTabCallIncoming = () => {
    return (
      <View style={styles.tabCallIncoming}>
      <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'phone-slash', type: 'font-awesome-5', color:'white' }}
              containerStyle={{
                backgroundColor: '#DA1717'
              }}
            />
        </TouchableOpacity>
        <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'phone-alt', type: 'font-awesome-5', color:'white' }}
              containerStyle={{
                backgroundColor: 'green'
              }}
            />
        </TouchableOpacity>
    </View>
    )
  };
  return (
    <View style={styles.container} >
      <View style={{ backgroundColor: "#3192DA", flex: 8, flexDirection:'column', justifyContent:'center' }} >
      <Avatar
              size={250}
              rounded
              source={{ uri: "https://randomuser.me/api/portraits/men/72.jpg" }}
              containerStyle={{
                backgroundColor: 'green',
                alignSelf:'center'
                // width:300,
                // height:300
              }}
            />

      </View>
      <View>
      {(acceptedCall || isCallerUser)
           && <ConnectionP2P
            type={"caller"}
            isCallerUser={isCallerUser}
            connecting={value => setConnectingCall(value)}
            connected={value => setConnectedCall(value)}
            idCallIncoming={idCallIncoming}
            speakerEnabled={isSpeakerOn}
            microphoneEnabled={isMicrophoneOn}
          />}
        { (!connectedCall && !isCallerUser) ? renderTabCallIncoming() :  renderTabCallInProgress()}
      </View>
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
  },
  tabCallInprogress : {
    display:'flex',
    justifyContent:'space-around',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#8797A2',
    paddingVertical: 20
  },
  tabCallIncoming: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    backgroundColor:'#8797A2',
    paddingVertical: 20
  }
})
export default CallScreen;