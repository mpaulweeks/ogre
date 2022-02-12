
export type GridKey = string;

export type Team = 'Red' | 'Blue';
export enum Unit {
  Infantry,
  MissleTank,
  Gev,
  HeavyTank,
  Howitzer,
  LightGev,
  CruiseMissiles,
  Ogre,
}

export interface HasKey {
  key: GridKey;
}
export interface OgreCard {
  team: Team;
  unit: Unit;
}
export interface OgreSquare extends HasKey {
  card: OgreCard;
}

export interface HasState<T> {
  getState(): T;
  loadState(state: T): void;
}
export interface PlayerState {
  hand: OgreCard[];
  library: OgreCard[];
  board: OgreSquare[];
}
