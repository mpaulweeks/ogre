import { Player } from "./player";
import { GameState, GridKey, HasState, OgreCard, OgreSquare, Team, UniqueId } from "./types";

export class Game implements HasState<GameState> {
  readonly red: Player;
  readonly blue: Player;
  private tick: number;

  private constructor(args: {
    tick: number,
    red: Player,
    blue: Player,
  }) {
    this.red = args.red;
    this.blue = args.blue;
    this.tick = args.tick;
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
    attacks: OgreSquare[];
  }): void {
    this.tick++;
    this.getPlayer(args.card.team).playCard(args.card, args.deploy);
    args.attacks.forEach(os => {
      this.getEnemy(args.card.team).receiveAttack(os);
    });
  }
  draw(team: Team) {
    this.tick++;
    this.getPlayer(team).drawForTurn();
  }

  getCard(id: UniqueId): OgreCard | undefined {
    return this.red.getCardFromHand(id) ?? this.blue.getCardFromHand(id) ?? undefined;
  }
  getSquare(key: GridKey): OgreSquare | undefined {
    return this.red.getSquareFromBoard(key) ?? this.blue.getSquareFromBoard(key) ?? undefined;
  }

  get state() {
    return {
      tick: this.tick,
      red: this.red.state,
      blue: this.blue.state,
    };
  }
  loadState(state: GameState) {
    this.tick = state.tick;
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
      tick: 0,
      red: Player.create(Team.Red),
      blue: Player.create(Team.Blue),
    })
  }
}
