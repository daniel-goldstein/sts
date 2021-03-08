import React from 'react';
import { Button } from 'react-native';
import SubmitButton from './SubmissionButton';
import { Interval } from './TrialDataList';
import { executeSql } from './Db';

type SaveButtonProps = { saveData: () => Interval[] };
const SaveButton = ({ saveData }: SaveButtonProps) => {

  const save = async (trialName: string): Promise<string> => {
    const intervals = saveData();

    const { insertId } = await executeSql(
      'insert into trials (name) values (?)', [trialName]
    );

    let numInserted = 0;
    for (const interval of intervals) {
      await executeSql(
        'insert into intervals (trial_id, start, end) values (?, ?, ?)',
        [insertId.toString(), interval.start.toString(), interval.end.toString()]
      );
      numInserted += 1;
    }

    return `Saved trial with id: ${insertId} with ${numInserted} intervals`;
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
      placeholder={'trial name'}
      ButtonView={ButtonView}
      submit={save} />
  );
}

export default SaveButton;
