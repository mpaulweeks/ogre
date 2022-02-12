import { BoardSquare, Grid, GridKey, OgreCard, OgreSquare, UniqueId } from ".";
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

  playCard(card: OgreCard, dest: GridKey): void {
    ({
      [Team.Red]: this.red,
      [Team.Blue]: this.blue,
    })[card.team].playCard(card, dest);
  }
  getCard(id: UniqueId): OgreCard | undefined {
    return this.red.getCardFromHand(id) ?? this.blue.getCardFromHand(id) ?? undefined;
  }
  getSquare(key: GridKey): OgreSquare | undefined {
    return this.red.getSquareFromBoard(key) ?? this.blue.getSquareFromBoard(key) ?? undefined;
  }
  getVisibleSquares(): BoardSquare[][] {
    const allPoints = [
      this.red.getBase(),
      this.blue.getBase(),
      ...this.red.getState().board.map(os => os.key),
      ...this.blue.getState().board.map(os => os.key),
    ].map(key => Grid.parseKey(key));
    const xMin = Math.min(...allPoints.map(p => p.x)) - 1;
    const xMax = Math.max(...allPoints.map(p => p.x)) + 1;
    const yMin = Math.min(...allPoints.map(p => p.y)) - 1;
    const yMax = Math.max(...allPoints.map(p => p.y)) + 1;
    const out: BoardSquare[][] = [];
    for (let y = yMin; y <= yMax; y++) {
      const row: BoardSquare[] = [];
      out.push(row);
      for (let x = xMin; x <= xMax; x++) {
        const key = Grid.makeKey({ x, y });
        row.push({
          key,
          square: this.getSquare(key),
        });
      }
    }
    return out;
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
