import React from 'react';
import { OgreCard } from '../lib';

export function ViewCard(props: {
  onClick(): void;
  isSelected: boolean;
  card: OgreCard;
}) {
  const style = props.isSelected ? {
    color: 'red',
  } : {};
  return (
    <div
      style={style}
      onClick={props.onClick}
    >
      {props.card.unit}
    </div>
  );
}
