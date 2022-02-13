import React from 'react';
import { OgreCard } from '../../lib';
import { getBackgroundColor, getName } from '../render';

export function ViewHandCard(props: {
  onClick(): void;
  isSelected: boolean;
  card: OgreCard;
}) {
  const backgroundColor = getBackgroundColor(props.card.team);
  const style: React.CSSProperties = {
    backgroundColor,
    borderColor: props.isSelected ? 'black' : backgroundColor,
  };
  return (
    <div
      className='ViewCard'
      style={style}
      onClick={props.onClick}
    >
      <div>
        {getName(props.card.unit)}
      </div>
    </div>
  );
}
