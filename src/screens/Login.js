import React from 'react';
import { Text, View, Button } from 'react-native';
import {GoogleButtonSignIn} from '../../services/auth-services';
const LoginScreen = ({

}) => (
    <View>
        <GoogleButtonSignIn/>
    </View>
);

export default LoginScreen;
