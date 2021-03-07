import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Stopwatch from './Stopwatch';
import { TrialsList } from './Trials';
import { TrialDataScreen } from './TrialDataScreen';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

const executeSql = async (sql: string) => {
  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(sql, [], resolve, (_, error) => {
        console.log(error); reject(); return false });
    });
  });
}

const initDb = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS trials (id integer primary key not null, name text)`
  );
  await executeSql(
`CREATE TABLE IF NOT EXISTS intervals (
  id integer primary key not null,
  start integer not null,
  end integer not null,
  trial_id integer not null,
  FOREIGN KEY(trial_id) REFERENCES trials(id)
)`
  );
}

const Stack = createStackNavigator();
export default function App() {
  React.useEffect(() => {
    (async function iife() { await initDb() })()
  }, []);

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
