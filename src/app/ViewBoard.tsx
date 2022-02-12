import React, { useState } from 'react';
import { Game, GridKey, Player } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  update(): void;
  game: Game;
}) {
  const [hover, setHover] = useState<GridKey | undefined>();
  const gridSquares = props.game.getVisibleSquares();
  return (
    <div>
      {gridSquares.map(row => (
        <div className="ViewBoardRow">
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={false}
              gridKey={gs.key}
              square={gs.square}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
