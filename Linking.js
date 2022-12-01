import { Linking, LinkingOptions } from 'react-native';

export const linking: LinkingOptions = {
  prefixes:['webrtcapp://'],
  config: {
    screens: {
      Home: 'Home/:_id',
      Call: 'Call/:isCallerUser?/:idCallIncoming?/:idUser?'
  },
}}
