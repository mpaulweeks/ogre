import React from 'react';
import { Game, GridKey } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  game: Game;
  selected?: GridKey;
  setSelected(key: GridKey | undefined): void;
  playCard(): void;
}) {
  const gridSquares = props.game.getVisibleSquares();
  return (
    <div onMouseLeave={() => props.setSelected(undefined)}>
      {gridSquares.map((row, ri) => (
        <div className="ViewBoardRow" key={ri}>
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={gs.key === props.selected}
              gridKey={gs.key}
              square={gs.square}
              onHover={() => props.setSelected(gs.key)}
              onClick={props.playCard}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
