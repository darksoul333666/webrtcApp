import React from 'react';
import { Text, View } from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
} from 'react-native-webrtc';

const componentName = ({
    role,
    idCallIncoming,
    microphoneEnabled,
    hangoutCall,
    navigation,
    idCall
}) => {
    let remoteCandidates = [];
    let datachannel;
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const [creatingOffer, setCreatingOffer] = useState(false);
    const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection(peerConstraints));

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
                if (message.data.type === "finalizeCall") {
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
     hangoutCall ? destroyMedia() : null
    },[hangoutCall]);

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

    const createOffer = async () => {
        try {
            if(creatingOffer){
                if(peerConnection.localDescription == null){
                    const offerDescription = await peerConnection.createOffer(sessionConstraints);
                    await peerConnection.setLocalDescription(offerDescription);
                    (await API()).
                        post(ROUTES.SEND_OFFER, JSON.stringify({idCall}))
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

    const sendAnswer = async (_idCall) => {
        try {
            if(peerConnection.localDescription == null ){
                const answerDescription = await peerConnection.createAnswer(sessionConstraints);
                await peerConnection.setLocalDescription(answerDescription);
                processCandidates();
            try {
                (await API()).
                    post(ROUTES.SEND_ANSWER, JSON.stringify({ idCall:_idCall}))
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

















    const createPeerConnection = async() => {
        peerConnection.addEventListener('connectionstatechange', event => {
        if(event === 'failed')  destroyMedia();
         });
         
        peerConnection.addEventListener('icecandidate', async event => {
            if (!event.candidate) { return; };
            handleRemoteCandidate(event.candidate);
           
    
        });
        peerConnection.addEventListener('iceconnectionstatechange', event => { 
            console.log(peerConnection.iceConnectionState);
            if(peerConnection.iceConnectionState === 'disconnected')  destroyMedia();

        });
        peerConnection.addEventListener('negotiationneeded', async event => {
           if(role === 'caller'){
            if(!creatingOffer){
                setCreatingOffer(true);
            }
           }
        }
        );
        peerConnection.addEventListener('addstream', event => {
            setRemoteMediaStream(event.stream);
        });
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
export default componentName;
