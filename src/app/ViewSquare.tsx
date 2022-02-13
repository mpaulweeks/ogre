import React from 'react';
import { BlueBase, GridKey, NeutralSpace, OgreSquare, RedBase } from '../lib';
import { getBackgroundColor, getName } from './render';
import './styles.css';

export function ViewSquare(props: {
  isHover: boolean;
  isSpotted: boolean;
  isSupplied: boolean;
  isAttacking: boolean;
  gridKey: GridKey;
  square?: OgreSquare;
  onHover(): void;
  onClick(): void;
}) {
  const isNeutral = !props.square && props.gridKey === NeutralSpace;
  const isRedBase = !props.square && props.gridKey === RedBase;
  const isBlueBase = !props.square && props.gridKey === BlueBase;
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
      (props.isAttacking && 'red') ||
      (props.isSupplied && 'lightgreen') ||
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
      {props.isSpotted && <div className='ViewCardTarget'>X</div>}
    </div>
  );
}
