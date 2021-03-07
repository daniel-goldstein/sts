import * as SQLite from 'expo-sqlite';
import {SQLResultSet} from 'expo-sqlite';

const db = SQLite.openDatabase('sts-db');

export async function executeSql(sql: string, params: string[]=[]): Promise<SQLResultSet> {
  return await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(sql,
                    params,
                    (_, result) => resolve(result),
                    (_, error) => {
        console.log(error);
        reject();
        return false
      });
    });
  });
}
