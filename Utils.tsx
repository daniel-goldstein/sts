import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const fmtMillis = (msec: number) => `${msec / 1000}s`

export const store = async (key: string, value: Object) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }
}


export const retrieve = async <T, >(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) as T : null;
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }

  // This should never happen
  return null;
}