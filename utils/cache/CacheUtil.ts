import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN = '@TOKEN';
const USER = '@USER';
const LOGIN_PLATFORM = '@LOGIN_PLATFORM';

type CacheType = {
  setToken: (token: string) => Promise<void>;
  getToken: () => Promise<string>;
  removeToken: () => Promise<void>;
  setUser: (user: Object) => Promise<void>;
  getUser: () => Promise<Object>;
  removeUser: () => Promise<void>;
  setLoginPlatform: (token: string) => Promise<void>;
  getLoginPlatform: () => Promise<string>;
  setSearchPlace: (place: Object) => Promise<void>;
  getSearchPlace: () => Promise<Object>;
  removeSearchPlace: () => Promise<void>;
  removeAll: (callback: any) => Promise<void>;
};

const CacheUtil: CacheType = {
  setToken: (token: string): Promise<void> => {
    return AsyncStorage.setItem(TOKEN, token);
  },
  getToken: async (): Promise<string> => {
    return await AsyncStorage.getItem(TOKEN);
  },
  removeToken: async (): Promise<void> => {
    return await AsyncStorage.removeItem(TOKEN);
  },
  setUser: async (user: Object): Promise<void> => {
    return await AsyncStorage.setItem(USER, JSON.stringify(user));
  },
  getUser: async (): Promise<Object> => {
    const user = await AsyncStorage.getItem(USER);
    return user === null ? { message: 'User not stored' } : JSON.parse(user);
  },
  removeUser: async (): Promise<void> => {
    return await AsyncStorage.removeItem(USER);
  },
  setLoginPlatform: async (token: string) => {
    return await AsyncStorage.setItem(LOGIN_PLATFORM, token);
  },
  getLoginPlatform: async (): Promise<string> => {
    return await AsyncStorage.getItem(LOGIN_PLATFORM);
  },
  removeAll: async (callback: any): Promise<void> => {
    let keys = [TOKEN, USER, LOGIN_PLATFORM];
    return await AsyncStorage.multiRemove(keys, callback);
  },
};

export default CacheUtil;
