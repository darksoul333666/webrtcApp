import axios from 'axios';
import { CacheUtil } from './../utils/cache';

//export const URL_API = 'https://master--jocular-cocada-6e8224.netlify.app/';
export const URL_API = 'http://192.168.1.73:4000/';

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
LOGIN : URL_API + 'user/login',
STABLISH_CONNECTION: URL_API + 'connection',
SEND_FEEDBACK_USER : URL_API + 'feeback-user',
SEND_FEEDBACK_ASSISTANT : URL_API + 'feeback-assistant',
SEND_OFFER : URL_API + 'call/sendOffer',
GET_OFFER: URL_API + 'call/getOffer',
SEND_ANSWER : URL_API + 'call/sendAnswer',
SEND_CANDIDATES : URL_API + 'call/sendCandidates',
GET_CANDIDATES: URL_API + 'call/getCandidates',
GET_ANSWER: URL_API + 'call/getAnswer',
UPDATE_TOKEN_FIREBASE: URL_API + 'user/updateToken',
REQUEST_CALL: 'call/requestCall',
RESPONSE_CALL: 'call/responseCall',
GET_IMAGE:URL_API+'user/getImage'
}