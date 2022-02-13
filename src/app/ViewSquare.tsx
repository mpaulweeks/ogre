import React from 'react';
import { GridKey, NeutralSpace, OgreSquare } from '../lib';
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
  const backgroundColor = props.gridKey === NeutralSpace ? 'black' : getBackgroundColor(props.square?.team);
  const style: React.CSSProperties = {
    backgroundColor,
    borderColor: (
      (props.isHover && 'black') ||
      (props.isSupplied && 'green') ||
      backgroundColor
    ),
  };
  const label = (
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
