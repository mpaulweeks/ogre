import { GameState } from "../lib";
import { GameStateCallback, GameStateDisconnect, LobbyId } from "./appTypes";
import { FIREBASE } from "./firebase";

export class Lobby {
  private readonly fb = FIREBASE;
  private disconnectCallback: GameStateDisconnect = () => { };
  constructor(readonly id: LobbyId) { }

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
    return (Math.random() * 100000).toString().padStart(6, '0');
  }
}
