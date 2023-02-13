import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@rneui/base';
import SoundPlayer from 'react-native-sound-player';

const AudioScreen = ({}) => { 
    const playAudio = async() => {
    try {
      SoundPlayer.playUrl('https://res.cloudinary.com/hoppi-app/video/upload/v1674417769/prod/storie/video/rain-thunder_qg6nof.mp3')
    } catch (error) {
        console.log(error);
    }
    }
    const stopAudio = async() => {
        try {
          SoundPlayer.stop()
        } catch (error) {
            console.log(error);
        }
        }
    
    return(<View>
     <Button
       title={"Play"}
       onPress={playAudio} 
       />
    <Button
       title={"Stop"}
       onPress={stopAudio} 
       />
    </View>)
}

export default AudioScreen;
