import React, { useCallback, useRef, useState } from 'react';
import { Game, GameState, GridKey, HistoryTracker, OgreCard, OgreSquare, Player } from '../../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';
import './gameStyles.css';
import { Lobby } from '../lobby';
import { useEffect } from 'react';

const noHide = window.location.search.includes('nohide');

export function ViewGame(props: {
  lobby?: Lobby;
  onExit(): void;
}) {
  const [state, setState] = useState<GameState>(Game.create().state);
  const [selectedHand, setSelectedHand] = useState<OgreCard | undefined>();
  const history = useRef(new HistoryTracker<GameState>([state]));

  // define once, deps should never change
  const refreshState = useCallback((newState: GameState, localOnly?: boolean) => {
    history.current.set(newState);
    setSelectedHand(undefined);
    setState(newState);
    if (props.lobby && !localOnly) {
      props.lobby.sendState(newState);
    }
  }, [props.lobby, setSelectedHand, setState, history]);

  // define once, deps should never change
  useEffect(() => {
    if (props.lobby) {
      console.log('setting callback');
      // setting callback invokes once, ensuring both players get synced to lobby gameState
      props.lobby.setCallback(gs => refreshState(gs, true));
    }
  }, [props.lobby, setState, refreshState]);

  // convenience vars
  const game = Game.loadFromState(state);
  const hideP1 = !noHide && !!props.lobby && !props.lobby.isHost;
  const hideP2 = !noHide && !!props.lobby && props.lobby.isHost;

  // redefine helper funcs everytime
  const playCard = (args: {
    deploy: GridKey;
    attacks: OgreSquare[];
  }) => {
    if (!selectedHand) {
      throw new Error('board cannot play card when selected is undefined');
    }
    game.playCard({
      card: selectedHand,
      deploy: args.deploy,
      attacks: args.attacks,
    });
    refreshState(game.state);
  };
  const onDraw = (player: Player) => {
    game.draw(player.state.team);
    refreshState(game.state);
  }
  const onUndo = () => {
    const previous = history.current.get(state.tick - 1);
    if (previous) {
      refreshState(previous);
    }
  }

  return (
    <div className='ViewColumns'>
      <ViewHand
        hide={hideP1}
        player={game.red}
        selected={selectedHand}
        setSelected={setSelectedHand}
        draw={() => onDraw(game.red)}
      />
      <ViewBoard
        game={game}
        toPlay={selectedHand}
        playCard={playCard}
        onUndo={onUndo}
        onExit={props.onExit}
      />
      <ViewHand
        hide={hideP2}
        player={game.blue}
        selected={selectedHand}
        setSelected={setSelectedHand}
        draw={() => onDraw(game.blue)}
      />
    </div>
  );
}
