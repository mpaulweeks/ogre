import React, { useState } from 'react';
import { ViewGame } from "./game/ViewGame";
import { ViewLobby } from './lobby/ViewLobby';
import './appStyles.css';

enum AppView {
  Menu = 'Menu',
  Game = 'Game',
  Lobby = 'Lobby',
}

const defaultView = (
  (window.location.search.includes('menu') && AppView.Menu) ||
  (window.location.search.includes('game') && AppView.Game) ||
  (window.location.search.includes('lobby') && AppView.Lobby) ||
  AppView.Game
);

export function App() {
  const [view, setView] = useState<AppView>(defaultView);
  const [lobby, setLobby] = useState<any | undefined>();

  if (view === AppView.Game) {
    return (
      <ViewGame lobby={lobby} />
    )
  }

  if (view === AppView.Lobby) {
    const onMatch = (lobby: any) => {
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
    <div>Welcome to Game</div>
  )
}
