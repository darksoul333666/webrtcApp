import React from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';
import CodePushLoading from './CodePushLoading';
import { CacheUtil } from './utils/cache';
import PushService from './PushService';
import { linking } from './Linking';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const tok = await CacheUtil.getToken();
      setToken(tok);
      setTimeout(() => {}, 1000);

    }
    getToken()
  }, []);

  let routeName = (token == null) ? 'Login': 'Home';
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <StripeProvider
        publishableKey={'pk_test_51MaxfDGgyCZxYRF2Yepz5WqEIXOCrW5DstyPkT2T0vOs9xquUP7r2quZYeS7ljoQdJSGFhyEVaNscG6AP8nCWOIO00t67uTLXK'}
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
    <SafeAreaProvider>
      <CodePushLoading />
      <PushService />
      <NavigationContainer linking={linking}>
        <StackNavigator name={routeName}/>
      </NavigationContainer>
    </SafeAreaProvider>
  </StripeProvider>
  </ApplicationProvider>

  );
};

export default App;
