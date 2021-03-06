import React from 'react';
import { Trial } from './Trials';
import { TrialDataList } from './TrialDataList';

export const TrialDataScreen = ({ route, navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: trial.name });
  }, [route]);

  const trial: Trial = route.params.trial;
  return (
    <TrialDataList presses={trial.intervals} />
  );
};

