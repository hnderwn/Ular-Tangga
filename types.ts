export interface Player {
  id: number;
  name: string;
  position: number;
  /** Hex color string (e.g., '#ff0000') */
  color: string;
  tokenClass: string;
  isBot?: boolean;
}

export enum GameStatus {
  MainMenu = 'MAIN_MENU',
  Setup = 'SETUP',
  Ready = 'READY',
  Playing = 'PLAYING',
  Won = 'WON',
}

export type GameMode = 'PvP' | 'PvE';

export interface GameConfig {
  mode: GameMode;
  numPlayers: number;
}

export interface FloatingText {
  id: number;
  text: string;
  square: number;
  type: 'dice' | 'snake' | 'ladder';
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    squareEvenClass: string;
    squareOddClass: string;
    snakeColor: string;
    ladderColor: string;
    textColorClass: string;
  };
}