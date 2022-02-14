import React, { useEffect, useState } from 'react';
import { Board, Game, GridKey, OgreCard, OgreSquare, Unit } from '../../lib';
import { ViewSquare } from './ViewSquare';

export function ViewBoard(props: {
  game: Game;
  toPlay?: OgreCard;
  playCard(args: { deploy: GridKey, attacks: OgreSquare[] }): void;
  onUndo(): void;
  onExit(): void;
}) {
  const [hover, setHover] = useState<GridKey | undefined>();
  const [deploy, setDeploy] = useState<GridKey | undefined>();
  const [ogreAttack1, setOgreAttack1] = useState<OgreSquare | undefined>();
  useEffect(() => {
    setHover(undefined);
    setDeploy(undefined);
    setOgreAttack1(undefined);
  }, [props.toPlay]);

  const activePlayer = props.toPlay && props.game.getPlayer(props.toPlay.team);
  const enemyPlayer = props.toPlay && props.game.getEnemy(props.toPlay.team);
  const isLightGev = props.toPlay?.unit === Unit.LightGev;
  const isMissle = props.toPlay?.unit === Unit.CruiseMissile;
  const isOgre = props.toPlay?.unit === Unit.Ogre;

  const board = new Board(props.game);
  const tempSquare: OgreSquare | undefined = (props.toPlay && deploy) ? {
    ...props.toPlay,
    key: deploy,
  } : undefined;
  const gridSquares = board.getVisibleSquares(tempSquare);

  const enemySquares = new Set(
    enemyPlayer
      ? enemyPlayer.getState().board.map(os => os.key)
      : []
  );
  const spotting = new Set(
    (enemyPlayer && isMissle)
      ? enemyPlayer.getState().board.map(os => os.key)
      : (activePlayer?.getSpotting() ?? [])
  );
  const lightGevSupply = isLightGev
    ? board.getNeutralLightGevSquares(gridSquares)
    : [];
  const supplied = new Set([
    ...(
      (isMissle && []) ||
      activePlayer?.getSupplied() ||
      []
    ),
    ...lightGevSupply,
  ]);
  const possibleAttacks: Set<GridKey> = new Set(
    isMissle
      ? enemyPlayer?.getState().board.map(os => os.key) ?? []
      : (
        (props.toPlay && activePlayer) && (
          (deploy && activePlayer.getAttacking(props.toPlay, deploy)) ||
          (hover && activePlayer.getAttacking(props.toPlay, hover)) ||
          []
        )
      )
  );
  const allValidAttacks = new Set(
    Array.from(possibleAttacks)
      .filter(key => enemySquares.has(key))
      .filter(key => !ogreAttack1 || ogreAttack1.unit === Unit.Ogre || key !== ogreAttack1?.key)
  );

  const message = (
    (ogreAttack1 && 'Click second target to attack with your Ogre') ||
    (isOgre && 'Click first target to attack with your Ogre') ||
    (!props.toPlay && 'Click a card in hand') ||
    (isMissle && 'Click square to attack with your missle') ||
    (!deploy && 'Click square to deploy') ||
    'Click square to attack'
  );

  const onClick = () => {
    // handle bad states
    if (!props.toPlay || !enemyPlayer) {
      return;
    }
    if (!hover) {
      throw new Error('cannot click when hover is undefined');
    }
    // handle missle
    if (isMissle) {
      const validAttack = allValidAttacks.has(hover) && enemyPlayer.getSquareFromBoard(hover);
      if (validAttack) {
        props.playCard({ deploy: hover, attacks: [validAttack], });
      }
      return;
    }
    // handle 1st click
    if (!deploy) {
      const validDeploy = supplied.has(hover);
      if (validDeploy) {
        if (allValidAttacks.size > 0) {
          setDeploy(hover);
        } else {
          props.playCard({ deploy: hover, attacks: [], });
        }
      }
      return;
    }
    // handle 2nd click
    const validAttack = allValidAttacks.has(hover) && enemyPlayer.getSquareFromBoard(hover);
    if (validAttack) {
      if (isOgre) {
        if (ogreAttack1) {
          props.playCard({ deploy: deploy, attacks: [ogreAttack1, validAttack], });
        } else {
          setHover(undefined);
          setOgreAttack1(validAttack);
        }
      } else {
        props.playCard({ deploy: deploy, attacks: [validAttack], });
      }
      return;
    }
    // else do nothing
  }

  return (
    <div
      className='ViewBoard'
      onMouseLeave={() => setHover(undefined)}
    >
      <div className='ViewBoardTitle'>
        {message}
      </div>
      {gridSquares.map((row, ri) => (
        <div className="ViewBoardRow" key={ri}>
          {row.map(gs => (
            <ViewSquare
              key={gs.key}
              isHover={gs.key === hover || gs.key === ogreAttack1?.key}
              isSpotted={spotting.has(gs.key)}
              isSupplied={supplied.has(gs.key)}
              isAttacking={possibleAttacks.has(gs.key)}
              gridKey={gs.key}
              square={gs.square}
              onHover={() => setHover(gs.key)}
              onClick={onClick}
            />
          ))}
        </div>
      ))}
      <div
        className='ViewCard ViewBoardUndo'
        onClick={props.onUndo}
      >
        UNDO
        <br />
        <code># {props.game.getState().tick.toString().padStart(3, '0')}</code>
      </div>
      <div
        className='ViewCard ViewBoardExit'
        onClick={props.onExit}
      >
        EXIT GAME
      </div>
    </div>
  )
}
