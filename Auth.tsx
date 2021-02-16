import React, { useEffect, useState } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as AppAuth from 'expo-app-auth';
import Constants from 'expo-constants';
import { IOS_CLIENT_ID, EXPO_IOS_CLIENT_ID } from '@env';
import ScoreStopwatch from './Stopwatch';

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

const Auth = () => {
  const [user, setUser] = useState<Google.GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState(new Date());

  const refresh = async () => {
    const res = await AppAuth.refreshAsync(refreshConfig, refreshToken);
    if (res.refreshToken && res.accessToken && res.accessTokenExpirationDate) {
      setRefreshToken(res.refreshToken);
      setAccessToken(res.accessToken);
      setTokenExpiration(new Date(Date.parse(res.accessTokenExpirationDate)));
    } else {
      Alert.alert(`Bad refresh: ${JSON.stringify(res)}`);
    }
  }

  const mustRefresh = () => {
    const tooLate = new Date();
    tooLate.setMinutes(tooLate.getMinutes() + 10);
    return tokenExpiration < tooLate;
  }

  const storeGoogleData = (res: Google.LogInResult) => {
    if (res.type === 'success') {
      if (res.accessToken && res.refreshToken && res.user) {
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        setUser(res.user);
        setTokenExpiration(new Date());
      } else {
        Alert.alert(`Bad login: ${JSON.stringify(res)}`);
      }
    }
  }

  const signIn = async () => {
    try {
      /* await GoogleSignIn.askForPlayServicesAsync(); */ // TODO Android
      storeGoogleData(await Google.logInAsync(logInConfig));
    } catch ({ message }) {
      Alert.alert(`Login failed: ${message}`);
    }
  }

  useEffect(() => {
    if (user && mustRefresh()) {
      refresh();
    }
  });

  if (user !== null) {
    return <ScoreStopwatch accessToken={accessToken} />;
  }

  return <Text onPress={signIn}>Sign in</Text>;
}

export default Auth;
