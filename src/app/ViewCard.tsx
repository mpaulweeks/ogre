import React from 'react';
import { OgreCard } from '../lib';
import { getName } from './render';
import './styles.css';

export function ViewCard(props: {
  onSelect(): void;
  isSelected: boolean;
  card: OgreCard;
}) {
  const style = {
    borderColor: props.isSelected ? 'green' : 'black',
  };
  return (
    <div
      className='ViewCard'
      style={style}
      onClick={props.onSelect}
    >
      <div>
        {getName(props.card.unit)}
      </div>
    </div>
  );
}
