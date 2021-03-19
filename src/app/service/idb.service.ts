import * as JsStore from 'jsstore';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';
import { Student } from '../model/student';
import { environment } from 'src/environments/environment';
declare var require: any;

const getWorkerPath = () => {
  if (environment.production) {
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js');
  } else {
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js');
  }
};

export const idbCon = new JsStore.Connection(new Worker(getWorkerPath().default));
export const dbname = 'Angular_Demo';


const getDatabase = () => {
  const tblStudent: ITable = {
    name: 'Students',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true
      },
      firstname: {
        notNull: true,
        dataType: DATA_TYPE.String
      },

      email: {
        notNull: true,
        dataType: DATA_TYPE.String
      },
      lastname: {
        notNull: true,
        dataType: DATA_TYPE.String
      },

    }
  };
  const dataBase: IDataBase = {
    name: dbname,
    tables: [tblStudent]
  };
  return dataBase;
};

function getAvailableStudents() {
  const availableStudents: Student[] = [{
    email: 'amitkumarmahto76@gmail.com',
    firstname: 'Amit',
    lastname:'Kumar'

  }];
  return availableStudents;
}
export const initJsStore = async () => {
  const dataBase = getDatabase();
  const isDbCreated = await idbCon.initDb(dataBase);
  if (isDbCreated) {
    idbCon.insert({
      into: 'Students',
      values: getAvailableStudents()
    })
  }
};


