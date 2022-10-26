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
        <View style={{width:"70%", display:'flex', justifyContent:'center', alignSelf:'center'}}>
        <Pressable radius={12}
         style={styles.buttonCall}
          onLongPress={()=>{
            getMedia()
        }}>
        <Text>I'm pressable!</Text>
        </Pressable>
        <ConnectionP2P/>
        </View>
    )
}

const styles = StyleSheet.create({
buttonCall: {
    backgroundColor:'red',

}
})
export default CallScreen;
