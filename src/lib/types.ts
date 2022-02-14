
export type UniqueId = number;
export interface HasId {
  id: UniqueId;
}

export type GridKey = string;
export interface GridPoint {
  x: number;
  y: number;
}
export interface OrientedOffest {
  dx: number;
  dy: number;
}
export interface RawOffset {
  rx: number;
  ry: number;
}
export const NeutralSpace: GridKey = '0,0';
export const RedBase: GridKey = '0,-1';
export const BlueBase: GridKey = '0,1';
export const IllegalLightGevKeys = new Set([
  NeutralSpace,
  RedBase,
  BlueBase,
]);

export enum Team {
  Red = 'Red',
  Blue = 'Blue',
};
export enum Unit {
  Infantry = 'Infantry',
  MissleTank = 'MissleTank',
  Gev = 'Gev',
  HeavyTank = 'HeavyTank',
  Howitzer = 'Howitzer',
  LightGev = 'LightGev',
  CruiseMissile = 'CruiseMissiles',
  Ogre = 'Ogre',
  OgreDamaged = 'OgreDamaged',
}

export interface HasKey {
  key: GridKey;
}
export interface OgreCard extends HasId {
  readonly team: Team;
  readonly unit: Unit;
}
export interface OgreSquare extends HasKey, OgreCard { }
export interface BoardSquare extends HasKey {
  square?: OgreSquare;
}

export interface HasState<T> {
  getState(): T;
  loadState(state: T): void;
}
export interface PlayerState {
  readonly team: Team;
  readonly hand: OgreCard[];
  readonly library: OgreCard[];
  readonly board: OgreSquare[];
  readonly discard: OgreCard[];
}

export interface GameState {
  readonly red: PlayerState;
  readonly blue: PlayerState;
  readonly turn: number;
}

export interface GameAction {
  readonly card: OgreCard;
  readonly dest: GridKey;
  readonly attack?: GridKey;
}
