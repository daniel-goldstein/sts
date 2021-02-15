import React, { useEffect, useState } from 'react';
import {
  Text
} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { IOS_CLIENT_ID } from '@env';
import ScoreStopwatch from './Stopwatch';

type User = GoogleSignIn.GoogleUser;
type MaybeUser = User | null;

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const Auth = () => {
  const [user, setUser] = useState<MaybeUser>(null);

  const syncUser = () => {
    GoogleSignIn.signInSilentlyAsync().then(setUser);
  }

  useEffect(() => {
    GoogleSignIn.initAsync({
      clientId: IOS_CLIENT_ID,
      scopes: SCOPES,
    }).then(syncUser);
  });

  const signIn = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success' && user) {
        setUser(user);
      }
    } catch ({ message }) {
      alert(`Login failed: ${message}`);
    }
  }

  if (user !== null) {
    return <ScoreStopwatch user={user} />;
  }

  return <Text onPress={signIn}>Sign in</Text>;
}

export default Auth;
