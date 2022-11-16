import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import { API, ROUTES } from '../../api';
import { mediaConstraints, sessionConstraints } from './Constants';
import LoudSpeaker from 'react-native-loud-speaker';
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
    idCall
    }) => {
    let remoteCandidates = [];
    let localCandidates = []
    let datachannel;
    let peerConstraints = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [creatingOffer, setCreatingOffer] = useState(false);
     const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection(peerConstraints));
    //let peerConnection = new RTCPeerConnection(peerConstraints);
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
                        console.log("llegó respuesta", message.data);
                        getAnswer(message.data.idCall)
                        break;
                    case "offer":
                        console.log("llegó oferta");
                        getOffer(message.data.idCall);
                        break;
                    case "finalizeCall":
                        if(message.data.idCall === idCallIncoming 
                        || message.data.idCall === idCall){
                            destroyMedia()
                        }
                        break;
                    case "candidate":
                        console.log("Candidato remoto: ", Object.keys(JSON.parse(message.data.candidate)) );

                        handleRemoteCandidate(JSON.parse(message.data.candidate))
                        break;
                }
            })
        }
        handleRemoteMessages()
    }, []);

    useEffect(() => {
        const createOfferCall = async () => {
            if (localMediaStream !== null) {
                peerConnection.addStream(localMediaStream);
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
       LoudSpeaker.open(speakerEnabled);
    }, [speakerEnabled]);

    useEffect(() => {
     hangoutCall ? destroyMedia() : null
    },[hangoutCall])

    const getAnswer = async (_idCall) => {
        try {
            if(peerConnection.remoteDescription == null){
                console.log("trayendo respuesta", peerConnection.remoteDescription );
                (await API())
                .post(ROUTES.GET_ANSWER, JSON.stringify({idCall:_idCall}))
                .then(async response =>{
                    const remoteDesc = new RTCSessionDescription(response.data.data.answer);
                    console.log("se seteo respuesta");
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
    }
    const createOffer = async () => {
        try {
            if(creatingOffer){
                if(peerConnection.localDescription == null){
                    console.log("creando oferta");
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
            handleRemoteCandidate(event.candidate);
            let data = { candidate: event.candidate, 
                idCall: (idCallIncoming !== null) ? idCallIncoming : idCall, toUser: isCallerUser ? "assistant" : "caller"};  
                console.log(data.toUser);         
            ( await API()).
            post(ROUTES.SEND_CANDIDATES, JSON.stringify(data))
            .catch(error => console.log(error))
    
        });
        peerConnection.addEventListener('icecandidateerror', event => {});
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            console.log(peerConnection.iceConnectionState)
            if( peerConnection.iceConnectionState === 'connected' ) {
                    console.log("peer exitoso");
            };
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
            console.log("se agregó video remoto");
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
    const getCandidatesRemote = async(idCall) => {
        try {
            let userType = isCallerUser ? "caller" : "assistant";
            (await API())
            .post(ROUTES.GET_CANDIDATES, JSON.stringify({idCall, userType}))
            .then(response => {
                if(JSON.parse(response.data.data.candidatesReturn).length >0){
                    console.log("entrando");
                    JSON.parse(response.data.data.candidatesReturn).forEach(candidate =>{
                        handleRemoteCandidate(candidate);
                    })
                }
            })
            .catch(error =>{
                Alert.alert("falló al traer candidatos", JSON.stringify(error));
                console.log(error);

            })
        } catch (error) {
            Alert.alert("falló al traer candidatos", JSON.stringify(error));
            console.log(error);

        }
    };
    const handleRemoteCandidate = (iceCandidate) => {
        iceCandidate = new RTCIceCandidate(iceCandidate);

        if (peerConnection.remoteDescription == null) {
            return remoteCandidates.push(iceCandidate);
        };

        return peerConnection.addIceCandidate(iceCandidate);
    };
    const processCandidates = () => {
         if ( remoteCandidates.length < 1 ) { return; };
        remoteCandidates.map(candidate => peerConnection.addIceCandidate(candidate));
        remoteCandidates = [];
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

