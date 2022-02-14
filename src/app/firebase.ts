// import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { Database, getDatabase, onValue, ref, set } from 'firebase/database';
import { GameState } from '../lib';
import { GameStateCallback, GameStateDisconnect, LobbyData, LobbyDisconnect, LobbyId } from './appTypes';
import { Lobby } from './lobby';

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

  async createLobby(state: GameState, forceId?: string): Promise<{
    lobbyId: string;
    matched: Promise<void>;
    disconnect: LobbyDisconnect;
  }> {
    let lobbyId = forceId ?? '';
    let exists = true;
    while (exists && !forceId) {
      lobbyId = Lobby.createId();
      const lobbyRef = ref(this.db, `lobby/${lobbyId}`);
      exists = await new Promise(resolve => {
        onValue(lobbyRef, snapshot => {
          resolve(snapshot.exists());
        }, { onlyOnce: true, });
      });
    }
    const lobbyRef = ref(this.db, `lobby/${lobbyId}`);
    const newDto: LobbyData = {
      ready: false,
      state,
    };
    await set(lobbyRef, newDto);
    console.log('lobby created on server!', lobbyId);
    let resolveMatch: LobbyDisconnect;
    const matched = new Promise<void>(resolve => {
      resolveMatch = resolve;
    });
    const callback = onValue(lobbyRef, snapshot => {
      const dto: LobbyData = snapshot.val();
      if (dto.ready) {
        resolveMatch();
      }
    });
    // ensure DC once matched
    matched.then(() => callback());
    return {
      lobbyId,
      matched,
      disconnect: callback,
    }
  }
  async joinLobby(lobbyId: LobbyId): Promise<GameState | undefined> {
    const lobbyRef = ref(this.db, `lobby/${lobbyId}`);
    const state = await new Promise<GameState | void>(resolve => {
      onValue(lobbyRef, snapshot => {
        if (!snapshot.exists()) {
          return resolve();
        }
        const data: LobbyData = snapshot.val();
        if (data.ready !== false) {
          return resolve();
        }
        // else
        resolve(data.state);
      }, { onlyOnce: true, });
    });
    if (!state) { return; }

    const readyRef = ref(this.db, `lobby/${lobbyId}/ready`);
    await set(readyRef, true);
    return state;
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
