import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, FlatList, ListRenderItem } from 'react-native';
import { Interval } from './TrialDataList';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

export type Trial = { id: number, name: string, intervals: Interval[] };

export const TrialsList = ({ navigation }) => {
  const [trials, setTrials] = React.useState<Trial[]>([]);

  const unmarshalTrials = (data: SQLite.SQLResultSetRowList) => {
    let trials = new Map();
    console.log(data);
    /* for (let i = 0; i < data.length; i++) { */
    /*   const { id, name, start, end } = data.item(i); */
    /*   const interval = { start, end }; */
    /*   if (trials.get(id) === undefined) { */
    /*     trials.set(id, { id, name, intervals: [interval] }); */
    /*   } else { */
    /*     trials.get(id).intervals.push(interval); */
    /*   } */
    /* } */

    /* setTrials(Array.from(trials.values())); */
  };

  const loadTrials = () => {
    db.readTransaction((tx) => {
      tx.executeSql(`SELECT * from trials`, [], (_, { rows }) => { unmarshalTrials(rows); });
    }, (error) => { console.log(error); }, () => {});
    db.readTransaction((tx) => {
      tx.executeSql(`SELECT * from intervals`, [], (_, { rows }) => { unmarshalTrials(rows); });
    }, (error) => { console.log(error); }, () => {});
  }

  React.useEffect(loadTrials, []);

  const RenderTrial: ListRenderItem<Trial> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.push('Trial Data', { trial: item })}>
        <Text style={styles.item}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={trials}
          renderItem={RenderTrial}
          keyExtractor={trial => `${trial.name}`}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.push('Stopwatch')}
        style={styles.newTrialButton}>
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor:'#fff',
    borderColor:'rgba(0,0,0,0.2)',
  },
  newTrialButton: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height:70,
    backgroundColor:'#fff',
    borderRadius:100,
  },
});
