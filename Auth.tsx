import React from 'react';
import { Alert } from 'react-native';
import * as AppAuth from 'expo-app-auth';
import Constants from 'expo-constants';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { IOS_CLIENT_ID, EXPO_IOS_CLIENT_ID } from '@env';
import { store, retrieve } from './Utils';

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const appAuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: Constants.appOwnership === "standalone" ? IOS_CLIENT_ID : EXPO_IOS_CLIENT_ID,
  scopes: SCOPES,
};

const storeUserInfo = async (res: AppAuth.TokenResponse | null) => {
  await store('authData', res);
}

const retrieveUserInfo = async () => {
  return await retrieve<AppAuth.TokenResponse>('authData');
}

const refresh = async (refreshToken: string) => {
  await storeUserInfo(await AppAuth.refreshAsync(appAuthConfig, refreshToken));
  return true;
}

const signIn = async () => {
  try {
    await storeUserInfo(await AppAuth.authAsync(appAuthConfig));
  } catch ({ message }) {
    Alert.alert(`Login failed: ${message}`);
  }
}

const mustRefresh = (tokenExpiration: string) => {
  return new Date(tokenExpiration) < new Date();
}

const LogoutButton = () => {

  const logout = async () => {
    await storeUserInfo(null);
    Alert.alert('Logged out!');
  }

  return (
    <TouchableOpacity onPress={logout}>
      <AntDesign name="logout" size={24} color="black" />
    </TouchableOpacity>
  );
}

const retrieveAccessToken = async (): Promise<string> => {
  const userInfo = await retrieveUserInfo();

  if (userInfo === null ||
      userInfo.refreshToken === null ||
      userInfo.accessToken === null ||
      userInfo.accessTokenExpirationDate === null) {
    await signIn();
    // They must have cancelled
    if (await retrieveUserInfo() === null) {
      return '';
    } else {
      return await retrieveAccessToken();
    }
  }

  const { refreshToken, accessToken, accessTokenExpirationDate } = userInfo;
  if (mustRefresh(accessTokenExpirationDate)) {
    try {
      await refresh(refreshToken);
    } catch ({ message }) {
      Alert.alert(`Google auth refresh failed: ${message}. Please sign out and sign back in.`);
    }
  }

  return accessToken;
}

export {
  retrieveAccessToken,
  LogoutButton
};
