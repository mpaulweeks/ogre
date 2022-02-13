import React from 'react';
import { Player, OgreCard } from '../lib';
import { ViewCard } from './ViewCard';

export function ViewHand(props: {
  player: Player;
  selected?: OgreCard;
  setSelected(card: OgreCard | undefined): void;
}) {
  const cards = props.player.getState().hand;
  return (
    <div className='ViewHand'>
      {cards.map(card => (
        <ViewCard
          key={card.id}
          card={card}
          isSelected={props.selected?.id === card.id}
          onClick={() => props.selected?.id === card.id ? props.setSelected(undefined) : props.setSelected(card)}
        />
      ))}
    </div>
  );
}
