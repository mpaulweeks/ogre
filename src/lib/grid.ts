import { Unit } from ".";
import { GridKey, GridPoint } from "./types";

const UpDownLeftRight: GridPoint[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];
const Diagonals: GridPoint[] = [
  { x: -1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];
const AllAdjacent = [
  ...UpDownLeftRight,
  ...Diagonals,
];
const HowizterAttack = [
  { x: 0, y: 2 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

const SupplyRange: Record<Unit, GridPoint[]> = {
  [Unit.Infantry]: UpDownLeftRight,
  [Unit.MissleTank]: UpDownLeftRight,
  [Unit.Gev]: Diagonals,
  [Unit.HeavyTank]: UpDownLeftRight,
  [Unit.Howitzer]: UpDownLeftRight,
  [Unit.LightGev]: UpDownLeftRight,
  [Unit.CruiseMissiles]: [],
  [Unit.Ogre]: AllAdjacent,
  [Unit.OgreDamaged]: UpDownLeftRight,
};
const AttackRange: Record<Unit, GridPoint[]> = {
  [Unit.Infantry]: UpDownLeftRight,
  [Unit.MissleTank]: Diagonals,
  [Unit.Gev]: UpDownLeftRight,
  [Unit.HeavyTank]: UpDownLeftRight,
  [Unit.Howitzer]: HowizterAttack,
  [Unit.LightGev]: UpDownLeftRight,
  [Unit.CruiseMissiles]: [], // todo
  [Unit.Ogre]: AllAdjacent, // todo
  [Unit.OgreDamaged]: AllAdjacent,
};
const SpottingRange: Record<Unit, GridPoint[]> = {
  [Unit.Infantry]: UpDownLeftRight,
  [Unit.MissleTank]: AllAdjacent,
  [Unit.Gev]: UpDownLeftRight,
  [Unit.HeavyTank]: UpDownLeftRight,
  [Unit.Howitzer]: UpDownLeftRight,
  [Unit.LightGev]: UpDownLeftRight,
  [Unit.CruiseMissiles]: [], // todo
  [Unit.Ogre]: AllAdjacent, // todo
  [Unit.OgreDamaged]: AllAdjacent,
};

export class Grid {

  static parseKey(key: GridKey): GridPoint {
    const [x, y] = key.split(',');
    return {
      x: parseFloat(x),
      y: parseFloat(y),
    }
  }
  static makeKey(point: GridPoint): GridKey {
    return point.x + ',' + point.y;
  }
}
