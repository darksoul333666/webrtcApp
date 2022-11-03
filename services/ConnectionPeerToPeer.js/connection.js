import React, { useEffect, useState } from 'react';
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
    let remoteCandidates = [];

    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [tokenFirebase, setTokenFirebase] = useState('');
    const [creatingOffer, setCreatingOffer] = useState(false);
    const [creatingAnswer, setCreatingAnswer] = useState(true);
    // let  peerConnection = new RTCPeerConnection( peerConstraints );
    const [peerConnection, setPeerConnection] = useState(
        new RTCPeerConnection(peerConstraints)
    )
    let datachannel;

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
                console.log("asdjnasjdnjaskd");

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
                    post(ROUTES.SEND_ANSWER, JSON.stringify({ answer: answerDescription, tokenFirebase: token })).
                    then(
                        res => {
                        }
                    ).catch(error => {
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
                        receiveOffer(message.data.data)
                        break;
                    case "answer":
                        console.log("llego una respuesta");
                        receiveAnswer(message.data.data)
                        break;
                    case "candidate":
                        break;
                }
            })
        }
        handleRemoteMessages()
    }, [])

    const destroyMedia = () => {
        localMediaStream.getTracks().map(
            track => track.stop()
        );

        localMediaStream = null;
    }
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
                        Alert.alert("oferta enviada")
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

    const createPeerConnection = () => {
        peerConnection.addEventListener('connectionstatechange', event => { });
        peerConnection.addEventListener('icecandidate', event => {
            if (!event.candidate) { return; };
            handleRemoteCandidate(event.candidate)
        });
        peerConnection.addEventListener('icecandidateerror', event => { });
        peerConnection.addEventListener('iceconnectionstatechange', event => { });
        peerConnection.addEventListener('negotiationneeded', async event => {
            let token = await messaging().getToken();
            setTokenFirebase(token);
            if (token === 'dk7BRsCESYqDzS-HJWrBJJ:APA91bH6-BBgV95Oz8PpxR7B84P_c8NTAfaS81h3wKEG5quet5iavkjpQ0_dW1gtaOjP7nGFZpDG7PiMBAorbKwlsOZyVwQ_ZWNuBk9xJ8sLu-FlNb-KBxsqxe3ZFBtWyE5WQ3_UpMAS') {
                setCreatingOffer(true);
            }
        }
        );
        peerConnection.addEventListener('addstream', event => {
            console.log("stream agregado", event);
        });
        peerConnection.addEventListener('signalingstatechange', event => { });
        peerConnection.addEventListener('removestream', event => { });
        createDataChanel()
    }

    const createDataChanel = () => {
        datachannel = peerConnection.createDataChannel('my_chanel_webrtcapp');
        datachannel.addEventListener('open', event => { });
        datachannel.addEventListener('close', event => { });
        datachannel.addEventListener('message', message => { });
    }
    const handleRemoteCandidate = (iceCandidate) => {
        iceCandidate = new RTCIceCandidate(iceCandidate);

        if (peerConnection.remoteDescription == null) {
            return remoteCandidates.push(iceCandidate);
        };

        return peerConnection.addIceCandidate(iceCandidate);
    };

    const processCandidates = () => {
        // if ( remoteCandidates.length < 1 ) { return; };
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
            </View>


        )
    )
}

export default ConnectionP2P;

