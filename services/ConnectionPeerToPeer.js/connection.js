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
                        console.log(JSON.parse(message.data.data).candidate);
                        
                          handleRemoteCandidate(JSON.parse(message.data.data).candidate);
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
            handleRemoteCandidate(event.candidate.candidate);

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
              let tokenn = 'di5gR_AhSaSdZw0aapuMnV:APA91bGOa_mNa4LhtSH9QCPpRK0JeTJL0q2ktD3_ffSknq-gbgB28kwEya040r63J2B37YwV9660lu-BhFyYDKsUK-BDxnfNr7RjN31JUJrmbWk6F7ETh5kICYNUg7EJahhe3EoOAsse';

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
                let tokenn = 'di5gR_AhSaSdZw0aapuMnV:APA91bGOa_mNa4LhtSH9QCPpRK0JeTJL0q2ktD3_ffSknq-gbgB28kwEya040r63J2B37YwV9660lu-BhFyYDKsUK-BDxnfNr7RjN31JUJrmbWk6F7ETh5kICYNUg7EJahhe3EoOAsse';

                if (token === tokenn)

                {    
                    ( await API()).
                    post(ROUTES.SEND_CANDIDATES, JSON.stringify({ candidates: remoteCandidates })).
                    then(
                        res => {
                        }
                    ).catch(
                        error => {
                            Alert.alert("axios", JSON.stringify(error));
                        }
                    )}
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

