import { Game, GameState } from "../lib";
import { GameStateCallback, GameStateDisconnect, LobbyId } from "./appTypes";
import { FIREBASE } from "./firebase";

export class Lobby {
  private readonly fb = FIREBASE;
  private disconnectCallback: GameStateDisconnect = () => { };
  constructor(
    readonly isHost: boolean,
    readonly id: LobbyId,
  ) { }

  sendState(state: GameState) {
    this.fb.setState(this.id, state);
  }
  setCallback(cb: GameStateCallback) {
    this.disconnectCallback();
    this.disconnectCallback = this.fb.listenForState(this.id, cb);
  }
  disconnect() {
    this.disconnectCallback();
    this.disconnectCallback = () => { };
  }

  static createId(): LobbyId {
    return Math.floor(Math.random() * 100000).toString().padStart(6, '0');
  }
  static async createLobby() {
    const state = Game.create().state;
    // const result = await FIREBASE.createLobby(state);
    // temp to make testing easier
    const result = await FIREBASE.createLobby(state, '123456');
    const lobby = new Lobby(true, result.lobbyId);
    console.log('lobby created!', lobby.id);
    return {
      lobby,
      matched: result.matched,
      disconnect: result.disconnect,
    }
  }
  static async joinLobby(lobbyId: LobbyId): Promise<Lobby | void> {
    const state = await FIREBASE.joinLobby(lobbyId);
    return state ? new Lobby(false, lobbyId) : undefined;
  }
}
