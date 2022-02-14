import React, { useEffect, useState } from 'react';
import { Board, Game, GridKey, OgreCard, OgreSquare, Player, Unit } from '../../lib';
import { ViewSquare } from './ViewSquare';

interface Context {
  readonly toPlay: OgreCard;
  readonly unit: Unit;
  readonly active: Player;
  readonly enemy: Player;
}

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

  const context: Context | undefined = props.toPlay ? {
    toPlay: props.toPlay,
    unit: props.toPlay.unit,
    active: props.game.getPlayer(props.toPlay.team),
    enemy: props.game.getEnemy(props.toPlay.team),
  } : undefined;
  const isLightGev = context?.unit === Unit.LightGev;
  const isMissle = context?.unit === Unit.CruiseMissile;
  const isOgre = context?.unit === Unit.Ogre;

  const board = new Board(props.game);
  const tempSquare: OgreSquare | undefined = (context && deploy) ? {
    ...context.toPlay,
    key: deploy,
  } : undefined;
  const gridSquares = board.getVisibleSquares(tempSquare);

  const enemySquares: Set<GridKey> = new Set(
    context?.enemy.state.board.map(os => os.key) ?? []
  );
  const spotting: Set<GridKey> = new Set(
    isMissle
      ? context?.enemy.state.board.map(os => os.key) ?? []
      : context?.active.getSpotting() ?? []
  );
  const allValidDeploys: Set<GridKey> = new Set([
    ...context?.active.getSupplied(context.toPlay) ?? [],
    ...isLightGev ? board.getNeutralLightGevSquares(gridSquares) : [],
  ].filter(key => !enemySquares.has(key)));
  const possibleAttacks: Set<GridKey> = new Set(
    !context ? [] : (
      isMissle
        ? context.enemy.state.board.map(os => os.key) ?? []
        : (
          (deploy && context.active.getAttacking(context.toPlay, deploy)) ||
          (hover && context.active.getAttacking(context.toPlay, hover)) ||
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
    (!context && 'Click a card in hand') ||
    (isMissle && 'Click square to attack with your missle') ||
    (!deploy && 'Click square to deploy') ||
    'Click square to attack'
  );

  // todo convert to useCallback, break up and simplify somehow
  const onClick = () => {
    // handle bad states
    if (!context) {
      return;
    }
    if (!hover) {
      throw new Error('cannot click when hover is undefined');
    }
    // handle missle
    if (isMissle) {
      const validAttack = allValidAttacks.has(hover) && context.enemy.getSquareFromBoard(hover);
      if (validAttack) {
        props.playCard({ deploy: hover, attacks: [validAttack], });
      }
      return;
    }
    // handle 1st click
    if (!deploy) {
      const validDeploy = allValidDeploys.has(hover);
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
    const validAttack = allValidAttacks.has(hover) && context.enemy.getSquareFromBoard(hover);
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
              isSupplied={allValidDeploys.has(gs.key)}
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
        <code># {props.game.state.tick.toString().padStart(3, '0')}</code>
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
