import { GameState } from "../lib";

export type LobbyId = string;

export type GameStateCallback = (state: GameState) => void;
export type GameStateDisconnect = () => void;
