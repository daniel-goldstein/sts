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
    console.log(`Inserted trial with id ${insertId}`);
    const trialId = insertId;

    let numInserted = 0;
    for (const interval of intervals) {
      const { insertId } = await executeSql(
        'insert into intervals (trial_id, start, end) values (?, ?, ?)',
        [trialId.toString(), interval.start.toString(), interval.end.toString()]
      );
      numInserted += 1;
      console.log(`Inserted interval with id ${insertId}`);
    }

    return `Saved trial with id: ${trialId} with ${numInserted} intervals`;
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
