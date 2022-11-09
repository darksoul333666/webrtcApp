import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import uuid4 from 'random-uuid-v4';

const HomeScreen = ({
    params,
}) => {
    useEffect(()=>{
        console.log(uuid4());

    },[])
    
    return (
    <View>
       <TouchableOpacity>
        <Text>LLamar</Text>
       </TouchableOpacity>
    </View>
);}

export default HomeScreen;
