import React from 'react';
import { OgreCard } from '../../lib';
import { getBackgroundColor, getName } from '../render';

export function ViewCard(props: {
  onClick(): void;
  isSelected: boolean;
  card: OgreCard;
}) {
  const style: React.CSSProperties = {
    backgroundColor: getBackgroundColor(props.card.team),
    borderColor: props.isSelected ? 'green' : 'black',
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
