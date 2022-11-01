import React, { useEffect } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { getMedia } from '../../services/ConnectionPeerToPeer.js';
import {ConnectionP2P} from '../../services/ConnectionPeerToPeer.js'
const CallScreen = ({
    params,
}) => {

useEffect(()=>{

},[])

    return(
      
        <ConnectionP2P/>
    )
}

const styles = StyleSheet.create({
buttonCall: {
    backgroundColor:'red',

}
})
export default CallScreen;
