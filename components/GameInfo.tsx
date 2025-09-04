
import React from 'react';
import { Player, GameStatus } from '../types';

interface GameInfoProps {
  status: GameStatus;
  currentPlayer: Player;
  winner: Player | null;
  onReset: () => void;
  log: string[];
}

const GameInfo: React.FC<GameInfoProps> = ({ status, currentPlayer, winner, onReset, log }) => {
  const renderStatus = () => {
    if (status === GameStatus.Won && winner) {
      return (
        <div className="text-center">
          <h2 className="text-3xl font-brand text-amber-500">🎉 Winner! 🎉</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
             <div className={`w-6 h-6 rounded-full ${winner.color} border-2 border-white`}></div>
             <p className="text-xl font-semibold text-gray-700">{winner.name} wins!</p>
          </div>
        </div>
      );
    }
    if (status === GameStatus.Playing && currentPlayer) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-700">Current Turn</h2>
           <div className="flex items-center justify-center gap-2 mt-2">
             <div className={`w-6 h-6 rounded-full ${currentPlayer.color} border-2 border-white`}></div>
             <p className="text-xl font-semibold text-gray-700">{currentPlayer.name}</p>
          </div>
          {currentPlayer.isBot && <p className="text-sm text-gray-500 mt-1 animate-pulse">Bot is thinking...</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-6 h-full">
      {renderStatus()}
      <div className="flex flex-col gap-2">
        <button 
          onClick={onReset} 
          className="w-full font-brand text-xl bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          {status === GameStatus.Won ? 'Back to Menu' : 'Reset Game'}
        </button>
      </div>
       <div className="flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-teal-700 mb-2 text-center">Game Log</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-48 overflow-y-auto flex flex-col-reverse">
            <ul className="space-y-2 text-sm text-gray-600">
              {log.map((entry, index) => (
                <li key={index} className={`p-2 rounded ${index === 0 ? 'bg-teal-100 font-semibold' : ''}`}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default GameInfo;
