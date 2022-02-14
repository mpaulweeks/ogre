import React from 'react';
import './lobbyStyles.css';
import { FIREBASE } from '../firebase';

export function ViewLobby(props: {
  onMatch(lobby: any): void;
  onExit(): void;
}) {
  return (
    <div className='ViewLobby'>
      <pre>{JSON.stringify(FIREBASE._config, null, 2)}</pre>
      <button onClick={props.onExit}>CANCEL</button>
    </div>
  )
}
