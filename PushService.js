import React, { useEffect, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Link, useLinkTo } from '@react-navigation/native';

const PushService = ({params}) => {
const linkTo = useLinkTo();
const [initial, setInitial] = useState(false);
  useEffect(()=>{
    const getInitialNotification = async() => {
      const initialNotification = await notifee.getInitialNotification();
      if(initialNotification){
        console.log('Press action used to open the app', initialNotification.pressAction);

        if (initialNotification) {

        }
      }
         
    }
    getInitialNotification()
  },[initial])

    useEffect(()=>{
        const pushNotificationsListener = async() =>{
            
            messaging().onMessage(async(remoteMessage) => {
              console.log("remoto",remoteMessage);
                switch (remoteMessage.data.type) {
                    case "offer":
                      Linking.openURL('webrtcapp:/Call/'+"false/"+ remoteMessage.data.idCall )
                        break;
                }
            });
        }
        pushNotificationsListener()
    },[])

    return null;
}

export default PushService;
