import dotenv from 'dotenv';
import firebase from 'firebase/app';
import firedatabase from 'firebase/database';

dotenv.config();
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

class FirebaseSingleton {
  private db: firedatabase.Database;
  isOnline = true;

  constructor() {
    firebase.initializeApp(config);
    this.db = firedatabase.getDatabase();
  }
}

export const FIREBASE = new FirebaseSingleton();
