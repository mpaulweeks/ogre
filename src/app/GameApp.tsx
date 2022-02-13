import React, { useState } from 'react';
import { Game, GameState, GridKey, UniqueId } from '../lib';
import { ViewBoard } from './ViewBoard';
import { ViewHand } from './ViewHand';

export function GameApp() {
  const [state, setState] = useState<GameState>(Game.create().getState());
  const [selectedHand, setSelectedHand] = useState<UniqueId | undefined>();
  const [selectedBoard, setSelectedBoard] = useState<GridKey | undefined>();

  const game = Game.loadFromState(state);
  const card = selectedHand ? game.getCard(selectedHand) : undefined;
  const playCard = () => {
    if (!selectedBoard) { return; }
    if (!card) { return; }
    game.playCard(card, selectedBoard);
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
        selected={selectedBoard}
        setSelected={setSelectedBoard}
        toPlay={card}
        playCard={playCard}
      />
    </div>
  );
}
