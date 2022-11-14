import React, { useEffect } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import { Button } from '@rneui/base';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';

const HomeScreen = ({navigation}) => {
  useEffect(()=>{
    const update = async () => {
      let token = await messaging().getToken();
      let user = await CacheUtil.getUser();
      (await API())
      .post(ROUTES.UPDATE_TOKEN_FIREBASE, JSON.stringify({token, idUser:user.idUser}))
      .catch()
    };
    update();
  },[])

    return (
    <View style={{ display:'flex', alignSelf:"center", width:'50%', justifyContent:"center", flexDirection:'column'}} >
       <Button
       title={"Iniciar llamada"}
       onPress={async()=> navigation.navigate("Call", {isCallerUser:"true"}) 
       }/>
         <Button
       title={"Cerrar sesión"}
       onPress={async()=> navigation.navigate("Call", {isCallerUser:true}) 
       }/>
    </View>
);}

export default HomeScreen;
