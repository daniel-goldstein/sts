import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const store = async (key: string, value: Object) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }
}

const retrieve = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }
}

export { store, retrieve };
