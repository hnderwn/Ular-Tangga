import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic Teal',
    colors: {
      squareEvenClass: 'bg-teal-100',
      squareOddClass: 'bg-teal-200',
      snakeColor: '#ef4444', // red-500
      ladderColor: '#22c55e', // green-500
      textColorClass: 'text-teal-800',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      squareEvenClass: 'bg-orange-100',
      squareOddClass: 'bg-orange-200',
      snakeColor: '#7c3aed', // violet-600
      ladderColor: '#db2777', // pink-600
      textColorClass: 'text-orange-900',
    },
  },
  {
    id: 'forest',
    name: 'Forest Vibe',
    colors: {
      squareEvenClass: 'bg-lime-100',
      squareOddClass: 'bg-lime-200',
      snakeColor: '#d97706', // amber-600
      ladderColor: '#059669', // emerald-600
      textColorClass: 'text-green-900',
    },
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    colors: {
      squareEvenClass: 'bg-violet-200',
      squareOddClass: 'bg-violet-300',
      snakeColor: '#e11d48', // rose-600
      ladderColor: '#f59e0b', // amber-500
      textColorClass: 'text-violet-900',
    },
  },
];
