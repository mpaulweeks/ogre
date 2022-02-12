import React, { useState } from 'react';
import { Game, GameState } from '../lib';
import { ViewHand } from './ViewHand';

export function GameApp() {
  const [state, setState] = useState<GameState>(Game.create().getState());

  const game = Game.loadFromState(state);
  const player = game.red;
  const update = () => setState(game.getState());

  return (
    <div>
      <ViewHand update={update} player={player} />
    </div>
  );
}
