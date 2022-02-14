import { range } from "..";
import { Player } from "../player";
import { RedBase, Team, Unit } from "../types";

describe('player.ts', () => {
  test('Draw > Play > Attack lifecycle', () => {
    const sut = Player.create(Team.Red);
    expect(sut.state.hand.length).toBe(5);
    expect(sut.state.library.length).toBe(23);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(0);

    sut.drawForTurn();
    expect(sut.state.hand.length).toBe(6);
    expect(sut.state.library.length).toBe(22);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(0);

    const card = sut.state.hand.filter(oc => oc.unit !== Unit.CruiseMissile && oc.unit !== Unit.Ogre)[0];
    sut.playCard(card, RedBase);
    expect(sut.state.hand.length).toBe(5);
    expect(sut.state.library.length).toBe(22);
    expect(sut.state.board.length).toBe(1);
    expect(sut.state.discard.length).toBe(0);

    const square = sut.state.board[0];
    sut.receiveAttack(square);
    expect(sut.state.hand.length).toBe(5);
    expect(sut.state.library.length).toBe(22);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(1);
  });

  test('Cruise Missle goes straight to discard', () => {
    const sut = Player.create(Team.Red);
    expect(sut.state.hand.length).toBe(5);
    expect(sut.state.library.length).toBe(23);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(0);

    const cruise = sut.state.hand.filter(oc => oc.unit === Unit.CruiseMissile)[0]!;
    sut.playCard(cruise, RedBase);
    expect(sut.state.hand.length).toBe(4);
    expect(sut.state.library.length).toBe(23);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(1);
  });

  test('Ogre takes two hits goes straight to discard', () => {
    const sut = Player.create(Team.Red);
    range(100).forEach(() => sut.drawForTurn());
    expect(sut.state.hand.length).toBe(28);
    expect(sut.state.library.length).toBe(0);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(0);

    const ogreCard = sut.state.hand.filter(oc => oc.unit === Unit.Ogre)[0]!;
    sut.playCard(ogreCard, RedBase);
    expect(sut.state.hand.length).toBe(27);
    expect(sut.state.library.length).toBe(0);
    expect(sut.state.board.length).toBe(1);
    expect(sut.state.discard.length).toBe(0);

    const ogreSquare = sut.state.board[0]!;
    sut.receiveAttack(ogreSquare);
    expect(sut.state.hand.length).toBe(27);
    expect(sut.state.library.length).toBe(0);
    expect(sut.state.board.length).toBe(1);
    expect(sut.state.discard.length).toBe(0);

    const damagedSquare = sut.state.board[0]!;
    expect(damagedSquare.key).toBe(ogreSquare.key);
    expect(damagedSquare.id).toBe(ogreSquare.id);
    expect(damagedSquare.unit).toBe(Unit.OgreDamaged);

    sut.receiveAttack(damagedSquare);
    expect(sut.state.hand.length).toBe(27);
    expect(sut.state.library.length).toBe(0);
    expect(sut.state.board.length).toBe(0);
    expect(sut.state.discard.length).toBe(1);
  });
});
