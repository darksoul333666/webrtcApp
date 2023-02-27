import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../src/screens';
import { LoginScreen } from '../src/screens';
import { CallScreen } from '../src/screens';
import { AudioScreen } from '../src/screens/components';
import { VideoScreen } from '../src/screens/components';
import { PaymentsScreen } from '../src/screens/components';
import { StripeScreen } from '../src/screens/components/payments';
import { WebComponent } from '../src/screens/components/payments';
const Stack = createNativeStackNavigator();

const StackNavigator = ({name}) => {
  return (
      <Stack.Navigator
      initialRouteName={name}
      >
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="Video" component={VideoScreen} />
        <Stack.Screen name="Audio" component={AudioScreen } />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        {/* <Stack.Screen name="Stripe" component={StripeScreen} />
        <Stack.Screen name="Mercado" component={WebComponent} /> */}

      </Stack.Navigator>
  );
};

export default StackNavigator;