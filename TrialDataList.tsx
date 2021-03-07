import React from 'react';
import { View, FlatList, ListRenderItem, Text, StyleSheet } from 'react-native';
import { fmtMillis } from './Utils';

export type Interval = {
  start: number,
  end: number,
};

type ItemProps = { title: string };
export const Item = ({ title }: ItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const renderInterval: ListRenderItem<Interval> = ({ item }) => {
  const start = fmtMillis(item.start);
  const end = fmtMillis(item.end);
  return <Item title={`Pressed: ${start} - ${end}`} />
}

type TrialDataListProps = { presses: Interval[] };
export const TrialDataList = ({ presses }: TrialDataListProps) => {
  return (
    <View>
      <FlatList
        data={presses}
        renderItem={renderInterval}
        keyExtractor={press => `${press.start}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#DDDDDD',
    padding: 20,
    marginVertical: 8,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontFamily: "HelveticaNeue",
  },
});
