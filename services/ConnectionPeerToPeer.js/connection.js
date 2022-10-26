import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
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
    
    let mediaConstraints = {
        audio: true,
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
    

    useEffect(()=>{
        getMedia()
    },[])
    useEffect(()=>{
       console.log("valor",localMediaStream)
    },[localMediaStream])
    const [localMediaStream, setLocalMediaStream] = useState(null);
    let  peerConnection = new RTCPeerConnection( peerConstraints );
    let  datachannel;

    
     const getMedia = async () => {
        try {
            const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
                setLocalMediaStream(mediaStream);
                createPeerConnection()
        } catch( err ) {
            console.log("ERROR",err)
        };
    }
    
    
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
    createOffer()
    }
    const createOffer = async() => {
        try {
            const offerDescription = await peerConnection.createOffer( sessionConstraints );
            await peerConnection.setLocalDescription( offerDescription );
            createAnswer()
            // Send the offerDescription to the other participant.
        } catch( err ) {
            // Handle Errors
        };
    }

const createAnswer = async() => {
    try {
        // Use the received offerDescription
        const offerDescription = new RTCSessionDescription( offerDescription );
        await peerConnection.setRemoteDescription( offerDescription );
    
        const answerDescription = await peerConnection.createAnswer( sessionConstraints );
        await peerConnection.setLocalDescription( answerDescription );
    
        // Send the answerDescription back as a response to the offerDescription.
    } catch( err ) {
        // Handle Errors
    };
}
    return(
   (  (localMediaStream !== null) && 
   <RTCView
	mirror={true}
	objectFit={'cover'}
	streamURL={localMediaStream.toURL()}
	zOrder={10}
    />)
    )
}

export default ConnectionP2P;

