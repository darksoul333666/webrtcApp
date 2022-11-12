import React from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';
import CodePushLoading from './CodePushLoading';
import { CacheUtil } from './utils/cache';
import PushService from './PushService';
import { linking } from './Linking';
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
    <SafeAreaProvider>
      <CodePushLoading />
      <PushService />
      <NavigationContainer linking={linking}>
        <StackNavigator name={routeName}/>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
