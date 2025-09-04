export interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
  tokenClass: string;
  isBot?: boolean;
}

export enum GameStatus {
  MainMenu = 'MAIN_MENU',
  Playing = 'PLAYING',
  Won = 'WON',
}

export type GameMode = 'PvP' | 'PvE';

export interface FloatingText {
  id: number;
  text: string;
  square: number;
  type: 'dice' | 'snake' | 'ladder';
}
