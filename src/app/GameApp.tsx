import React, { useState } from 'react';
import { Game, GameState, GridKey, OgreCard } from '../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';

export function GameApp() {
  const [state, setState] = useState<GameState>(Game.create().getState());
  const [selectedHand, setSelectedHand] = useState<OgreCard | undefined>();

  const game = Game.loadFromState(state);
  const playCard = (args: {
    dest: GridKey;
    attack?: GridKey;
  }) => {
    if (!selectedHand) {
      throw new Error('board cannot play card when selected is undefined');
    }
    // todo handle attack
    game.playCard(selectedHand, args.dest);
    setState(game.getState());
  };

  return (
    <div>
      <ViewHand
        player={game.red}
        selected={selectedHand}
        setSelected={setSelectedHand}
      />
      <ViewHand
        player={game.blue}
        selected={selectedHand}
        setSelected={setSelectedHand}
      />
      <hr />
      <ViewBoard
        game={game}
        toPlay={selectedHand}
        playCard={playCard}
      />
    </div>
  );
}
