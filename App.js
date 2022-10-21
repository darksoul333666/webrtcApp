/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Text,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';

const App: () => Node = () => {

  return (
    <SafeAreaProvider>
       <NavigationContainer>
   <StackNavigator name="Start">

  </StackNavigator>
  </NavigationContainer>
    </SafeAreaProvider>
   
  );
};

export default App;
