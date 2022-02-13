import React, { useState } from 'react';
import { UniqueId, Player } from '../lib';
import { ViewCard } from './ViewCard';

export function ViewHand(props: {
  player: Player;
  selected?: UniqueId;
  setSelected(id: UniqueId | undefined): void;
}) {
  const cards = props.player.getState().hand;
  return (
    <div style={{ display: 'flex', }}>
      {cards.map(card => (
        <ViewCard
          key={card.id}
          card={card}
          isSelected={props.selected === card.id}
          onClick={() => props.selected === card.id ? props.setSelected(undefined) : props.setSelected(card.id)}
        />
      ))}
    </div>
  );
}
