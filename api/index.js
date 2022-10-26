import axios from 'axios';
import { CacheUtil } from './../utils/cache';
export const URL_API = 'wwww.api.com/';

async function config(URL) {
    return {
      baseURL: URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await CacheUtil.getToken()),
      },
    };
}
  
export const API = async () => axios.create(await config(URL_API));

export const ROUTES = {
LOGIN : URL_API + 'login',
STABLISH_CONNECTION: URL_API + 'connection',
SEND_FEEDBACK_USER : URL_API + 'feeback-user',
SEND_FEEDBACK_ASSISTANT : URL_API + 'feeback-assistant'
}