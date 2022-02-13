import { Team, Unit } from "../lib";

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
const TeamColor: Record<Team, string> = {
  [Team.Red]: 'salmon',
  [Team.Blue]: 'lightblue',
}
export function getBackgroundColor(team?: Team) {
  if (team === undefined) { return '#eee'; }
  return TeamColor[team];
}
