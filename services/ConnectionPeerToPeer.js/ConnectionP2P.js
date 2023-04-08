import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { API, ROUTES } from '../../api';
import { mediaConstraints, peerConstraints, sessionConstraints } from './Constants';
import database from '@react-native-firebase/database';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
} from 'react-native-webrtc';

const ConnectionP2P = ({ 
    isCallerUser,
    idCallIncoming,
    microphoneEnabled,
    speakerEnabled,
    hangoutCall,
    navigation,
    idCall,
    typeUser
    }) => {
    let remoteCandidates = [];
    let localCandidates = []
    let datachannel;
    // let peerConstraints = {
    //     iceServers: [
    //         {
    //             urls: 'stun:stun.l.google.com:19302'
    //         }
    //     ]
    // };

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [creatingOffer, setCreatingOffer] = useState(false);
     const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection(peerConstraints));

     useEffect(() => {
        let idCall='123456';
        let typeUser='caller';
        database()
        .ref(`calls/${idCall}/${typeUser}Candidates`)
        .on('value', snapshot => {
        console.log('User data: ', snapshot?.val());
        handleRemoteCandidate(JSON.parse(snapshot?.val()))

      });
      }, []);

    useEffect(() => {   
        const getMedia = async () => {
            try {
                const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
                // let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
		        // videoTrack.enabled = false;
                setLocalMediaStream(mediaStream);
                createPeerConnection();
            } catch (err) {
                console.log("ERROR", err)
            };
        }
        getMedia()
    }, []);

    useEffect(() => {
        const handleRemoteMessages = () => {
            messaging().onMessage(async (message) => {

                switch (message.data.type) {
                    case "answer":
                        getAnswer(message.data.idCall)
                        break;
                    case "offer":
                        getOffer(message.data.idCall);
                        break;
                    case "finalizeCall":
                        if(message.data.idCall === idCallIncoming 
                        || message.data.idCall === idCall){
                            destroyMedia()
                        }
                        break;
                }
            })
        }
        handleRemoteMessages()
    }, []);

    useEffect(() => {
        const createOfferCall = async () => {
            if (localMediaStream !== null) {
                try {
                    peerConnection.addStream(localMediaStream);
                } catch (error) {
                    console.log("error al setear stream local",error);
                }
            }
        }
        createOfferCall()
    }, [localMediaStream]);

    useEffect(() => {
        if (creatingOffer) {
            setCreatingOffer(false)
             createOffer();
        }
    }, [creatingOffer]);

    useEffect(() => {
        const handleMicrophone = async() => {
            try {
            const audioTrack = await localMediaStream.getAudioTracks()[ 0 ];
            audioTrack.enabled = microphoneEnabled;
            } catch (error) {
                console.log("handle microphone",error);
            }
        };
      localMediaStream !== null ? handleMicrophone() : null;
    }, [microphoneEnabled]);

    useEffect(() => {
     hangoutCall ? destroyMedia() : null
    },[hangoutCall])

    const getAnswer = async (_idCall) => {
        try {
            if(peerConnection.remoteDescription == null){
                (await API())
                .post(ROUTES.GET_ANSWER, JSON.stringify({idCall:_idCall}))
                .then(async response =>{
                    const remoteDesc = new RTCSessionDescription(response.data.data.answer);
                        await peerConnection.setRemoteDescription(remoteDesc);
                        peerConnection.ontrack = (event) => {
                            event.streams[0].getTracks().forEach((track) => {
                                localMediaStream.addTrack(event.streams[0]);
                            });
                        };

                })
                .catch(error =>{
                    Alert.alert("ERROR al traer respuesta", JSON.stringify(error))

                });
            }
        } catch (error) {
            Alert.alert("ERROR al traer respuesta", JSON.stringify(error))
        }
    };

    const sendAnswer = async (_idCall) => {
        try {
            if(peerConnection.localDescription == null ){
                const answerDescription = await peerConnection.createAnswer(sessionConstraints);
                await peerConnection.setLocalDescription(answerDescription);
                processCandidates();
            try {
                (await API()).
                    post(ROUTES.SEND_ANSWER, JSON.stringify({answer:answerDescription, idCall:_idCall}))
                    .catch(error => {
                        console.log(error);
                    })
            } catch (error) {
                Alert.alert("Servidor FALLÓ al enviar respuesta", JSON.stringify(error))
            }
            };
        } catch (err) {
            Alert.alert("ERROR al enviar respuesta", JSON.stringify(err))
        };
    };

    const createOffer = async () => {
        try {
            if(creatingOffer){
                if(peerConnection.localDescription == null){
                    const offerDescription = await peerConnection.createOffer(sessionConstraints);
                    await peerConnection.setLocalDescription(offerDescription);
                    (await API()).
                        post(ROUTES.SEND_OFFER, JSON.stringify({offer:offerDescription, idCall}))
                        .catch( error => {
                                Alert.alert("axios", JSON.stringify(error));
                            }
                        )
                }
            }
        } catch (err) {
            Alert.alert("error al crear oferta", JSON.stringify(err));
        };
    };

    const getOffer = async (idCall) => {
        try {
            if(peerConnection.remoteDescription == null){
                (await API())
                .post(ROUTES.GET_OFFER, JSON.stringify({idCall}))
                .then(async response =>{
                     if(response.data.success){
                         try {
                             const offerDescription = new RTCSessionDescription(response.data.data.offer);
                             await peerConnection.setRemoteDescription(offerDescription);
                             sendAnswer(response.data.data.idCall)
                         } catch (error) {
                             Alert.alert("falló al traer oferta", JSON.stringify(error))
     
                         }
                       
                     }
                })
                .catch(error => {
                 Alert.alert("falló al traer oferta", JSON.stringify(error))
     
                });
            }
        } catch (error) {
            Alert.alert("falló al traer oferta", (error))

        }
    };

    const createPeerConnection = async() => {
        peerConnection.addEventListener('connectionstatechange', event => {
        if(event === 'failed')  destroyMedia();
         });
        peerConnection.addEventListener('icecandidate', async event => {
            if (!event.candidate) { return; };
            sendCandidates(event.candidate);    
        });
        peerConnection.addEventListener('icecandidateerror', event => {});
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            if(peerConnection.iceConnectionState === 'disconnected')  destroyMedia();

        });
        peerConnection.addEventListener('negotiationneeded', async event => {
           if(isCallerUser){
            if(!creatingOffer){
                setCreatingOffer(true);
            }
           }
        }
        );
        peerConnection.addEventListener('addstream', event => {
            setRemoteMediaStream(event.stream);
        });
        peerConnection.addEventListener('signalingstatechange', event => { });
        peerConnection.addEventListener('removestream', event => { });
        peerConnection.addEventListener("icegatheringstatechange", async (ev) => { });
        createDataChanel()
    };

    const createDataChanel = () => {
        datachannel = peerConnection.createDataChannel('my_chanel_webrtcapp');
        datachannel.addEventListener('open', event => { });
        datachannel.addEventListener('close', event => { });
        datachannel.addEventListener('message', message => { });
    };

    const destroyMedia = async () => {
        if(localMediaStream !== null){
              localMediaStream.getTracks().map(
                track => track.stop()
            );
        };
        setLocalMediaStream(null);
        if(peerConnection !== null){
            peerConnection._unregisterEvents();
            peerConnection.close();
                setPeerConnection(null);
        };
        if(datachannel !== null){
            // datachannel.close();
            datachannel = null;
        }
        navigation.goBack()
 
    };

    const handleRemoteCandidate = (iceCandidate) => {
        try {
            iceCandidate = new RTCIceCandidate(iceCandidate);

            if (peerConnection.remoteDescription == null) {
                return remoteCandidates.push(iceCandidate);
            };
    
            return peerConnection.addIceCandidate(iceCandidate);
        } catch (error) {
            console.log(error);
        }
       
    };

    const processCandidates = () => {
         if ( remoteCandidates.length < 1 ) { return; };
        remoteCandidates.map(candidate => peerConnection.addIceCandidate(candidate));
        remoteCandidates = [];
    };

    const sendCandidates = (candidate) => {
        let idCall='123456';
        let typeUser='caller';
        database()
        .ref(`calls/${idCall}/${typeUser}Candidates`)
        .push({
          _id: Math.round(Math.random() * 1000000),
          candidate
        })
        .then(res => console.log("candidate send") )
        .catch(e => {
          console.log('Sorry, this message could not be sent. ', e);
        });
    };

    return (
            <View style={{ ...StyleSheet.objectFit, flex: 1 }} >
            {remoteMediaStream  && (
                <RTCView
                    mirror={true}
                    style={{ flex: 1, }}
                    objectFit={'cover'}
                    streamURL={remoteMediaStream.toURL()}
                />
            )}
            </View>
        )
}

export default ConnectionP2P;

