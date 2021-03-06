import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, FlatList, ListRenderItem } from 'react-native';
import { Interval } from './TrialDataList';

// TODO Put uuid, or actually, this will go into sqlite probably so... idk?
export type Trial = { name: string, intervals: Interval[] };
const fake_data = [
  { name: "Hello", intervals: [{ start: 0, end: 1}, { start: 2, end: 3}]},
  { name: "Goodbye", intervals: [{ start: 4, end: 7}] },
];

export const TrialsList = ({ navigation }) => {

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
          data={fake_data}
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
