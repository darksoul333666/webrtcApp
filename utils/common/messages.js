import { Linking, Alert } from 'react-native';
import { NativeModules } from 'react-native';

const message = message => {
  Alert.alert('hoppi', message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK' },
  ]);
};

const messageNotPermissions = message => {
  Alert.alert('hoppi', message, [
    {
      text: 'Cancel',
      onPress: () => NativeModules.DevSettings.reload(),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => Linking.openSettings() },
  ]);
};

export { message, messageNotPermissions };
