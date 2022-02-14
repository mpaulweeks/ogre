import React, { useRef, useState } from 'react';
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
  const [state, setState] = useState<GameState>(Game.create().getState());
  const [selectedHand, setSelectedHand] = useState<OgreCard | undefined>();
  const history = useRef(new HistoryTracker<GameState>([state]));

  const refreshState = (state: GameState, localOnly?: boolean) => {
    history.current.set(state);
    setSelectedHand(undefined);
    setState(state);
    if (props.lobby && !localOnly) {
      props.lobby.sendState(state);
    }
  }

  useEffect(() => {
    if (props.lobby) {
      // setting callback invokes once, ensuring both players get synced to lobby gameState
      props.lobby.setCallback(gs => refreshState(gs, true));
    }
  }, [props.lobby, setState]);


  const game = Game.loadFromState(state);
  const hideP1 = !noHide && !!props.lobby && !props.lobby.isHost;
  const hideP2 = !noHide && !!props.lobby && props.lobby.isHost;

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
    refreshState(game.getState());
  };
  const onDraw = (player: Player) => {
    game.draw(player.getState().team);
    refreshState(game.getState());
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
