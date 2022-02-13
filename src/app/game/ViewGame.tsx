import React, { useState } from 'react';
import { Game, GameState, GridKey, OgreCard, OgreSquare } from '../../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';
import './gameStyles.css';

export function ViewGame() {
  const [state, setState] = useState<GameState>(Game.create().getState());
  const [selectedHand, setSelectedHand] = useState<OgreCard | undefined>();

  const game = Game.loadFromState(state);
  const playCard = (args: {
    deploy: GridKey;
    attack?: OgreSquare;
  }) => {
    if (!selectedHand) {
      throw new Error('board cannot play card when selected is undefined');
    }
    // todo handle attack
    game.playCard({
      card: selectedHand,
      deploy: args.deploy,
      attack: args.attack,
    });
    setSelectedHand(undefined);
    setState(game.getState());
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
