import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
    ScreenCapturePickerView,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';

const ConnectionP2P = ({ params}) => {
    
    const [stream, setStream] = useState(null);
    const start = async () => {
      console.log('start');
      if (!stream) {
        let s;
        try {
          s = await mediaDevices.getUserMedia({ video: true });
          setStream(s);
          console.log("s",s);
        } catch(e) {
          console.error(e);
        }
      }
    };
    const stop = () => {
      console.log('stop');
      if (stream) {
        stream.release();
        setStream(null);
      }
    };
    start()
    return(
    (  (stream) && 
    <View style={{...StyleSheet.absoluteFill, backgroundColor:"red"}}>
    <RTCView
	mirror={true}
    style={{height: 150, width: 150}}
	objectFit={'cover'}
   
	streamURL={stream.toURL()}
    />
    <Text>Holaaaaa</Text>
    </View>
  )
    )
}

export default ConnectionP2P;

