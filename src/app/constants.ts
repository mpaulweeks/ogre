
function checkFlag(flag: string) {
  return (
    window.location.hostname === 'localhost' &&
    window.location.search.includes(flag)
  );
}

export const CONSTANTS = {
  DefaultCode: 'testlobby',
  Debug: {
    JumpToMenu: checkFlag('menu'),
    JumpToGame: checkFlag('game'),
    JumpToLobby: checkFlag('lobby'),
    AutofillCode: checkFlag('code'),
    NoHide: checkFlag('nohide'),
  },
}
