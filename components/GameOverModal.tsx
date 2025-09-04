import React from 'react';
import { Player } from '../types';

interface GameOverModalProps {
  winner: Player | null;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onPlayAgain, onGoToMenu }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all animate-pop-in max-w-sm w-full border-4 border-amber-400">
        <h2 className="text-4xl font-brand text-amber-500 mb-2">🎉 Winner! 🎉</h2>
        <div className="flex items-center justify-center gap-3 my-4">
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: winner.color }}
            aria-hidden="true"
          ></div>
          <p className="text-2xl font-bold text-gray-800">{winner.name} wins the game!</p>
        </div>
        <p className="text-gray-600 mb-8">What would you like to do next?</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={onPlayAgain}
            className="w-full font-brand text-lg bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
          >
            Play Again
          </button>
          <button
            onClick={onGoToMenu}
            className="w-full font-brand text-lg bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
