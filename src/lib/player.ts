import { mapReduce } from ".";
import { Grid } from "./grid";
import { BlueBase, GridKey, HasState, OgreCard, OgreSquare, PlayerState, RedBase, Team, UniqueId, Unit } from "./types";
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
  private team: Team;
  private hand: OgreCard[];
  private library: OgreCard[];
  private board: OgreSquare[];
  private discard: OgreCard[];
  private constructor(state: PlayerState) {
    this.team = state.team;
    this.hand = state.hand;
    this.library = state.library;
    this.board = state.board;
    this.discard = state.discard;
  }
  get state() {
    return {
      team: this.team,
      hand: this.hand,
      library: this.library,
      board: this.board,
      discard: this.discard,
    }
  }
  loadState(state: PlayerState) {
    this.team = state.team;
    this.hand = state.hand;
    this.library = state.library;
    this.board = state.board;
    this.discard = state.discard;
  }

  get base(): GridKey {
    return ({
      [Team.Red]: RedBase,
      [Team.Blue]: BlueBase,
    })[this.team];
  }
  getSquareFromBoard(key: GridKey): OgreSquare | undefined {
    return this.board.filter(os => os.key === key)[0];
  }
  getCardFromHand(id: UniqueId): OgreCard | undefined {
    return this.hand.filter(oc => oc.id === id)[0];
  }

  getAttacking(card: OgreCard, dest: GridKey): GridKey[] {
    const tempSquare = {
      ...card,
      key: dest,
    };
    const spotted = new Set(this.getSpotting());
    const possibleAttacks = Grid.getSpottedAttacks(tempSquare, spotted);
    const friendlySpaces = mapReduce(this.board, os => os.key);
    const noFriendlyFire = possibleAttacks.filter(key => !friendlySpaces[key]);
    return noFriendlyFire;
  }
  getSpotting(): GridKey[] {
    return unique(flatten(this.board.map(os => Grid.getSpotting(os))));
  }
  getSupplied(toPlay?: OgreCard): GridKey[] {
    if (toPlay?.unit === Unit.CruiseMissile) {
      return [];
    }
    const visited: Set<GridKey> = new Set();
    const toExplore: GridKey[] = [this.base];
    const toSupply: GridKey[] = [];
    while (toExplore.length) {
      const next = toExplore.pop()!;
      visited.add(next);
      const square = this.getSquareFromBoard(next);
      if (square) {
        const canSupply = Grid.getSupply(square);
        const newSupply = canSupply.filter(key => !visited.has(key));
        toExplore.push(...newSupply);
      } else {
        toSupply.push(next);
      }
    }
    return toSupply;
  }

  drawForTurn(): void {
    const { hand, library } = this;
    const card = library.pop();
    if (card) {
      hand.push(card);
    }
  }
  playCard(card: OgreCard, deploy: GridKey): void {
    const { hand, board } = this;
    assertRemove(card, hand);
    if (card.unit === Unit.CruiseMissile) {
      this.discard.push(card);
    } else {
      board.push({
        ...card,
        key: deploy,
      });
    }
  }
  receiveAttack(square: OgreSquare) {
    const { board } = this;
    assertRemove(square, board);
    if (square.unit === Unit.Ogre) {
      board.push({
        key: square.key,
        id: square.id,
        team: square.team,
        unit: Unit.OgreDamaged,
      });
    } else {
      this.discard.push({
        id: square.id,
        team: square.team,
        unit: square.unit
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
        unit: Unit.CruiseMissile,
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
