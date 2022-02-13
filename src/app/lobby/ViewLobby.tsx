import React from 'react';
import './lobbyStyles.css';

export function ViewLobby(props: {
  onMatch(lobby: any): void;
  onExit(): void;
}) {
  return (
    <div className='ViewLobby'>
      <button onClick={props.onExit}>CANCEL</button>
    </div>
  )
}
