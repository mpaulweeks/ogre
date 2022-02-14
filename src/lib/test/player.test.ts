import { Player } from "../player";
import { Team } from "../types";

describe('player.ts', () => {
  test('draw', () => {
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
  });
});
