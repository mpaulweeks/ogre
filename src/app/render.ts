import { Unit } from "../lib";

const CardName: Record<Unit, string> = {
  [Unit.Infantry]: 'Infantry',
  [Unit.MissleTank]: 'MissleTank',
  [Unit.Gev]: 'Gev',
  [Unit.HeavyTank]: 'HeavyTank',
  [Unit.Howitzer]: 'Howitzer',
  [Unit.LightGev]: 'LightGev',
  [Unit.CruiseMissiles]: 'CruiseMissiles',
  [Unit.Ogre]: 'Ogre',
  [Unit.OgreDamaged]: 'OgreDamaged',
};
export function getName(unit: Unit) {
  return CardName[unit];
}
