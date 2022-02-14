// import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { Database, getDatabase, onValue, ref, set } from 'firebase/database';
import { GameState } from '../lib';
import { GameStateCallback, GameStateDisconnect, LobbyId } from './appTypes';

// dotenv.config();
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
  private db: Database;
  isOnline = true;
  readonly _config = config;

  constructor() {
    console.log(config);
    initializeApp(config);
    this.db = getDatabase();
  }

  private stateRef(lobbyId: LobbyId) {
    return ref(this.db, `lobby/${lobbyId}/state`);
  }

  async setState(lobbyId: LobbyId, state: GameState) {
    await set(this.stateRef(lobbyId), state);
  }
  listenForState(lobbyId: LobbyId, cb: GameStateCallback): GameStateDisconnect {
    return onValue(this.stateRef(lobbyId), snapshot => {
      cb(snapshot.val());
    });
  }
}

export const FIREBASE = new FirebaseSingleton();
