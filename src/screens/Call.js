import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ConnectionP2P } from '../../services/ConnectionPeerToPeer.js'
import { Avatar } from '@rneui/themed';
import InCallManager from 'react-native-incall-manager';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import { API, ROUTES } from '../../api';
import uuid4 from 'random-uuid-v4';

const CallScreen = ({ route, navigation }) => {
  const [connectedCall, setConnectedCall] = useState(false);
  const [idCallIncoming, setIdCallIncoming] = useState(null);
  const [idCallStarting, setIdCall] = useState(uuid4());
  const [isCallerUser, setIsCallerUser] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [hangoutCall, setHangoutCall] = useState(false);
  const [imageRef, setImageRef] = useState('');

  useEffect(() => {
    if (route?.params?.isCallerUser === "false") {
      setIdCallIncoming(route?.params?.idCallIncoming);
      InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
      getimage(route?.params?.idUser)
      setIsCallerUser(false);
    } else {
      setIsCallerUser(true);
      requestCall();
    }
  }, [route]);

  const getimage = async (id) => {
    (await API())
    .post(ROUTES.GET_IMAGE, JSON.stringify({idUser:id}))
    .then(response =>{
      setImageRef(response.data.data.image);
    })
  };

  useEffect(() => {
    const handleRemoteMessages = () => {
        messaging().onMessage(async (message) => {
          let isRespondingCall = message.data.type === 'responseCall';
          let isRequestingCall = message.data.type === 'requestCall';
            if ((isRespondingCall || isRequestingCall )) {
                setConnectedCall(true);
                setImageRef(message.data.image);
            }
        })
    }
    handleRemoteMessages()
  }, []);

  const requestCall = async () => {
    let user = await CacheUtil.getUser();
    let data = {
      idUserCaller: user.idUser,
      idCall: idCallStarting
    };
    (await API()).
    post(ROUTES.REQUEST_CALL, JSON.stringify(data))
    .catch( error => {
      Alert.alert("axios", JSON.stringify(error));
    }
    )
  };

  const responseCall = async () => {
    let user = await CacheUtil.getUser();
    let data = {
      idCall: idCallIncoming,
      idUserAssistant: user.idUser,
  };
  (await API()).
      post(ROUTES.RESPONSE_CALL, JSON.stringify(data)).
      then(async(response) => {
          if(response.data.succes) connecting(true);
          }
      ).catch(error => {
          console.log(error);
      })
  };

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
        <TouchableOpacity
        onPress={()=>
          { connectedCall ? setHangoutCall(true) : navigation.goBack()}}
        >
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
      <TouchableOpacity
        onPress={()=> navigation.goBack()}
      >
            <Avatar
              size={72}
              rounded
              icon={{ name: 'phone-slash', type: 'font-awesome-5', color:'white' }}
              containerStyle={{
                backgroundColor: '#DA1717'
              }}
            />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> {
            responseCall();
            setConnectedCall(true);
            InCallManager.stopRingback();
          }}
        >
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
      <View style={styles.avatar} >
     { connectedCall && (imageRef !== '') ? <Avatar
              size={250}
              rounded
              source={{ uri: imageRef }}
              containerStyle={{
                backgroundColor: 'green',
                alignSelf:'center'
              }}
            /> : 
      <Text style={{color:"white", alignSelf:'center'}} >Conectando...</Text>}
      </View>
      <View>
      {(connectedCall)
           && 
           <ConnectionP2P
            type={"caller"}
            isCallerUser={isCallerUser}
            idCallIncoming={idCallIncoming}
            speakerEnabled={isSpeakerOn}
            microphoneEnabled={isMicrophoneOn}
            hangoutCall={hangoutCall}
            navigation={navigation}
            idCall={idCallStarting}
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
  avatar: {
    backgroundColor: "#3192DA", 
    flex: 8, 
    flexDirection:'column', 
    justifyContent:'center'
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