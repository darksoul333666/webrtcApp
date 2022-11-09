import React from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';
import CodePushLoading from './CodePushLoading';
import { CacheUtil } from './utils/cache';
import PushService from './PushService'
const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const tok = await CacheUtil.getToken();
      setToken(tok);
    }
    getToken()
  }, []);

  let routeName = (token == null) ? 'Login ': 'Call';
  console.log("token",token);
  return (
    <SafeAreaProvider>
      <CodePushLoading />
      <PushService />
      <NavigationContainer>
        <StackNavigator name={"Login"}>
        </StackNavigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
