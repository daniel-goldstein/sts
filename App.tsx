import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Stopwatch from './Stopwatch';
import { TrialsList } from './Trials';
import { TrialDataScreen } from './TrialDataScreen';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

const initDb = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS trials (id integer primary key not null, name text)`
    );
    tx.executeSql(
`CREATE TABLE IF NOT EXISTS intervals (
  id integer primary key not null,
  FOREIGN KEY(trial_id) REFERENCES trials(id),
  start integer, end integer
)`
    );
  });
}

const Stack = createStackNavigator();
export default function App() {
  React.useEffect(initDb, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Trials">
        <Stack.Screen name="Trials" component={TrialsList}/>
        <Stack.Screen name="Stopwatch" component={Stopwatch}/>
        <Stack.Screen name="Trial Data" component={TrialDataScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
