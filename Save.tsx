import React from 'react';
import { Button } from 'react-native';
import SubmitButton from './SubmissionButton';
import { Interval } from './TrialDataList';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

type SaveButtonProps = { saveData: () => Interval[] };
const SaveButton = ({ saveData }: SaveButtonProps) => {

  const save = async (trialName: string): Promise<string> => {
    const intervals = saveData();
    return await new Promise<string>((resolve, reject) => {
      let trialId = 0;
      let numInserted = 0;
      db.transaction(tx => {
        tx.executeSql(
          `insert into trials (name) values (?)`, [trialName],
          (_, { insertId }) => { trialId = insertId; },
          (_, error) => { console.log(error); reject(error); return false }
        );

        for (const interval of intervals) {
          tx.executeSql(
            `insert into intervals (trial_id, start, end) values (?, ?, ?)`,
            [trialId, interval.start, interval.end],
            () => { numInserted += 1; },
            (_, error) => { console.log(error); reject(error); return false }
          );
        }
      });
      resolve(`Saved trial with id: ${trialId} with ${numInserted} intervals`);
    });
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
