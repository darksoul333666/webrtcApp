import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    mediaDevices,
} from 'react-native-webrtc';
import { API, ROUTES } from '../../api';
const ConnectionP2P = ({ params}) => {
    
    let mediaConstraints = {
        audio: true,
        isOnlyVoice:false,
        video: {
            frameRate: 30,
            facingMode: 'user'
        }
    };
    let peerConstraints = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };
    let sessionConstraints = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
            VoiceActivityDetection: true
        }
    };
    
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [tokenFirebase, setTokenFirebase] = useState('');
    let  peerConnection = new RTCPeerConnection( peerConstraints );
    let  datachannel;

    useEffect(()=>{
        const getMedia = async () => {
            try {
            const mediaStream = await   mediaDevices.getUserMedia(mediaConstraints);
            let videoTrack =  mediaStream.getVideoTracks()[ 0 ];
		        videoTrack.enabled = false;
            setLocalMediaStream(mediaStream);
            
            // mediaStream.getTracks().forEach(track => {
            //     peerConnection.getLocalStreams()[0].addTrack(track);
            //   });
            let token = await messaging().getToken();
            setTokenFirebase(token);
            if(token === 'dk7BRsCESYqDzS-HJWrBJJ:APA91bH6-BBgV95Oz8PpxR7B84P_c8NTAfaS81h3wKEG5quet5iavkjpQ0_dW1gtaOjP7nGFZpDG7PiMBAorbKwlsOZyVwQ_ZWNuBk9xJ8sLu-FlNb-KBxsqxe3ZFBtWyE5WQ3_UpMAS')
            {createOffer()}

            } catch( err ) {
                console.log("ERROR",err)
            };
        }
        getMedia()
    },[])

    useEffect(()=>{
        if(localMediaStream !== null){
            createPeerConnection()
            console.log(localMediaStream.toURL());
            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    localMediaStream.addTrack(event.streams[0]); // tried with passing `track` as well
                    
                });
              };
        }
    },[localMediaStream]);

    const createOffer = async() => {
        try {
            const offerDescription = await peerConnection.createOffer( sessionConstraints );
            await peerConnection.setLocalDescription( offerDescription );

            let token = await messaging().getToken();
                 (await API()).
                post(ROUTES.SEND_OFFER, JSON.stringify({offer:JSON.stringify(offerDescription), tokenFirebase:token})).
                then(
                    res=>{
                        Alert.alert("oferta enviada")

                    }
                ).catch(
                    error=>{
                        Alert.alert("axios",JSON.stringify(error));
                    }
                )
            

        } catch( err ) {
            Alert.alert("error al crear oferta", JSON.stringify(err));
        };
    };

    useEffect(()=>{
    const listenerAnswer = async() => { 
        messaging().onMessage(async(message)=>{

            if(message.data.type === 'answer'){
                console.log("tipo de data", JSON.stringify(message.data.data));

            }

            // if(message.data.type === 'answer'){
            //     try {
            //         const remoteDesc = new RTCSessionDescription(message.data.data);
            //         await peerConnection.setRemoteDescription(remoteDesc);

            //     } catch (error) {
            //         console.log("ERROR al setear respuesta", error)
            //     }
            // }
        })
    }
    listenerAnswer()
    },[])

    useEffect(()=>{
    const listenerOffer = async() => {
        let token = await messaging().getToken();
        messaging().onMessage(async(message)=>{

            if(message.data.type === 'offer'){
                try {
                    // Recibimos la oferta y la seteamos
                    console.log("recibimos oferta");
                    const offerDescription = new RTCSessionDescription( JSON.parse(message.data.data) );
                    await peerConnection.setRemoteDescription( offerDescription );
                
                    const answerDescription = await peerConnection.createAnswer( sessionConstraints );
                    await peerConnection.setLocalDescription( answerDescription );

                    //Envio mi respuesta al servidor
                    console.log(answerDescription)
                    let token = await messaging().getToken();
                    if(token !== 'dk7BRsCESYqDzS-HJWrBJJ:APA91bH6-BBgV95Oz8PpxR7B84P_c8NTAfaS81h3wKEG5quet5iavkjpQ0_dW1gtaOjP7nGFZpDG7PiMBAorbKwlsOZyVwQ_ZWNuBk9xJ8sLu-FlNb-KBxsqxe3ZFBtWyE5WQ3_UpMAS'){
                        Alert.alert("Enviando respuesta al api")
                        try {
                            (await API()).
                            post(ROUTES.SEND_ANSWER, JSON.stringify({answer:(answerDescription), tokenFirebase:token})).
                            then(
                                res=>{
                                    Alert.alert("Servidor recibio la respuesta")
                                }
                            ).catch(error =>{
                                Alert.alert("Servidor FALLÓ AL RECIBIR OFERTA", JSON.stringify(error))
                            })
                        } catch (error) {
                            Alert.alert("Servidor FALLÓ AL RECIBIR OFERTA", (error))

                        }
                        
                    }
                
                } catch( err ) {
                    //  Alert.alert("ERROR al setear oferta", JSON.stringify(err))
                };
            }
        })
    }
     listenerOffer();
    },[])

    
    
    // const startWebcam = async () => {
    //     pc.current = new RTCPeerConnection(servers);
    //     const local = await mediaDevices.getUserMedia({
    //       video: true,
    //       audio: true,
    //     });
    //     pc.current.addStream(local);
    //     setLocalStream(local);
    
        
    
    //     // Push tracks from local stream to peer connection
    //     local.getTracks().forEach(track => {
    //       pc.current.getLocalStreams()[0].addTrack(track);
    //     });
    
    //     // Pull tracks from peer connection, add to remote video stream
    //     pc.current.ontrack = event => {
    //       event.streams[0].getTracks().forEach(track => {
    //         remote.addTrack(track);
    //       });
    //     };
    
    //     pc.current.onaddstream = event => {
    //       setRemoteStream(event.stream);
    //     };
    //   };
    
    const destroyMedia = () => {
        localMediaStream.getTracks().map(
            track => track.stop()
        );
        
        localMediaStream = null;
    }
    
    const createPeerConnection = () => {
    peerConnection.addEventListener( 'connectionstatechange', event => {} );
    peerConnection.addEventListener( 'icecandidate', event => {} );
    peerConnection.addEventListener( 'icecandidateerror', event => {} );
    peerConnection.addEventListener( 'iceconnectionstatechange', event => {} );
    peerConnection.addEventListener( 'icegatheringstatechange', event => {} );
    peerConnection.addEventListener( 'negotiationneeded', event => {} );
    peerConnection.addEventListener( 'signalingstatechange', event => {} );
    peerConnection.addEventListener( 'addstream', event => {} );
    peerConnection.addEventListener( 'removestream', event => {} );
    createDataChanel()
    }

    const destroyPeerConnection = () => {
    peerConnection._unregisterEvents();
    peerConnection.close();
    peerConnection = null;
    }
    const createDataChanel = () => {
    datachannel = peerConnection.createDataChannel( 'my_chanel_webrtcapp' );
    datachannel.addEventListener( 'open', event => {} );
    datachannel.addEventListener( 'close', event => {} );
    datachannel.addEventListener( 'message', message => {} );
    }
  
    // const createAnswer = async() => {
    //     try {
    //         // Use the received offerDescription
    //         const offerDescription = new RTCSessionDescription( offerDescription );
    //         await peerConnection.setRemoteDescription( offerDescription );
        
    //         const answerDescription = await peerConnection.createAnswer( sessionConstraints );
    //         await peerConnection.setLocalDescription( answerDescription );
        
    //         // Send the answerDescription back as a response to the offerDescription.
    //     } catch( err ) {
    //         // Handle Errors
    //     };
    //     peerConnection.addEventListener( 'datachannel', event => {
    //         let datachannel = event.channel;
        
    //         // Now you've got the datachannel.
    //         // You can hookup and use the same events as above ^
    //     } );
    return(
   (  (localMediaStream) && 
   <View style={{...StyleSheet.objectFit, flex:1}} >
     <RTCView
	mirror={true}
    style={{flex: 1,}}
	objectFit={'cover'}
	streamURL={localMediaStream.toURL()}
    />
        <TextInput
        onChangeText={()=>{}}
        value={tokenFirebase}
        placeholder="useless placeholder"
      />
   </View>
   

  )
    )
}

export default ConnectionP2P;

