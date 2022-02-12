import React, { useState } from 'react';
import { Game, GridKey, Player } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  update(): void;
  game: Game;
}) {
  const [hoverKey, setHoverKey] = useState<GridKey | undefined>();
  const gridSquares = props.game.getVisibleSquares();
  return (
    <div onMouseLeave={() => setHoverKey(undefined)}>
      {gridSquares.map((row, ri) => (
        <div className="ViewBoardRow" key={ri}>
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={gs.key === hoverKey}
              gridKey={gs.key}
              square={gs.square}
              onHover={() => setHoverKey(gs.key)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
