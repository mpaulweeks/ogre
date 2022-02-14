import React, { useState } from 'react';
import { Game, GameState, GridKey, OgreCard, OgreSquare, Player } from '../../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';
import './gameStyles.css';
import { Lobby } from '../lobby';
import { useEffect } from 'react';

export function ViewGame(props: {
  lobby?: Lobby; // todo
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

  return (
    <div className='ViewColumns'>
      <ViewHand
        player={game.red}
        selected={selectedHand}
        setSelected={setSelectedHand}
        draw={() => onDraw(game.red)}
      />
      <ViewBoard
        game={game}
        toPlay={selectedHand}
        playCard={playCard}
      />
      <ViewHand
        player={game.blue}
        selected={selectedHand}
        setSelected={setSelectedHand}
        draw={() => onDraw(game.blue)}
      />
    </div>
  );
}
