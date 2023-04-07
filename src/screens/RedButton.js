import { Button } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import color from '../../utils/theme/colors';
import { Text } from './components';

const RedButtonScreen = ({navigation}) => {
    const requestEstimatedTime = async() => {

    }


    return(
    <View>
        <Text category={'s2'} style={{color: color.black, marginVertical:15 }} > Tiempo estimado de respuesta: </Text>
        <Button onPress={() => navigation.navigate('Call') } style={{width:160, alignSelf:'center'}} status='basic'> Llamar</Button>
    </View>
    )
}

export default RedButtonScreen;
