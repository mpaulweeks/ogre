import React from 'react';
import { Player, OgreCard, Team } from '../../lib';
import { ViewHandCard } from './ViewHandCard';

export function ViewHand(props: {
  hide: boolean;
  player: Player;
  selected?: OgreCard;
  setSelected(card: OgreCard | undefined): void;
  draw(): void;
}) {

  const { team, hand, library } = props.player.state;
  const libraryColor = ({
    [Team.Red]: 'red',
    [Team.Blue]: 'blue',
  })[team];
  const libraryStyle: React.CSSProperties = {
    backgroundColor: libraryColor,
    borderColor: libraryColor,
    cursor: props.hide ? 'not-allowed' : 'pointer',
  };

  return (
    <div className='ViewHand'>
      <div
        className='ViewCard ViewCardLibrary'
        style={libraryStyle}
        onClick={props.hide ? () => { } : props.draw}
      >
        deck: {library.length}
        <br />
        hand: {hand.length}
      </div>
      {hand.map(card => (
        <ViewHandCard
          key={card.id}
          hide={props.hide}
          card={card}
          isSelected={props.selected?.id === card.id}
          onClick={() => props.selected?.id === card.id ? props.setSelected(undefined) : props.setSelected(card)}
        />
      ))}
    </div>
  );
}
