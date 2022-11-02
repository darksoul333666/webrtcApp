import React from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './routes';
import CodePushLoading from './CodePushLoading';
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
  useEffect(() => {
    console.log(token)
  }, [token])
  let routeName = token === null ? 'Call' : 'Home';
  return (
    <SafeAreaProvider>
      <CodePushLoading />
      <NavigationContainer>
        <StackNavigator name={routeName}>
        </StackNavigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
