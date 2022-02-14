import { Team, Unit } from "../lib";

const CardName: Record<Unit, string> = {
  [Unit.Infantry]: 'Infantry',
  [Unit.MissleTank]: 'Missle Tank',
  [Unit.Gev]: 'Gev',
  [Unit.HeavyTank]: 'Heavy Tank',
  [Unit.Howitzer]: 'Howitzer',
  [Unit.LightGev]: 'Light Gev',
  [Unit.CruiseMissile]: 'Cruise Missile',
  [Unit.Ogre]: 'Ogre',
  [Unit.OgreDamaged]: 'Ogre (Damaged)',
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
