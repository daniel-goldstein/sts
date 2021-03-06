import React from 'react';
import { Button } from 'react-native';
import SubmitButton from './SubmissionButton';
import { Interval } from './TrialDataList';

type SaveButtonProps = { saveData: () => Interval[] };
const SaveButton = ({ saveData }: SaveButtonProps) => {

  const save = async (trialName: string): Promise<string> => {
    return trialName;
  }

  const ButtonView = ({ onPress }) => {
    return (
      <Button onPress={onPress} title="Save"/>
    );
  };

  return (
    <SubmitButton
      confirmTitle={'Save Trial'}
      confirmYes={'Save'}
      ButtonView={ButtonView}
      submit={save} />
  );
}

export default SaveButton;
