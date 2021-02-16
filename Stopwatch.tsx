import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  ScrollView
} from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';
import UploadButton from './Upload';

type Interval = {
  start: number,
  end: number,
};

type MaybeNumber = number | null;

type ItemProps = { title: string };
const Item = ({ title }: ItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

type ScoreStopwatchProps = { accessToken: string };
const ScoreStopwatch = ({ accessToken }: ScoreStopwatchProps) => {
  const [timerGoing, setStopwatchGoing] = useState(false);
  const [timerReset, setStopwatchReset] = useState(false);
  const [pressStart, setPressStart] = useState<MaybeNumber>(0);
  const [presses, setPresses] = useState<Interval[]>([]);
  let currTime: number = 0;

  const toggleStopwatch = () => {
    setStopwatchGoing(!timerGoing);
    setStopwatchReset(false);
  }

  const resetStopwatch = () => {
    setStopwatchGoing(false);
    setStopwatchReset(true);
    setPresses([]);
  }

  const startInterval = () => {
    setPressStart(currTime);
  }

  const endInterval = () => {
    if (pressStart) {
      setPresses([{ start: pressStart, end: currTime }, ...presses]);
      setPressStart(null);
    }
  }

  const csvData = () => {
    const headers = 'start,end';
    const data = presses.reverse().map(({ start, end }) => `${start},${end}`).join('\n');
    return headers + '\n' + data;
  }

  const fmtMillis = (msec: number) => `${msec / 1000}s`

  const renderInterval: ListRenderItem<Interval> = ({ item }) => {
    const start = fmtMillis(item.start);
    const end = fmtMillis(item.end);
    return <Item title={`Pressed: ${start} - ${end}`} />
  }

  const CurrentPress = ({ start }: { start: MaybeNumber}) => {
    if (start) {
      return <Item title={`Started pressing at: ${fmtMillis(start)}`} />
    }

    return <Item title={``} />
  }

  return (
    <View style={styles.container}>

      <UploadButton accessToken={accessToken} uploadData={csvData} />
      <CurrentPress start={pressStart} />

      <View style={styles.countContainer}>
        <Stopwatch msecs
          options={stopwatchOptions}
          start={timerGoing}
          reset={timerReset}
          getMsecs={(time: number) => {currTime = time;}}/>
        <Button 
          title={!timerGoing ? "Start timer" : "Stop timer"}
          onPress={toggleStopwatch}/>
        <Button
          title={'Reset timer'}
          onPress={resetStopwatch}/>

        <TouchableOpacity
          style={styles.button}
          disabled={!timerGoing}
          onPressIn={startInterval}
          onPressOut={endInterval}>
          <Text style={styles.title}>Press me!!</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.timeList}>
        <FlatList
          data={presses}
          renderItem={renderInterval}
          keyExtractor={press => `${press.start}`}
        />
      </ScrollView>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: '20%',
    width: '80%',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#55dc88",
    padding: 15,
    width: '100%',
  },
  countContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
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
  timeList: {
    height: '50%',
  },
});

const stopwatchOptions = {
  container: {
    backgroundColor: '#000',
    borderRadius: 5,
    width: '100%',
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
    fontFamily: "HelveticaNeue-Thin",
  }
};

export default ScoreStopwatch;
