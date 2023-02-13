import React, { useEffect } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import { Button } from '@rneui/base';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import Video from 'react-native-fast-video';
import SoundPlayer from 'react-native-sound-player'

const HomeScreen = ({navigation}) => {
  // useEffect(()=>{
  //   const update = async () => {
  //     let token = await messaging().getToken();
  //     let user = await CacheUtil.getUser();
  //     (await API())
  //     .post(ROUTES.UPDATE_TOKEN_FIREBASE, JSON.stringify({token, idUser:user.idUser}))
  //     .catch()
  //   };
  //   update();
  // },[])
 

    return (
    <View style={{ display:'flex', height:200, alignItems:'center', justifyContent:'space-around',   }} >
       <Button
       title={"Reproducir audio"}
       onPress={()=> navigation.navigate("Audio") 
       }/>
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
