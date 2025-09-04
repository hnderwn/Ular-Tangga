import React, { useState } from 'react';
import { Player, GameStatus } from '../types';
import Settings from './Settings';

interface GameInfoProps {
  status: GameStatus;
  currentPlayer: Player;
  winner: Player | null;
  onReset: () => void;
  log: string[];
  isMusicEnabled: boolean;
  areSoundsEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSounds: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ status, currentPlayer, winner, onReset, log, isMusicEnabled, areSoundsEnabled, onToggleMusic, onToggleSounds }) => {
  const [isLogOpen, setIsLogOpen] = useState(false);
  
  const renderStatus = () => {
    if (status === GameStatus.Won && winner) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-brand text-amber-500">🎉 Winner! 🎉</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
             <div className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: winner.color }}></div>
             <p className="text-lg font-semibold text-gray-700">{winner.name} wins!</p>
          </div>
        </div>
      );
    }
    if (status === GameStatus.Playing && currentPlayer) {
      return (
        <div className="text-center p-3 rounded-lg bg-teal-100 border-2 border-teal-200 shadow-inner">
          <h2 className="text-xl font-bold text-teal-700">Current Turn</h2>
           <div className="flex items-center justify-center gap-2 mt-2">
             <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: currentPlayer.color }}></div>
             <p className="text-lg font-bold text-gray-800">{currentPlayer.name}</p>
          </div>
          {currentPlayer.isBot && <p className="text-sm text-gray-500 mt-1 animate-pulse">Bot is thinking...</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-4 h-full">
      {renderStatus()}
      <div className="flex flex-col gap-3">
        <button 
          onClick={onReset} 
          className="w-full font-brand text-lg bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          {status === GameStatus.Won ? 'Back to Menu' : 'Reset Game'}
        </button>
        <Settings
            isMusicEnabled={isMusicEnabled}
            areSoundsEnabled={areSoundsEnabled}
            onToggleMusic={onToggleMusic}
            onToggleSounds={onToggleSounds}
        />
      </div>
       <div className="flex-grow flex flex-col">
          {/* Mobile-only accordion button */}
          <button
            onClick={() => setIsLogOpen(!isLogOpen)}
            className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100 lg:hidden"
            aria-expanded={isLogOpen}
            aria-controls="game-log-panel"
          >
            <h3 className="text-lg font-bold text-teal-700">Game Log</h3>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${isLogOpen ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {/* Desktop-only static title */}
          <h3 className="hidden lg:block text-lg font-bold text-teal-700 mb-2 text-center">Game Log</h3>
          <div 
            id="game-log-panel"
            className={`bg-gray-50 border border-gray-200 rounded-lg p-2 h-40 overflow-y-auto flex-col-reverse transition-all duration-300 ${isLogOpen ? 'flex' : 'hidden'} lg:flex`}
          >
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