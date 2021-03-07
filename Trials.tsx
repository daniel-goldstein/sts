import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, FlatList, ListRenderItem } from 'react-native';
import { Interval } from './TrialDataList';
import { executeSql } from './Db';

export type Trial = { trial_id: number, name: string, intervals: Interval[] };

export const TrialsList = ({ navigation }) => {
  const [trials, setTrials] = React.useState<Trial[]>([]);

  const loadTrials = async () => {
    const intervals = (await executeSql(
      'select trial_id, name, start, end from trials left join intervals on trials.id = intervals.trial_id',
      [])).rows;

    console.log(intervals);
    let trials = new Map();
    for (let i = 0; i < intervals.length; i++) {
      const { trial_id, name, start, end } = intervals.item(i);
      const interval = { start, end };
      if (trials.get(trial_id) === undefined) {
        trials.set(trial_id, { trial_id, name, intervals: [interval] });
      } else {
        trials.get(trial_id).intervals.push(interval);
      }
    }

    setTrials(Array.from(trials.values()));
  }

  // TODO Verify how often this needs to be called
  React.useEffect(() => {
    (async function iife() { await loadTrials() })()
  }, []);

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
          keyExtractor={trial => `${trial.trial_id}`}
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
