import React, { useEffect } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import { Button } from '@ui-kitten/components';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import Video from 'react-native-fast-video';
import SoundPlayer from 'react-native-sound-player'
import database from '@react-native-firebase/database';

const HomeScreen = ({navigation}) => {

    useEffect(() => {
      let idCall='123456';
      let typeUser='caller';
      database()
      .ref(`calls/${idCall}/${typeUser}Candidates`)
      .on('value', snapshot => {
      // console.log('User data: ', Object.entries(snapshot?.val()));
      let candidate = Object.entries(snapshot?.val()).forEach(e => console.log(e[1].candidate))
      // handleRemoteCandidate(JSON.parse(candidate))


    });
    }, []);

    return (
    <View style={{ display:'flex', height:200, alignItems:'center', justifyContent:'space-around',   }} >
       <Button
       onPress={()=> navigation.navigate("Audio") 
       }> Reproducir audio</Button> 
         <Button
       title={"Reproducir video"}
       onPress={()=> navigation.navigate("Video") 
       }/>
         <Button
       title={"Realizar pago"}
       onPress={()=> navigation.navigate("Payments") 
       }/>

   
    </View>
);}

export default HomeScreen;
