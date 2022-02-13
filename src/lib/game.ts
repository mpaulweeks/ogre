import { Player } from "./player";
import { GameState, GridKey, HasState, OgreCard, OgreSquare, Team, UniqueId } from "./types";

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

  getPlayer(team: Team): Player {
    return ({
      [Team.Red]: this.red,
      [Team.Blue]: this.blue,
    })[team]
  }
  getEnemy(myTeam: Team): Player {
    return ({
      [Team.Red]: this.blue,
      [Team.Blue]: this.red,
    })[myTeam]
  }
  playCard(args: {
    card: OgreCard;
    deploy: GridKey;
    attack?: OgreSquare;
  }): void {
    this.getPlayer(args.card.team).playCard(args.card, args.deploy);
    if (args.attack) {
      this.getEnemy(args.card.team).receiveAttack(args.attack);
    }
  }
  getCard(id: UniqueId): OgreCard | undefined {
    return this.red.getCardFromHand(id) ?? this.blue.getCardFromHand(id) ?? undefined;
  }
  getSquare(key: GridKey): OgreSquare | undefined {
    return this.red.getSquareFromBoard(key) ?? this.blue.getSquareFromBoard(key) ?? undefined;
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
