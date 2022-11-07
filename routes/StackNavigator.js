import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../src/screens';
import { LoginScreen } from '../src/screens';
import { CallScreen } from '../src/screens'
const Stack = createNativeStackNavigator();

const StackNavigator = ({name}) => {
  console.log("name", name);
  return (
      <Stack.Navigator
      initialRouteName={"Call"}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
      </Stack.Navigator>
  );
};

export default StackNavigator;