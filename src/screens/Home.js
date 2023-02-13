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
  // useEffect(() => {
  //   try {
  //     SoundPlayer.playUrl('https://res.cloudinary.com/hoppi-app/video/upload/v1674417769/prod/storie/video/rain-thunder_qg6nof.mp3')
  //   } catch (error) {
  //       console.log(error);
  //   }

  // },[])

    return (
    <View style={{ display:'flex', alignSelf:"center", width:'100%'}} >
       {/* <Button
       title={"Iniciar llamada"}
       onPress={async()=> navigation.navigate("Call", {isCallerUser:"true"}) 
       }/>
         <Button
       title={"Cerrar sesión"}
       onPress={async()=> navigation.navigate("Call", {isCallerUser:true}) 
       }/> */}

    <Video source={{uri: "https://res.cloudinary.com/hoppi-app/video/upload/q_auto:low/v1659915953/dev/hoppi/video/dcq3fnrmqwjvrsvb43hl.mov"}}   // Can be a URL or a local file.
       style={{width:"100%", height:"100%"}}
       paused={false}
       resizeMode={'cover'}
       repeat
       />
    </View>
);}

export default HomeScreen;
