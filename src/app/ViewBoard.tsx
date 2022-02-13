import React, { useState } from 'react';
import { Board, filterEmpty, flatten, Game, GridKey, OgreCard, OgreSquare, Unit } from '../lib';
import { ViewSquare } from './ViewSquare';
import './styles.css';

export function ViewBoard(props: {
  game: Game;
  toPlay?: OgreCard;
  playCard(args: { deploy: GridKey, attack?: OgreSquare }): void;
}) {
  // todo on toPlay change, set local state to undefined
  const [hover, setHover] = useState<GridKey | undefined>();
  const [deploy, setDeploy] = useState<GridKey | undefined>();

  const team = props.toPlay?.team;
  const activePlayer = team && props.game.getPlayer(team);
  const isMissle = props.toPlay?.unit === Unit.CruiseMissiles;

  const board = new Board(props.game);
  const tempSquare: OgreSquare | undefined = (props.toPlay && deploy) ? {
    ...props.toPlay,
    key: deploy,
  } : undefined;
  const gridSquares = board.getVisibleSquares(tempSquare);

  const spotting = new Set(
    (team && isMissle)
      ? props.game.getEnemy(team).getState().board.map(os => os.key)
      : (activePlayer?.getSpotting() ?? [])
  );
  const supplied = new Set(
    isMissle
      ? []
      : (activePlayer?.getSupplied() ?? [])
  );
  const attacking: Set<GridKey> = new Set(
    isMissle
      ? filterEmpty(flatten(gridSquares).map(bs => bs.square?.key))
      : (
        (props.toPlay && activePlayer) && (
          (deploy && activePlayer.getAttacking(props.toPlay, deploy)) ||
          (hover && activePlayer.getAttacking(props.toPlay, hover)) ||
          []
        )
      )
  );

  const message = (
    (!props.toPlay && 'Click a card in hand') ||
    (isMissle && 'Click square to attack with your missle') ||
    (!deploy && 'Click square to deploy') ||
    'Click square to attack'
  );

  const onClick = () => {
    // handle bad states
    if (!props.toPlay || !team) {
      return;
    }
    if (!hover) {
      throw new Error('cannot click when hover is undefined');
    }
    // handle missle
    if (isMissle) {
      const validAttack = attacking.has(hover) && props.game.getEnemy(team).getSquareFromBoard(hover);
      if (validAttack) {
        props.playCard({ deploy: hover, attack: validAttack, });
      }
      return;
    }
    // handle 1st click
    if (!deploy) {
      const validDeploy = supplied.has(hover);
      if (validDeploy) {
        if (attacking.size > 0) {
          setDeploy(hover);
        } else {
          props.playCard({ deploy: hover, attack: undefined, });
        }
      }
      return;
    }
    // handle 2nd click
    const validAttack = attacking.has(hover) && props.game.getEnemy(team).getSquareFromBoard(hover);
    if (validAttack) {
      return props.playCard({ deploy: deploy, attack: validAttack, });
    }
    // do nothing
    return;
  }

  return (
    <div onMouseLeave={() => setHover(undefined)}>
      <h1>{message}</h1>
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
