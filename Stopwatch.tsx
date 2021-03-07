import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';
import { TrialDataList, Interval, Item } from './TrialDataList';
import SaveButton from './Save';
import { fmtMillis } from './Utils';

type MaybeNumber = number | null;

const ScoreStopwatch = ({ navigation }) => {
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

  const CurrentPress = ({ start }: { start: MaybeNumber}) => {
    if (start) {
      return <Item title={`Started pressing at: ${fmtMillis(start)}`} />
    }

    return <Item title={``} />
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveButton saveData={() => presses}/>,
    });
  }, [presses]);

  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>

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

        <View style={{ height: '50%' }}>
          <TrialDataList presses={presses} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  title: {
    fontSize: 16,
    fontFamily: "HelveticaNeue",
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
