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
        let channelUser = isCallerUser ? 'assistant' : 'caller';
        let channelCall = isCallerUser ? idCall : idCallIncoming;
        let sourceRequest = isCallerUser ? 'answer' : 'offer';
        database()
        .ref(`calls/${channelCall}/${channelUser}Candidates`)
        .on('value', snapshot => {
            console.log(snapshot.val())
            if(snapshot?.val() !== null){
                 let candidate = Object.entries(snapshot?.val()).map(e => (e[1].candidate))
                handleRemoteCandidate(candidate)                
            }
        });
        database()
        .ref(`calls/${channelCall}/${sourceRequest}`)
        .on('value', snapshot => {
            console.log(sourceRequest, snapshot.val());
            if(sourceRequest === 'offer') {
                if(snapshot.val() !== null){
                    sendAnswer(snapshot.val().offer)
                }
            } else {
                if(snapshot.val() !== null){
                    getAnswer(snapshot.val().answer);
                }
            }
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
                if(message.data.type === finalizeCall) {
                        if(message.data.idCall === idCallIncoming 
                        || message.data.idCall === idCall){
                            destroyMedia()
                        }
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
        if(isCallerUser){
         if(!creatingOffer){
             setCreatingOffer(true);
         }
        }
    },[isCallerUser])

    useEffect(() => {
     hangoutCall ? destroyMedia() : null
    },[hangoutCall]);

    const createOffer = async () => {
        try {
            if(creatingOffer){
                if(peerConnection.localDescription == null){
                    const offerDescription = await peerConnection.createOffer(sessionConstraints);
                    await peerConnection.setLocalDescription(offerDescription);
                    console.log("offerDescription", offerDescription);
                    database()
                    .ref(`calls/${idCall}/offer`)
                    .set({
                      _id: Math.round(Math.random() * 1000000),
                      offer:offerDescription
                    })
                    .then(res => {} )
                    .catch(e => {
                      console.log('Sorry, this message could not be sent. ', e);
                    });
                }
            }
        } catch (err) {
           console.log("error al crear oferta", (err));
        };
    };

    const sendAnswer = async (offer) => {
        try {
            if(peerConnection.localDescription == null ){

                console.log(offer)

                const offerDescription = new RTCSessionDescription( offer );
	            await peerConnection.setRemoteDescription( offerDescription );

                const answerDescription = await peerConnection.createAnswer(sessionConstraints);
                await peerConnection.setLocalDescription(answerDescription);
                processCandidates();
                database()
                .ref(`calls/${idCallIncoming}/answer`)
                .set({
                  _id: Math.round(Math.random() * 1000000),
                  answer:answerDescription
                })
                .then(res => console.log("candidate send") )
                .catch(e => {
                  console.log('Sorry, this message could not be sent. ', e);
                });

            };
        } catch (err) {
            console.log("ERROR al enviar respuesta", err)
        };
    };

    const getAnswer = async (answer) => {
        try {
            if(peerConnection.remoteDescription == null){               
                const remoteDesc = new RTCSessionDescription(answer);
                await peerConnection.setRemoteDescription(remoteDesc);
                peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                localMediaStream.addTrack(event.streams[0]);
                });
            };
        }
        } catch (error) {
            Alert.alert("ERROR al traer respuesta", JSON.stringify(error))
        }
    };

    // const getOffer = async (idCall) => {
    //     try {
    //         if(peerConnection.remoteDescription == null){
    //             (await API())
    //             .post(ROUTES.GET_OFFER, JSON.stringify({idCall}))
    //             .then(async response =>{
    //                  if(response.data.success){
    //                      try {
    //                          const offerDescription = new RTCSessionDescription(response.data.data.offer);
    //                          await peerConnection.setRemoteDescription(offerDescription);
    //                          sendAnswer(response.data.data.idCall)
    //                      } catch (error) {
    //                          Alert.alert("falló al traer oferta", JSON.stringify(error))
     
    //                      }
                       
    //                  }
    //             })
    //             .catch(error => {
    //              Alert.alert("falló al traer oferta", JSON.stringify(error))
     
    //             });
    //         }
    //     } catch (error) {
    //         Alert.alert("falló al traer oferta", (error))

    //     }
    // };

    const createPeerConnection = async() => {
        peerConnection.addEventListener('connectionstatechange', event => {
        if(event === 'failed')  destroyMedia();
         });
        peerConnection.addEventListener('icecandidate', async event => {
            if (!event.candidate) { return; };
            handleRemoteCandidate(event.candidate);
            sendCandidates(event.candidate);    
        });
        peerConnection.addEventListener('icecandidateerror', event => {});
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            if(peerConnection.iceConnectionState === 'disconnected')  destroyMedia();

        });
        peerConnection.addEventListener('negotiationneeded', async event => {
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
        let channelUser = isCallerUser ? 'caller' : 'assistant';
        let channelCall = isCallerUser ? idCall : idCallIncoming;
        database()
        .ref(`calls/${channelCall}/${channelUser}Candidates`)
        .push({
          _id: Math.round(Math.random() * 1000000),
          candidate
        })
        .then(res =>{} )
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

