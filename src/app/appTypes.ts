import { GameState } from "../lib";

export interface LobbyData {
  ready: boolean;
  stateJson: string; // GameState
}
export type LobbyId = string;
export type LobbyDisconnect = () => void;

export type GameStateCallback = (state: GameState) => void;
export type GameStateDisconnect = () => void;
