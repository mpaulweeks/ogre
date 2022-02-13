import { Grid } from "./grid";
import { BaseOffset, GridKey, HasState, NeutralSpace, OgreCard, OgreSquare, PlayerState, Team, UniqueId, Unit } from "./types";
import { assertRemove, flatten, nextId, range, shuffle, unique } from "./util";

const DeckContents = [
  { count: 7, unit: Unit.Infantry, },
  { count: 5, unit: Unit.MissleTank, },
  { count: 3, unit: Unit.Gev, },
  { count: 3, unit: Unit.HeavyTank, },
  { count: 3, unit: Unit.Howitzer, },
  { count: 3, unit: Unit.LightGev, },
  { count: 2, unit: Unit.Ogre, },
];
function startingUnits(): Unit[] {
  return flatten(DeckContents.map(data => range(data.count).map(_ => data.unit)));
}

export class Player implements HasState<PlayerState> {
  private constructor(private state: PlayerState) { }
  getState() { return this.state; }
  loadState(state: PlayerState) { this.state = state; }

  getBase(): GridKey {
    return Grid.applyOffset(NeutralSpace, Grid.orientOffset(this.state.team, BaseOffset));
  }
  getSquareFromBoard(key: GridKey): OgreSquare | undefined {
    return this.state.board.filter(os => os.key === key)[0];
  }
  getCardFromHand(id: UniqueId): OgreCard | undefined {
    return this.state.hand.filter(oc => oc.id === id)[0];
  }

  getSpotting(): GridKey[] {
    return unique(flatten(this.state.board.map(os => Grid.getSpotting(os))));
  }

  drawForTurn(): void {
    const { hand, library } = this.state;
    const card = library.pop();
    if (card) {
      hand.push(card);
    }
  }
  playCard(card: OgreCard, dest: GridKey): void {
    const { hand, board } = this.state;
    assertRemove(card, hand);
    board.push({
      ...card,
      key: dest,
    });
  }
  attackCard(square: OgreSquare) {
    const { board } = this.state;
    assertRemove(square, board);
    if (square.unit === Unit.Ogre) {
      board.push({
        key: square.key,
        team: square.team,
        id: nextId(),
        unit: Unit.OgreDamaged,
      });
    }
  }

  static create(team: Team) {
    const cards: OgreCard[] = startingUnits().map(unit => ({
      id: nextId(),
      team,
      unit,
    }));
    const library = shuffle(cards);
    const hand = [
      ...range(2).map(_ => ({
        id: nextId(),
        team,
        unit: Unit.CruiseMissiles,
      })),
      ...range(3).map(_ => library.pop()!),
    ];
    const state: PlayerState = {
      team,
      hand,
      library,
      board: [],
      discard: [],
    }
    return new Player(state);
  }
}
