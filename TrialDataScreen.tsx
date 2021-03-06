import React from 'react';
import { Trial } from './Trials';
import { Interval, TrialDataList } from './TrialDataList';
import UploadButton from './Upload';

const csvData = (intervals: Interval[]) => {
  const headers = 'start,end';
  const data = intervals.reverse().map(({ start, end }) => `${start},${end}`).join('\n');
  return headers + '\n' + data;
}

export const TrialDataScreen = ({ route, navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: trial.name,
      headerRight: () => <UploadButton uploadData={() => csvData(trial.intervals)} />,
    });
  }, [route]);

  const trial: Trial = route.params.trial;
  return (
    <TrialDataList presses={trial.intervals} />
  );
};

