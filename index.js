/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
      id: 'Hola',
      name: 'Default Channel',
    });         
    await notifee.displayNotification({
      title: 'Llamada entrante',
      body: 'Main body content of the notification',
      android: {
        channelId,
        actions: [
          {
            title: 'Rechazar',
            icon: 'https://res.cloudinary.com/hoppi-app/image/upload/v1666807442/dev/storie/image/g2jwogaueq5ykxarv9fv.jpg',
            pressAction: {
              id: 'snooze',
            },
          },
          {
            title: 'Contestar',
            icon: 'https://media.istockphoto.com/vectors/call-answer-icon-phone-dial-symbol-vector-illustration-vector-id1300845651?b=1&k=6&m=1300845651&s=170667a&w=0&h=eopLKHM9OE6i0b2YIUNwTeuVV2RvcPK4pOt1BPSRRmE=',
            pressAction: {
              id: 'asdasdas',
            },
          }
        ],
       smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
})
AppRegistry.registerComponent(appName, () => App);
