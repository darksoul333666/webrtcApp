import React, { useEffect, useContext } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import { Button, Layout, Text } from '@ui-kitten/components';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import Video from 'react-native-fast-video';
import SoundPlayer from 'react-native-sound-player'
import database from '@react-native-firebase/database';
import { ThemeContext } from '../../theme-context';

const HomeScreen = ({navigation}) => {

  const themeContext = useContext(ThemeContext);


    useEffect(() => {
      let idCall='123456';
      let typeUser='caller';
      database()
      .ref(`calls/${idCall}/${typeUser}Candidates`)
      .on('value', snapshot => {
      // console.log('User data: ', Object.entries(snapshot?.val()));
      let candidate = Object.entries(snapshot?.val()).forEach(e => console.log(e[1].candidate))
      // handleRemoteCandidate(JSON.parse(candidate))


    });
    }, []);

    return (
    <Layout style={{ display:'flex', flex:1, alignItems:'center', justifyContent:'space-around',   }} >
       <Button
       onPress={()=> navigation.navigate("Chat") 
       }> Solicitar chat</Button> 
        <Button style={{ marginVertical: 4 }} onPress={themeContext.toggleTheme}>Cambiar modo</Button>
       <Text>Iu kitten</Text>
      
   
    </Layout>
);}

export default HomeScreen;
