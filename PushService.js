import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const PushService = ({params}) => {
const [initial, setInitial] = useState(false);
  useEffect(()=>{
    const getInitialNotification = async() => {
      const initialNotification = await notifee.getInitialNotification();
      if(initialNotification){
        console.log('Press action used to open the app', initialNotification.pressAction);

        if (initialNotification) {

          // console.log('Press action used to open the app', initialNotification.pressAction);
        }
      }
         
    }
    getInitialNotification()
  },[initial])

    useEffect(()=>{
        const pushNotificationsListener = async() =>{
            
            messaging().onMessage(async(remoteMessage) => {
              console.log("draga");

                switch (remoteMessage.data.type) {
                    case "offer":
                    
                        break;
                    case "answer":
                        
                        break;
                    case "candidate":                        
                        break;
                }
            });

            // messaging().getInitialNotification().then(async(message)=>{
            //   await notifee.requestPermission();
            //   const channelId = await notifee.createChannel({
            //       id: 'default',
            //       name: 'Default Channel',
            //     });         
            //     await notifee.displayNotification({
            //       title: 'Llamada entrante',
            //       body: 'Main body content of the notification',
            //       android: {
            //         channelId,
            //         actions: [
            //           {
            //             title: 'Rechazar',
            //             icon: 'https://res.cloudinary.com/hoppi-app/image/upload/v1666807442/dev/storie/image/g2jwogaueq5ykxarv9fv.jpg',
            //             pressAction: {
            //               id: 'snooze',
            //             },
            //           },
            //           {
            //             title: 'Contestar',
            //             icon: 'https://media.istockphoto.com/vectors/call-answer-icon-phone-dial-symbol-vector-illustration-vector-id1300845651?b=1&k=6&m=1300845651&s=170667a&w=0&h=eopLKHM9OE6i0b2YIUNwTeuVV2RvcPK4pOt1BPSRRmE=',
            //             pressAction: {
            //               id: 'snooze',
            //             },
            //           }
            //         ],
            //        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            //         // pressAction is needed if you want the notification to open the app when pressed
            //         pressAction: {
            //           id: 'default',
            //         },
            //       },
            //     });
            //     setInitial(true)
            // })
        }
        pushNotificationsListener()
    },[])

    return null;
}

export default PushService;
