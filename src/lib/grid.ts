import { NeutralSpace } from ".";
import { GridKey, GridPoint, OgreSquare, OrientedOffest, RawOffset, Team, Unit } from "./types";

const UpDownLeftRight: RawOffset[] = [
  { rx: 0, ry: -1 },
  { rx: 0, ry: 1 },
  { rx: -1, ry: 0 },
  { rx: 1, ry: 0 },
];
const Diagonals: RawOffset[] = [
  { rx: -1, ry: -1 },
  { rx: -1, ry: 1 },
  { rx: 1, ry: -1 },
  { rx: 1, ry: 1 },
];
const AllAdjacent = [
  ...UpDownLeftRight,
  ...Diagonals,
];
const HowizterAttack: RawOffset[] = [
  { rx: 0, ry: 3 },
  { rx: 0, ry: 2 },
  { rx: -1, ry: 2 },
  { rx: 1, ry: 2 },
];

const SupplyRange: Record<Unit, RawOffset[]> = {
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
const AttackRange: Record<Unit, RawOffset[]> = {
  [Unit.Infantry]: UpDownLeftRight,
  [Unit.MissleTank]: Diagonals,
  [Unit.Gev]: UpDownLeftRight,
  [Unit.HeavyTank]: UpDownLeftRight,
  [Unit.Howitzer]: HowizterAttack,
  [Unit.LightGev]: UpDownLeftRight,
  [Unit.CruiseMissiles]: [], // todo
  [Unit.Ogre]: [
    ...AllAdjacent,
    { rx: 0, ry: -2 },
    { rx: 0, ry: 2 },
    { rx: -2, ry: 0 },
    { rx: 2, ry: 0 },
  ],
  [Unit.OgreDamaged]: [],
};
const SpottingRange: Record<Unit, RawOffset[]> = {
  [Unit.Infantry]: UpDownLeftRight,
  [Unit.MissleTank]: AllAdjacent,
  [Unit.Gev]: UpDownLeftRight,
  [Unit.HeavyTank]: UpDownLeftRight,
  [Unit.Howitzer]: UpDownLeftRight,
  [Unit.LightGev]: UpDownLeftRight,
  [Unit.CruiseMissiles]: [], // todo
  [Unit.Ogre]: [
    ...AllAdjacent,
    { rx: -1, ry: 2 },
    { rx: 0, ry: 2 },
    { rx: 1, ry: 2 },
  ],
  [Unit.OgreDamaged]: AllAdjacent,
};
const CanAttackWithoutSpotting: Set<Unit> = new Set([
  Unit.HeavyTank,
  Unit.Howitzer,
  Unit.Ogre,
]);

export class Grid {

  static getSupply(square: OgreSquare): GridKey[] {
    const raw = SupplyRange[square.unit];
    const oriented = raw.map(ro => this.orientOffset(square.team, ro));
    const applied = oriented.map(oo => this.applyOffset(square.key, oo));
    return applied.filter(key => key !== NeutralSpace);
  }
  private static getAttacks(square: OgreSquare): GridKey[] {
    const raw = AttackRange[square.unit];
    const oriented = raw.map(ro => this.orientOffset(square.team, ro));
    const applied = oriented.map(oo => this.applyOffset(square.key, oo));
    return applied.filter(key => key !== NeutralSpace);
  }
  static getSpotting(square: OgreSquare): GridKey[] {
    const raw = SpottingRange[square.unit];
    const oriented = raw.map(ro => this.orientOffset(square.team, ro));
    const applied = oriented.map(oo => this.applyOffset(square.key, oo));
    return applied.filter(key => key !== NeutralSpace);
  }
  static getSpottedAttacks(square: OgreSquare, spotted: Set<GridKey>): GridKey[] {
    const possibleAttacks = this.getAttacks(square);
    if (CanAttackWithoutSpotting.has(square.unit)) {
      return possibleAttacks;
    }
    return possibleAttacks.filter(key => spotted.has(key));
  }

  static applyOffset(key: GridKey, offset: OrientedOffest): GridKey {
    const point = this.parseKey(key);
    const moved: GridPoint = {
      x: point.x + offset.dx,
      y: point.y + offset.dy,
    };
    return this.makeKey(moved);
  }
  static orientOffset(team: Team, offset: RawOffset): OrientedOffest {
    if (team === Team.Red) {
      return {
        dx: offset.rx,
        dy: offset.ry,
      };
    }
    if (team === Team.Blue) {
      return {
        dx: offset.rx,
        dy: offset.ry * -1,
      };
    }
    throw new Error('unsupported team');
  }

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
