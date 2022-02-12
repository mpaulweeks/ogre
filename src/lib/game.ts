import { Player } from "./player";
import { GameState, HasState, Team } from "./types";

export class Game implements HasState<GameState> {
  readonly red: Player;
  readonly blue: Player;
  private turn: number;

  private constructor(args: {
    turn: number,
    red: Player,
    blue: Player,
  }) {
    this.red = args.red;
    this.blue = args.blue;
    this.turn = args.turn;
  }

  getState() {
    return {
      turn: this.turn,
      red: this.red.getState(),
      blue: this.blue.getState(),
    };
  }
  loadState(state: GameState) {
    this.turn = state.turn;
    this.red.loadState(state.red);
    this.blue.loadState(state.blue);
  }

  static loadFromState(state: GameState) {
    const game = this.create();
    game.loadState(state);
    return game;
  }
  static create() {
    return new Game({
      turn: 0,
      red: Player.create(Team.Red),
      blue: Player.create(Team.Blue),
    })
  }

}
