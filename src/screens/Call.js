import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { getMedia } from '../../services/ConnectionPeerToPeer.js';
import {ConnectionP2P} from '../../services/ConnectionPeerToPeer.js'
import { Avatar } from '@rneui/themed';


const CallScreen = ({params}) => {
const [acceptedCall, setAcceptedCall] = useState(true);
const [connecingCall, setConnectingCall] = useState(false);
const [connectedCall, setConnectedCall] = useState(false);
useEffect(()=>{

},[])

    return(

        <View style={styles.container} >
        
        <View style={{backgroundColor:"red", flex:8}} >
        <Text>holaaaaaaaaaaa</Text>
        <View>
        <ConnectionP2P
         type={"caller"}
         isCallerUser={false}
         acceptedCall={acceptedCall}
         connecting={setConnectingCall}
         connected={setConnectedCall}
         />
        </View>
        
        </View>
        {(acceptedCall) ? (
             <View style={{backgroundColor:"blue", flexDirection:'row', alignItems:'center', justifyContent:'space-around', flex:2}} >
             <TouchableOpacity>
             <Avatar
               size={72}
               rounded
               icon={{ name: 'pencil', type: 'font-awesome' }}
               containerStyle={{
                 backgroundColor:'red',
                 borderStyle: 'solid',
                 borderWidth: 1,
               }}
             /> 
             </TouchableOpacity>
             <TouchableOpacity>
             <Avatar
               size={72}
               rounded
               icon={{ name: 'pencil', type: 'font-awesome' }}
               containerStyle={{
                 backgroundColor:'green',
                 borderStyle: 'solid',
                 borderWidth: 1
               }}
             /></TouchableOpacity>
         </View>
        ) : (
            <View style={{backgroundColor:"blue", flexDirection:'row', alignItems:'center', justifyContent:'space-around', flex:2}} >
            <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor:'grey',
                borderStyle: 'solid',
                borderWidth: 1,
              }}
            /> 
            </TouchableOpacity>
            <TouchableOpacity>
            <Avatar
              size={72}
              rounded
              icon={{ name: 'pencil', type: 'font-awesome' }}
              containerStyle={{
                backgroundColor:'red',
                borderStyle: 'solid',
                borderWidth: 1
              }}
            /></TouchableOpacity>
        </View>
        )}
       
        </View>
      
    )
}

const styles = StyleSheet.create({
container: {
display:'flex',
flex:1,
flexDirection:'column'
},
buttonCall: {
    backgroundColor:'red',
}
})
export default CallScreen;
