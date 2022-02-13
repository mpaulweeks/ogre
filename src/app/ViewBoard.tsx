import React from 'react';
import { flatten, Game, Grid, GridKey, OgreCard } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  game: Game;
  selected?: GridKey;
  setSelected(key: GridKey | undefined): void;
  toPlay?: OgreCard;
  playCard(): void;
}) {
  const gridSquares = props.game.getVisibleSquares();
  const activePlayer = props.toPlay ? props.game.getPlayer(props.toPlay.team) : undefined;
  const spotting = activePlayer?.getSpotting() ?? [];
  return (
    <div onMouseLeave={() => props.setSelected(undefined)}>
      {gridSquares.map((row, ri) => (
        <div className="ViewBoardRow" key={ri}>
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={gs.key === props.selected}
              isSpotted={spotting.includes(gs.key)}
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
