import axios from 'axios';
import { CacheUtil } from './../utils/cache';


export const URL_API = 'https://webrtc-assistance-api.herokuapp.com/';
//export const URL_API = 'http://192.168.1.67:4000/';

import messaging from '@react-native-firebase/messaging';

async function config(URL) {
    return {
      baseURL: URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await messaging().getToken())
            },
    };
}
  
export const API = async () => axios.create(await config(URL_API));

export const ROUTES = {
LOGIN : URL_API + 'login',
STABLISH_CONNECTION: URL_API + 'connection',
SEND_FEEDBACK_USER : URL_API + 'feeback-user',
SEND_FEEDBACK_ASSISTANT : URL_API + 'feeback-assistant',
SEND_OFFER : URL_API + 'call/sendOffer',
SEND_ANSWER : URL_API + 'call/sendAnswer',
SEND_CANDIDATES : URL_API + 'call/sendCandidates'
}