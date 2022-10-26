/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import  {Node, useEffect, useState} from 'react';
import {
  Text,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';
import { CacheUtil } from './utils/cache';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const tok = await CacheUtil.getToken();
      setToken(tok);
    }
    getToken()
  }, []);
  useEffect(()=>{
    console.log(token)
  },[token])
  let routeName = token === null ? 'Login' : 'Home';
  console.log(routeName);
  return (
    <SafeAreaProvider>
       <NavigationContainer>
   <StackNavigator name={routeName}>

  </StackNavigator>
  </NavigationContainer>
    </SafeAreaProvider>
   
  );
};

export default App;
