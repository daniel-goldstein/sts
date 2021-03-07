import React from 'react';
import { Button } from 'react-native';
import SubmitButton from './SubmissionButton';
import { Interval } from './TrialDataList';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

type SaveButtonProps = { saveData: () => Interval[] };
const SaveButton = ({ saveData }: SaveButtonProps) => {

  const save = async (trialName: string): Promise<string> => {
    let data = saveData();
    let response = "";
    db.transaction((tx) => {
      let trialId = 0;
      tx.executeSql(`INSERT INTO trials (name) values (?)`,
                    [trialName], (_, { insertId }) => {
        trialId = insertId;
      });
      data.forEach(interval => {
        tx.executeSql(`INSERT INTO intervals (trial_id, start, end) values (?, ?, ?)`,
                     [trialId, interval.start, interval.end]);
      });
    },
    (error) => { response = error.message; },
    () => { response = 'Save succeeded'; });

    return response;
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
