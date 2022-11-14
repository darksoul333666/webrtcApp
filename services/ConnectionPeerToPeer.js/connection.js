import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import uuid4 from 'random-uuid-v4';
import { CacheUtil } from '../../utils/cache';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
} from 'react-native-webrtc';
import { API, ROUTES } from '../../api';
import { mediaConstraints, peerConstraints, sessionConstraints } from './connect';

const ConnectionP2P = ({ 
    isCallerUser, 
    connecting, 
    connected, 
    acceptedCall, 
    idCallIncoming,
    microphoneEnabled,
    speakerEnabled }) => {
    let remoteCandidates = [];
    let localCandidates = []
    let datachannel;

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [tokenFirebase, setTokenFirebase] = useState('');
    const [creatingOffer, setCreatingOffer] = useState(false);
    const [creatingAnswer, setCreatingAnswer] = useState(true);
    const [isCandidatesLoad, setIsCandidatesLoad] = useState(false);
    const [idCall, setIdCall] = useState(uuid4());
    const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection(peerConstraints));

    useEffect(() => {   
        const getMedia = async () => {
            try {
                let token = await messaging().getToken();
                setTokenFirebase(token)
                const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
                // let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
		        // videoTrack.enabled = false;
                setLocalMediaStream(mediaStream);
                createPeerConnection();
                if(!isCallerUser) getOffer(idCallIncoming);
            } catch (err) {
                console.log("ERROR", err)
            };
        }
        getMedia()
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
             createOffer();
        }
    }, [creatingOffer]);

    useEffect(() => {
        const handleRemoteMessages = () => {
            messaging().onMessage(async (message) => {
                switch (message.data.type) {
                    case "answer":
                        getAnswer(message.data.idCall)
                        break;
                    case "candidatesLoaded":
                        console.log("los candidatos se han cargado por completo");
                        getCandidatesRemote(message.data.idCall);
                        break;
                }
            })
        }
        handleRemoteMessages()
    }, []);

    useEffect(() => {
        const handleMicrophone = async() => {
            try {
            const audioTrack = await localMediaStream.getAudioTracks()[ 0 ];
            audioTrack.enabled = microphoneEnabled;
            } catch (error) {
                console.log(error);
            }
        };
      localMediaStream !== null ? handleMicrophone() : null;
    }, [microphoneEnabled]);

    useEffect(()=> {

    }, [speakerEnabled])

    const getAnswer = async (_idCall) => {
        setCreatingAnswer(false);
        try {
             if (creatingAnswer) {

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
                    // } catch (error) {
                    //     console.log(error);
                    // }
                   
                })
                .catch(error =>{
                    Alert.alert("ERROR al traer respuesta", JSON.stringify(error))

                });
            } else return;


        } catch (error) {
            Alert.alert("ERROR al traer respuesta", JSON.stringify(error))
        }
    };
    const sendAnswer = async (_idCall) => {
        try {
            const answerDescription = await peerConnection.createAnswer(sessionConstraints);
            await peerConnection.setLocalDescription(answerDescription);
            processCandidates();
            try {
                let user = await CacheUtil.getUser()

                let data = {
                    idCall: _idCall,
                    idUserAssistant: user.idUser,
                    answer: answerDescription
                };
                (await API()).
                    post(ROUTES.SEND_ANSWER, JSON.stringify(data)).
                    then(async(response) => {
                        if(response.data.succes) connecting(true);
                        }
                    ).catch(error => {
                        console.log(error);
                    })
            } catch (error) {
                Alert.alert("Servidor FALLÓ al enviar respuesta", JSON.stringify(error))
            }
        } catch (err) {
            Alert.alert("ERROR al enviar respuesta", JSON.stringify(err))
        };
    }
    const createOffer = async () => {
        try {
            const offerDescription = await peerConnection.createOffer(sessionConstraints);
            await peerConnection.setLocalDescription(offerDescription);
            let user = await CacheUtil.getUser()

            let data = {
                offer: offerDescription,
                idUserCaller: user.idUser,
                idCall
            };
            console.log("idcall de crear", data.idCall);
            (await API()).
                post(ROUTES.SEND_OFFER, JSON.stringify(data)).
                then( res => {
                      
                    }
                ).catch( error => {
                        Alert.alert("axios", JSON.stringify(error));
                    }
                )

        } catch (err) {
            Alert.alert("error al crear oferta", JSON.stringify(err));
        };
    };
    const getOffer = async (idCall) => {
        try {
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

           }) 
        } catch (error) {
            Alert.alert("falló al traer oferta", (error))

        }
    };
    const createPeerConnection = async() => {
        peerConnection.addEventListener('connectionstatechange', event => { });
        peerConnection.addEventListener('icecandidate', async event => {
            if (!event.candidate) { return; };
            handleRemoteCandidate(event.candidate);
             localCandidates.push(event.candidate);
    
        });
        peerConnection.addEventListener('icecandidateerror', event => {});
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            console.log(peerConnection.iceConnectionState)
            switch( peerConnection.iceConnectionState ) {
                case 'connected':
                    console.log("peer exitoso");
                case 'completed':
            };
        });
        peerConnection.addEventListener('negotiationneeded', async event => {
           if(isCallerUser){
            setCreatingOffer(true);
           }
        }
        );
        peerConnection.addEventListener('addstream', event => {
            setRemoteMediaStream(event.stream);
            connected(true);
        });
        peerConnection.addEventListener('signalingstatechange', event => {
         });
        peerConnection.addEventListener('removestream', event => { });
        peerConnection.addEventListener("icegatheringstatechange", async (ev) => {
            switch(peerConnection.iceGatheringState) {
              case "complete":
                let data;
                let user = await CacheUtil.getUser()
                if(isCallerUser){
                     data = { candidates: localCandidates, 
                    idCall, idUser: user.idUser , userType:  "caller" };
                    console.log("idcall de candidates", data.idCall);
                } else {
                    data = { candidates: localCandidates, 
                        idCall: idCallIncoming, idUser: user.idUser, userType:  "assistant" };
                    Alert.alert("idCall entrante", JSON.stringify(data.idCall))
                };

                ( await API()).
                post(ROUTES.SEND_CANDIDATES, JSON.stringify(data)).
                then( response => {
                    console.log("enviado al servidor");
                }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
              break
            }
          });
        createDataChanel()
    };
    const createDataChanel = () => {
        datachannel = peerConnection.createDataChannel('my_chanel_webrtcapp');
        datachannel.addEventListener('open', event => { });
        datachannel.addEventListener('close', event => { });
        datachannel.addEventListener('message', message => { });
    };
    const destroyMedia = () => {
        localMediaStream.getTracks().map(
            track => track.stop()
        );

        localMediaStream = null;
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

