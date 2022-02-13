import React, { useState } from 'react';
import { Game, GridKey, OgreCard } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  game: Game;
  toPlay?: OgreCard;
  playCard(args: { dest: GridKey, attack?: GridKey }): void;
}) {
  // todo on toPlay change, set local state to undefined
  const [hover, setHover] = useState<GridKey | undefined>();
  const [dest, setDest] = useState<GridKey | undefined>();

  const gridSquares = props.game.getVisibleSquares();
  const activePlayer = props.toPlay ? props.game.getPlayer(props.toPlay.team) : undefined;
  const spotting = new Set(activePlayer?.getSpotting() ?? []);
  const supplied = new Set(activePlayer?.getSupplied() ?? []);
  const attacking = new Set(
    (activePlayer && props.toPlay && hover)
      ? activePlayer.getAttacking(props.toPlay, hover)
      : []
  );

  const onClick = () => {
    if (!hover) {
      throw new Error('cannot click when hover is undefined');
    }
    if (!dest) {
      return setDest(hover);
    }
    // else play
    // todo
  }
  return (
    <div onMouseLeave={() => setHover(undefined)}>
      {gridSquares.map((row, ri) => (
        <div className="ViewBoardRow" key={ri}>
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={gs.key === hover}
              isSpotted={spotting.has(gs.key)}
              isSupplied={supplied.has(gs.key)}
              isAttacking={attacking.has(gs.key)}
              gridKey={gs.key}
              square={gs.square}
              onHover={() => setHover(gs.key)}
              onClick={onClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
