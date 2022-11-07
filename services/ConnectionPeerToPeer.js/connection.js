import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import RNCallKeep from 'react-native-callkeep';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    mediaDevices,
} from 'react-native-webrtc';
import { API, ROUTES } from '../../api';
const ConnectionP2P = ({ params }) => {

    let mediaConstraints = {
        audio: true,
        isOnlyVoice: false,
        video: {
            frameRate: 30,
            facingMode: 'user'
        }
    };

    let peerConstraints = {
        iceServers: [{
            urls: [ "stun:ws-turn4.xirsys.com" ]}, 
            {username: "OUKzyQ7dJ7RLp3oMYmHwPMkmDS8jIuojMzswbeCRfv_VyJpP26uc5VTCu0UuYUIzAAAAAGNkVIBKYWlyb0NhbWFyaWxsbw==",
            credential: "bbad8616-5bd2-11ed-96e5-0242ac140004",
            urls: [
            "turn:ws-turn4.xirsys.com:80?transport=udp",
            "turn:ws-turn4.xirsys.com:3478?transport=udp",
            "turn:ws-turn4.xirsys.com:80?transport=tcp",
            "turn:ws-turn4.xirsys.com:3478?transport=tcp",
            "turns:ws-turn4.xirsys.com:443?transport=tcp",
             "turns:ws-turn4.xirsys.com:5349?transport=tcp"
            ]}]
    };
    let sessionConstraints = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
            VoiceActivityDetection: true
        }
    };
    let remoteCandidates = [];

    const options = {
        ios: {
          appName: 'My app name',
        },
        android: {
          alertTitle: 'Permissions required',
          alertDescription: 'This application needs to access your phone accounts',
          cancelButton: 'Cancel',
          okButton: 'ok',
          imageName: 'phone_account_icon',
        //   additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
          // Required to get audio in background when using Android 11
          foregroundService: {
            channelId: 'my_chanel_webrtcapp',
            channelName: 'Foreground service for my app',
            notificationTitle: 'My app is running on background',
            notificationIcon: 'Path to the resource icon of the notification',
          }, 
        }
      };

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [tokenFirebase, setTokenFirebase] = useState('');
    const [creatingOffer, setCreatingOffer] = useState(false);
    const [creatingAnswer, setCreatingAnswer] = useState(true);
    const [peerConnection, setPeerConnection] = useState(
        new RTCPeerConnection(peerConstraints)
    )
    let datachannel;
    RNCallKeep.setup(options).then(accepted => {});

    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
                setLocalMediaStream(mediaStream);
            } catch (err) {
                console.log("ERROR", err)
            };
        }
        getMedia()
    }, [])

    useEffect(() => {
        const createOfferCall = async () => {
            if (localMediaStream !== null) {
                peerConnection.addStream(localMediaStream);
                createPeerConnection()
            }
        }
        createOfferCall()
    }, [localMediaStream]);

    useEffect(() => {
        if (creatingOffer) {
            createOffer();
        }
    }, [creatingOffer]);

    const receiveAnswer = async (answer) => {
        setCreatingAnswer(false);
        setCreatingAnswer(false)
        try {
            if (creatingAnswer) {
                console.log("seteando respuesta");
                const remoteDesc = new RTCSessionDescription(JSON.parse(answer));
                await peerConnection.setRemoteDescription(remoteDesc);
                peerConnection.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => {
                        localMediaStream.addTrack(event.streams[0]); // tried with passing `track` as well

                    });
                };

            } else return;


        } catch (error) {
            console.log("ERROR al setear respuesta", error)
        }
    }

    const receiveOffer = async (offer) => {
        try {
            const offerDescription = new RTCSessionDescription(JSON.parse(offer));
            await peerConnection.setRemoteDescription(offerDescription);

            const answerDescription = await peerConnection.createAnswer(sessionConstraints);
            await peerConnection.setLocalDescription(answerDescription);

            processCandidates()
            let token = await messaging().getToken();
            try {
                (await API()).
                    post(ROUTES.SEND_ANSWER, JSON.stringify({ answer: answerDescription, token: token })).
                    then(
                        res => {
                        }
                    ).catch(error => {
                        console.log(error);
                    })
            } catch (error) {
                Alert.alert("Servidor FALLÓ AL RECIBIR OFERTA", (error))
            }
        } catch (err) {
            Alert.alert("ERROR al setear oferta", JSON.stringify(err))
        };
    }

    useEffect(() => {
        const handleRemoteMessages = () => {
            messaging().onMessage(async (message) => {
                switch (message.data.type) {
                    case "offer":
                        receiveOffer(message.data.data);
                        break;
                    case "answer":
                        console.log("llego una respuesta");
                        receiveAnswer(message.data.data)
                        break;
                    case "candidate":                        
                          handleRemoteCandidate(JSON.parse(message.data.data));
                        break;
                }
            })
        }
        handleRemoteMessages()
    }, [])

    const createOffer = async () => {
        try {
            console.log("enviando oferta");
            const offerDescription = await peerConnection.createOffer(sessionConstraints);
            await peerConnection.setLocalDescription(offerDescription);
            let token = await messaging().getToken();
            (await API()).
                post(ROUTES.SEND_OFFER, JSON.stringify({ offer: offerDescription, tokenFirebase: token })).
                then(
                    res => {
                        console.log("oferta enviada")
                    }
                ).catch(
                    error => {
                        Alert.alert("axios", JSON.stringify(error));
                    }
                )

            console.log("terminando de enviar");
        } catch (err) {
            Alert.alert("error al crear oferta", JSON.stringify(err));
        };
    };

    const createPeerConnection = async() => {
        let token = await messaging().getToken();
        peerConnection.addEventListener('connectionstatechange', event => { });
        peerConnection.addEventListener('icecandidate', async event => {
            if (!event.candidate) { return; };
            handleRemoteCandidate(event.candidate);
           
            ( await API()).
            post(ROUTES.SEND_CANDIDATES, JSON.stringify({ candidates: [event.candidate], token })).
            then(
                res => {
                }
            ).catch(
                error => {
                    Alert.alert("axios", JSON.stringify(error));
                }
            )

        });
        peerConnection.addEventListener('icecandidateerror', event => {
            console.log("error ice candidate", event);
         });
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            console.log(peerConnection.iceConnectionState)
            switch( peerConnection.iceConnectionState ) {
                case 'connected':
                    console.log("peer exitoso");
                case 'completed':
            };
        });
        peerConnection.addEventListener('negotiationneeded', async event => {
            setTokenFirebase(token);
            let tokenn = 'dk7BRsCESYqDzS-HJWrBJJ:APA91bH6-BBgV95Oz8PpxR7B84P_c8NTAfaS81h3wKEG5quet5iavkjpQ0_dW1gtaOjP7nGFZpDG7PiMBAorbKwlsOZyVwQ_ZWNuBk9xJ8sLu-FlNb-KBxsqxe3ZFBtWyE5WQ3_UpMAS'
            console.log("lanzando");
            if (token === tokenn) {
                setCreatingOffer(true);
            }
        }
        );
        peerConnection.addEventListener('addstream', event => {
            console.log("stream agregado", event);
            setRemoteMediaStream(event.stream)
        });
        peerConnection.addEventListener('signalingstatechange', event => {
            console.log("event", event);
         });
        peerConnection.addEventListener('removestream', event => { });
        peerConnection.addEventListener("icegatheringstatechange", async (ev) => {
            switch(peerConnection.iceGatheringState) {
              case "new":
                console.log("ice nuevo");
                /* gathering is either just starting or has been reset */
                break;
              case "gathering":
                console.log("ice empezando");

                break;
              case "complete":
              break
            }
          });
        createDataChanel()
    }

    const createDataChanel = () => {
        datachannel = peerConnection.createDataChannel('my_chanel_webrtcapp');
        datachannel.addEventListener('open', event => { });
        datachannel.addEventListener('close', event => { });
        datachannel.addEventListener('message', message => { });
    }
    const destroyMedia = () => {
        localMediaStream.getTracks().map(
            track => track.stop()
        );

        localMediaStream = null;
    }
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
        ((localMediaStream) &&
            <View style={{ ...StyleSheet.objectFit, flex: 1 }} >
                <RTCView
                    mirror={true}
                    style={{ flex: 1, }}
                    objectFit={'cover'}
                    streamURL={localMediaStream.toURL()}
                />
                <TextInput
                    onChangeText={() => { }}
                    value={tokenFirebase}
                    placeholder="useless placeholder"
                />
            {/* ((remoteMediaStream) &&(
                
            )) */}
            {remoteMediaStream && (
                <RTCView
                    mirror={true}
                    style={{ flex: 1, }}
                    objectFit={'cover'}
                    streamURL={remoteMediaStream.toURL()}
                />
            )}
            </View>


        )

    )
}

export default ConnectionP2P;

