import React, { useEffect, useState } from 'react';
import {
  Text
} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { IOS_CLIENT_ID } from '@env';

type User = GoogleSignIn.GoogleUser;
type MaybeUser = User | null;

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const Auth = ({ children }) => {

  const [user, setUser] = useState<MaybeUser>(null);

  const syncUser = () => {
    GoogleSignIn.signInSilentlyAsync().then(setUser);
  }

  useEffect(() => {
    GoogleSignIn.initAsync({
      clientId: IOS_CLIENT_ID,
    }).then(syncUser);
  });

  const signIn = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        syncUser();
      }
    } catch ({ message }) {
      alert(`Login failed: ${message}`);
    }
  }

  return (
    user ?
    <>
      {children}
    </>
    :
    <Text onPress={signIn}>Sign in</Text>
  );
}

export default Auth;
