import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Stopwatch from './Stopwatch';
import TrialsList from './Trials';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Trials">
        <Stack.Screen name="Trials" component={TrialsList}/>
        <Stack.Screen name="Stopwatch" component={Stopwatch}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
