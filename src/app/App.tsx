import React, { useState } from 'react';
import { ViewGame } from "./game/ViewGame";
import { ViewLobby } from './lobby/ViewLobby';
import './appStyles.css';
import { Lobby } from './lobby';
import { CONSTANTS } from './constants';

enum AppView {
  Menu = 'Menu',
  Game = 'Game',
  Lobby = 'Lobby',
}

const defaultView = (
  (CONSTANTS.Debug.JumpToMenu && AppView.Menu) ||
  (CONSTANTS.Debug.JumpToGame && AppView.Game) ||
  (CONSTANTS.Debug.JumpToLobby && AppView.Lobby) ||
  AppView.Menu
);

export function App() {
  const [view, setView] = useState<AppView>(defaultView);
  const [lobby, setLobby] = useState<Lobby | undefined>();

  if (view === AppView.Game) {
    return (
      <ViewGame
        lobby={lobby}
        onExit={() => setView(AppView.Menu)}
      />
    )
  }

  if (view === AppView.Lobby) {
    const onMatch = (lobby: Lobby) => {
      setLobby(lobby);
      setView(AppView.Game);
    };
    return (
      <ViewLobby
        onMatch={onMatch}
        onExit={() => setView(AppView.Menu)}
      />
    )
  }

  // else
  return (
    <div className='ViewMenu'>
      <div>
        Welcome to Game. This is very WIP
      </div>
      <div>
        <button onClick={() => setView(AppView.Game)}>Play Offline</button>
      </div>
      <div>
        <button onClick={() => setView(AppView.Lobby)}>Play Online</button>
      </div>
    </div>
  )
}
