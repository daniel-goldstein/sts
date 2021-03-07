import { Alert } from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as AppAuth from 'expo-app-auth';
import Constants from 'expo-constants';
import { IOS_CLIENT_ID, EXPO_IOS_CLIENT_ID } from '@env';
import { store, retrieve } from './Utils';

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const logInConfig = {
  iosClientId: EXPO_IOS_CLIENT_ID,
  iosStandaloneAppClientId: IOS_CLIENT_ID,
  scopes: SCOPES,
};

const refreshConfig = {
  issuer: 'https://accounts.google.com',
  clientId: Constants.appOwnership === "standalone" ? IOS_CLIENT_ID : EXPO_IOS_CLIENT_ID,
  scopes: SCOPES,
};

const storeUserInfo = async (
  accessToken: string, refreshToken: string, tokenExpiration: Date
) => {
  await store('accessToken', accessToken);
  await store('refreshToken', refreshToken);
  await store('tokenExpiration', tokenExpiration);
}

const refresh = async (refreshToken: string) => {
  const res = await AppAuth.refreshAsync(refreshConfig, refreshToken);
  if (res.refreshToken && res.accessToken && res.accessTokenExpirationDate) {
    await storeUserInfo(
      res.accessToken,
      res.refreshToken,
      new Date(Date.parse(res.accessTokenExpirationDate))
    );
  } else {
    Alert.alert(`Bad refresh: ${JSON.stringify(res)}`);
  }
}

const mustRefresh = (tokenExpiration: Date) => {
  const tooLate = new Date();
  tooLate.setMinutes(tooLate.getMinutes() + 10);
  return tokenExpiration < tooLate;
}

const signIn = async () => {
  try {
    /* await GoogleSignIn.askForPlayServicesAsync(); */ // TODO Android
    const res = await Google.logInAsync(logInConfig);
    if (res.type === 'success') {
      if (res.accessToken && res.refreshToken) {
        await storeUserInfo(res.accessToken, res.refreshToken, new Date());
      } else {
        Alert.alert(`Bad login: ${JSON.stringify(res)}`);
      }
    }
  } catch ({ message }) {
    Alert.alert(`Login failed: ${message}`);
  }
}

const retrieveData = async () => {
  const refreshToken = await retrieve<string>('refreshToken');
  const accessToken = await retrieve<string>('accessToken');
  const tokenExpiration = await retrieve<Date>('tokenExpiration');

  return { refreshToken, accessToken, tokenExpiration };
}

const retrieveAccessToken = async (): Promise<string> => {
  const { refreshToken, accessToken, tokenExpiration } = await retrieveData();

  if (refreshToken === null || accessToken === null || tokenExpiration === null) {
    await signIn();
    const { accessToken } = await retrieveData();
    // They must have cancelled
    if (accessToken === null) {
      return '';
    } else {
      return await retrieveAccessToken();
    }
  }

  if (mustRefresh(tokenExpiration)) {
    await refresh(refreshToken);
    return await retrieveAccessToken();
  }

  return accessToken;
}

export default retrieveAccessToken;
