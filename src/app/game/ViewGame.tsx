import React, { useState } from 'react';
import { Game, GameState, GridKey, OgreCard, OgreSquare, Player } from '../../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';
import './gameStyles.css';
import { Lobby } from '../lobby';
import { useEffect } from 'react';

export function ViewGame(props: {
  lobby?: Lobby; // todo
  onExit(): void;
}) {
  const [state, setState] = useState<GameState>(Game.create().getState());
  const [selectedHand, setSelectedHand] = useState<OgreCard | undefined>();

  useEffect(() => {
    if (props.lobby) {
      props.lobby.setCallback(gs => setState(gs));
    }
  }, [props.lobby, setState]);

  const refreshState = (game: Game) => {
    const newState = game.getState();
    setSelectedHand(undefined);
    setState(newState);
    if (props.lobby) {
      props.lobby.sendState(newState);
    }
  }

  const game = Game.loadFromState(state);
  const hideP1 = !!props.lobby && !props.lobby.isHost;
  const hideP2 = !!props.lobby && props.lobby.isHost;

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
    refreshState(game);
  };
  const onDraw = (player: Player) => {
    player.drawForTurn();
    refreshState(game);
  }
  const onUndo = () => {
    // todo
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
