import React from 'react';
import { OgreCard } from '../../lib';
import { getBackgroundColor, getName } from '../render';

export function ViewHandCard(props: {
  onClick(): void;
  isSelected: boolean;
  hide: boolean;
  card: OgreCard;
}) {

  const backgroundColor = getBackgroundColor(props.card.team);
  const style: React.CSSProperties = {
    backgroundColor,
    borderColor: props.isSelected ? 'black' : backgroundColor,
    cursor: props.hide ? 'not-allowed' : 'pointer',
  };

  return (
    <div
      className='ViewCard'
      style={style}
      onClick={props.hide ? () => { } : props.onClick}
    >
      <div>
        {props.hide ? '???' : getName(props.card.unit)}
      </div>
    </div>
  );
}
