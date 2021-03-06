import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, FlatList, ListRenderItem } from 'react-native';

// TODO Put uuid, or actually, this will go into sqlite probably so... idk?
type Trial = { title: string };
const data = [
  { title: "Hello" },
  { title: "Goodbye" },
];

const RenderTrial: ListRenderItem<Trial> = ({ item }) => {
  return <Text style={styles.item}>{item.title}</Text>;
}

const TrialsList = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={RenderTrial}
          keyExtractor={trial => `${trial.title}`}
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
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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

export default TrialsList;
