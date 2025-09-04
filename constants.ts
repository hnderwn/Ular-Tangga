
export const BOARD_SIZE = 100;
export const BOARD_ROWS = 10;
export const BOARD_COLS = 10;

export const PLAYER_CONFIGS = [
  { id: 1, name: 'Player 1', color: 'bg-red-500', tokenClass: 'shadow-red-700/50'},
  { id: 2, name: 'Player 2', color: 'bg-blue-500', tokenClass: 'shadow-blue-700/50'},
  { id: 3, name: 'Player 3', color: 'bg-yellow-400', tokenClass: 'shadow-yellow-600/50'},
  { id: 4, name: 'Player 4', color: 'bg-green-500', tokenClass: 'shadow-green-700/50'},
];

export const SNAKES: Record<number, number> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

export const LADDERS: Record<number, number> = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};
