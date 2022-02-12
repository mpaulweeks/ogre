import { HasState, OgreCard, PlayerState, Team, Unit } from "./types";
import { flatten, range, shuffle } from "./util";

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

  static create(team: Team) {
    const cards: OgreCard[] = startingUnits().map(unit => ({ team, unit }));
    const library = shuffle(cards);
    const hand = [
      ...range(2).map(_ => ({ team, unit: Unit.CruiseMissiles, })),
      ...range(3).map(_ => library.pop()!),
    ];
    const state: PlayerState = {
      hand,
      library,
      board: [],
    }
    return new Player(state);
  }
}
