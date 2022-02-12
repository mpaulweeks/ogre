import React, { useState } from 'react';
import { UniqueId, Player } from '../lib';
import { ViewCard } from './ViewCard';

export function ViewHand(props: {
  update(): void,
  player: Player,
}) {
  const cards = props.player.getState().hand;
  const [selected, setSelected] = useState<UniqueId | undefined>();
  return (
    <div style={{ display: 'flex', }}>
      {cards.map(card => (
        <ViewCard
          key={card.id}
          card={card}
          isSelected={selected === card.id}
          onClick={() => setSelected(card.id)}
        />
      ))}
    </div>
  );
}
