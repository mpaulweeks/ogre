import React, { useState } from 'react';
import { Game, GameState, GridKey, OgreCard, OgreSquare } from '../../lib';
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
    const newState = game.getState();
    setSelectedHand(undefined);
    setState(newState);
    if (props.lobby) {
      props.lobby.sendState(newState);
    }
  };

  return (
    <div className='ViewColumns'>
      <ViewHand
        player={game.red}
        selected={selectedHand}
        setSelected={setSelectedHand}
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
      />
    </div>
  );
}
