import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import {GoogleButtonSignIn} from '../../services/auth-services';
import messaging from '@react-native-firebase/messaging'

const LoginScreen = ({navigation}) => {
    useEffect(()=>{
        const getToken = async() =>{
            await messaging().requestPermission({
                sound: true,
                badge: true,
                alert: true,
              });
           
        }
        getToken()
    },[])
    return(
    <View>
        <GoogleButtonSignIn
        navigation={navigation}
        />
    </View>
);
}
export default LoginScreen;
