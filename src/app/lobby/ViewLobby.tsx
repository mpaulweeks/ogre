import React, { useState } from 'react';
import './lobbyStyles.css';
import { FIREBASE } from '../firebase';
import { Lobby } from '../lobby';
import { LobbyDisconnect } from '../appTypes';

enum LobbyStatus {
  Idle,
  WaitingForNetwork,
  WaitingForEnemy,
}

export function ViewLobby(props: {
  onMatch(lobby: any): void;
  onExit(): void;
}) {
  const [status, setStatus] = useState<LobbyStatus>(LobbyStatus.Idle);
  const [lobbyId, setLobbyId] = useState<string>('');
  const [disconnect, setDisconnect] = useState<LobbyDisconnect>(() => () => { });

  const onCreate = async () => {
    setStatus(LobbyStatus.WaitingForNetwork);
    const conn = await Lobby.createLobby();
    setLobbyId(conn.lobby.id);
    setDisconnect(() => conn.disconnect);
    setStatus(LobbyStatus.WaitingForEnemy);
    await conn.matched;
    props.onMatch(conn.lobby);
  };
  const onCreateCancel = () => {
    disconnect();
    setDisconnect(() => { });
    setStatus(LobbyStatus.Idle);
  }

  if (status === LobbyStatus.WaitingForNetwork) {
    return (
      <div className='ViewLobby'>
        waiting for network...
      </div>
    );
  }
  if (status === LobbyStatus.WaitingForEnemy) {
    return (
      <div className='ViewLobby'>
        created lobby {lobbyId}
        <br />
        waiting for enemy to join...
        <br />
        <button onClick={onCreateCancel}>CANCEL</button>
      </div>
    );
  }
  return (
    <div className='ViewLobby'>
      <pre>{JSON.stringify(FIREBASE._config, null, 2)}</pre>
      <button onClick={onCreate}>CREATE</button>
      <button onClick={props.onExit}>CANCEL</button>
    </div>
  )
}
