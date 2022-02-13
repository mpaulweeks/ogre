import React from 'react';
import { BaseOffset, Grid, GridKey, NeutralSpace, OgreSquare, Team } from '../lib';
import { getBackgroundColor, getName } from './render';
import './styles.css';

export function ViewSquare(props: {
  isHover: boolean;
  isSpotted: boolean;
  isSupplied: boolean;
  gridKey: GridKey;
  square?: OgreSquare;
  onHover(): void;
  onClick(): void;
}) {
  const isNeutral = !props.square && props.gridKey === NeutralSpace;
  const isRedBase = !props.square && props.gridKey === Grid.applyOffset(NeutralSpace, Grid.orientOffset(Team.Red, BaseOffset));
  const isBlueBase = !props.square && props.gridKey === Grid.applyOffset(NeutralSpace, Grid.orientOffset(Team.Blue, BaseOffset));
  const backgroundColor = (
    (isNeutral && 'black') ||
    (isRedBase && 'red') ||
    (isBlueBase && 'blue') ||
    getBackgroundColor(props.square?.team)
  );
  const style: React.CSSProperties = {
    backgroundColor,
    color: (
      (isNeutral && 'white') ||
      (isRedBase && 'white') ||
      (isBlueBase && 'white') ||
      'black'
    ),
    borderColor: (
      (props.isHover && 'black') ||
      (props.isSupplied && 'green') ||
      backgroundColor
    ),
  };
  const label = (
    (isNeutral && 'NEUTRAL') ||
    (isRedBase && 'RED BASE') ||
    (isBlueBase && 'BLUE BASE') ||
    (props.square && getName(props.square.unit)) ||
    ''
  );
  return (
    <div
      className='ViewCard'
      style={style}
      onMouseEnter={props.onHover}
      onClick={props.onClick}
    >
      <div>{label}</div>
      {props.isSpotted && !props.square && <div className='ViewCardTarget'>X</div>}
    </div>
  );
}
