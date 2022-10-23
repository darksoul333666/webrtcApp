import React from 'react';
import { Text, View } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication'
const HomeScreen = ({
    params,
}) => (
    <View>
        <Apple/>
    </View>
);

export default HomeScreen;
