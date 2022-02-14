import React from 'react';
import { Player, OgreCard, Team } from '../../lib';
import { ViewHandCard } from './ViewHandCard';

export function ViewHand(props: {
  player: Player;
  selected?: OgreCard;
  setSelected(card: OgreCard | undefined): void;
  draw(): void;
}) {
  const { team, hand, library } = props.player.getState();
  const libraryColor = ({
    [Team.Red]: 'red',
    [Team.Blue]: 'blue',
  })[team];
  return (
    <div className='ViewHand'>
      <div
        className='ViewCard ViewCardLibrary'
        style={{ backgroundColor: libraryColor, borderColor: libraryColor, }}
        onClick={props.draw}
      >
        {library.length} cards remaining
      </div>
      {hand.map(card => (
        <ViewHandCard
          key={card.id}
          card={card}
          isSelected={props.selected?.id === card.id}
          onClick={() => props.selected?.id === card.id ? props.setSelected(undefined) : props.setSelected(card)}
        />
      ))}
    </div>
  );
}
