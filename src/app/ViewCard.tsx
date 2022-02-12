import React from 'react';
import { OgreCard, Unit } from '../lib';
import './ViewCard.css';

const CardName: Record<Unit, string> = {
  [Unit.Infantry]: 'Infantry',
  [Unit.MissleTank]: 'MissleTank',
  [Unit.Gev]: 'Gev',
  [Unit.HeavyTank]: 'HeavyTank',
  [Unit.Howitzer]: 'Howitzer',
  [Unit.LightGev]: 'LightGev',
  [Unit.CruiseMissiles]: 'CruiseMissiles',
  [Unit.Ogre]: 'Ogre',
  [Unit.OgreDamaged]: 'OgreDamaged',
};

export function ViewCard(props: {
  onClick(): void;
  isSelected: boolean;
  card: OgreCard;
}) {
  const style = props.isSelected ? {
    borderColor: 'green',
  } : {};
  return (
    <div
      className='ViewCard'
      style={style}
      onClick={props.onClick}
    >
      <div>
        {CardName[props.card.unit]}
      </div>
    </div>
  );
}
