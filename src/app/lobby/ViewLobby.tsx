import React, { useState } from 'react';
import './lobbyStyles.css';
import { Lobby } from '../lobby';
import { LobbyDisconnect } from '../appTypes';

enum LobbyStatus {
  Idle,
  WaitingForNetwork,
  WaitingForEnemy,
  LobbyNotFound,
}

export function ViewLobby(props: {
  onMatch(lobby: any): void;
  onExit(): void;
}) {
  const [status, setStatus] = useState<LobbyStatus>(LobbyStatus.Idle);
  const [joinLobbyId, setJoinLobbyId] = useState('');
  const [createdLobbyId, setCreatedLobbyId] = useState('');
  const [disconnect, setDisconnect] = useState<LobbyDisconnect>(() => () => { });

  const onCreate = async () => {
    setStatus(LobbyStatus.WaitingForNetwork);
    const conn = await Lobby.createLobby();
    setCreatedLobbyId(conn.lobby.id);
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
  const onJoin = async () => {
    setStatus(LobbyStatus.WaitingForNetwork);
    const lobby = await Lobby.joinLobby(joinLobbyId);
    if (lobby) {
      props.onMatch(lobby);
    } else {
      setStatus(LobbyStatus.LobbyNotFound);
    }
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
        <div>
          created lobby {createdLobbyId}
        </div>
        <div>
          waiting for enemy to join...
        </div>
        <div>
          <button onClick={onCreateCancel}>CANCEL</button>
        </div>
      </div>
    );
  }
  if (status === LobbyStatus.LobbyNotFound) {
    return (
      <div className='ViewLobby'>
        <div>
          not found
        </div>
        <div>
          <button onClick={() => setStatus(LobbyStatus.Idle)}>OK</button>
        </div>
      </div>
    );
  }
  return (
    <div className='ViewLobby'>
      {/* <pre>{JSON.stringify(FIREBASE._config, null, 2)}</pre> */}
      <div>
        <button onClick={onCreate}>Create</button>
      </div>
      <div>
        <form>
          <input value={joinLobbyId} onChange={e => setJoinLobbyId(e.target.value)} />
          <button type="submit" onClick={onJoin}>Join</button>
        </form>
      </div>
      <div>
        <button onClick={props.onExit}>Cancel</button>
      </div>
    </div>
  )
}
