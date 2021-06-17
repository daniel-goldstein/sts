import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Alert, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Text, View, ListRenderItem } from 'react-native';
import { Interval } from './TrialDataList';
import { executeSql } from './Db';
import { LogoutButton } from './Auth';
import { SwipeListView } from 'react-native-swipe-list-view';

export type Trial = { trial_id: number, name: string, intervals: Interval[] };

export const TrialsList = ({ navigation }) => {
  const [trials, setTrials] = React.useState<Trial[]>([]);

  const loadTrials = async () => {
    const intervals = (await executeSql(
      'select trial_id, name, start, end from trials left join intervals on trials.id = intervals.trial_id',
      [])).rows;

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

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
    return navigation.addListener('focus', () => {
      (async function iife() { await loadTrials() })()
    });
  }, [navigation]);

  const RenderTrial: ListRenderItem<Trial> = ({ item }) => {
    return (
      <TouchableHighlight onPress={() => navigation.push('Trial Data', { trial: item })}>
        <Text style={styles.item}>{item.name}</Text>
      </TouchableHighlight>
    );
  }

  // TODO Could perhaps just use SQLite cascade delete but meh
  const deleteTrial = async (trialId: number) => {
    await executeSql('delete from intervals where trial_id = ?', [trialId.toString()]);
    await executeSql('delete from trials where id = ?', [trialId.toString()]);
  }

  const deleteTrialWithConfirmation = async (trial: Trial) => {
    Alert.alert(
      'Delete trial',
      `Are you sure you want to delete trial ${trial.name}?`,
      [
        { text: 'Delete', onPress: async () => {
          await deleteTrial(trial.trial_id);
          await loadTrials();
        }},
        { text: 'Cancel', onPress: () => console.log('canceled'), style: 'cancel' },
      ],
      { cancelable: true },
    );
  }

  const DeleteTrialButton: ListRenderItem<Trial> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.deleteTrialButton}
        onPress={async () => await deleteTrialWithConfirmation(item)}>
        <Text style={styles.textWhite}>Delete</Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <SwipeListView
          data={trials}
          renderItem={RenderTrial}
          renderHiddenItem={DeleteTrialButton}
          disableRightSwipe={true}
          rightOpenValue={-75}
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
  deleteTrialButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: 'red',
    right: 0,
  },
  textWhite: {
    color: '#FFF',
  },
});
