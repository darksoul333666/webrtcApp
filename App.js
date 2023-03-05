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
import { ApplicationProvider, Layout, Button } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import { Theme } from './utils/uikitten';
import * as eva from '@eva-design/eva';

const App = () => {
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    console.log(nextTheme);
    setTheme(nextTheme);
  };


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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
  <ApplicationProvider {...eva} theme={eva[theme]}>
    <StripeProvider
        publishableKey={'pk_test_51MaxfDGgyCZxYRF2Yepz5WqEIXOCrW5DstyPkT2T0vOs9xquUP7r2quZYeS7ljoQdJSGFhyEVaNscG6AP8nCWOIO00t67uTLXK'}
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
    <SafeAreaProvider>
    <NavigationContainer linking={linking}>
        <StackNavigator name={"Home"}/>
      </NavigationContainer>
      <CodePushLoading />
      <PushService />
      
    </SafeAreaProvider>
    </StripeProvider>
     
    </ApplicationProvider>
    </ThemeContext.Provider>
  );
};

export default App;
