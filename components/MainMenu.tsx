
import React, { useState } from 'react';
import { GameMode } from '../types';

interface MainMenuProps {
  onStartGame: (config: { mode: GameMode; numPlayers: number }) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(2);

  const handleStartPvP = () => {
    onStartGame({ mode: 'PvP', numPlayers });
  };

  const handleStartPvE = () => {
    onStartGame({ mode: 'PvE', numPlayers: 2 });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border-4 border-teal-200">
      <h2 className="text-4xl font-brand text-teal-600 text-center mb-8">Select Game Mode</h2>

      {/* Player vs Player */}
      <div className="mb-8 p-6 border border-teal-100 rounded-lg">
        <h3 className="text-2xl font-bold text-teal-700 mb-4 text-center">Player vs Player</h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <label htmlFor="numPlayers" className="font-semibold text-gray-600">Players:</label>
          <div className="flex items-center gap-2">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setNumPlayers(num)}
                className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                  numPlayers === num 
                    ? 'bg-teal-500 text-white scale-110 shadow-lg' 
                    : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleStartPvP}
          className="w-full font-brand text-xl bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Start PvP Game
        </button>
      </div>

      {/* Player vs Bot */}
      <div className="p-6 border border-teal-100 rounded-lg">
        <h3 className="text-2xl font-bold text-teal-700 mb-4 text-center">Player vs Bot</h3>
        <p className="text-center text-gray-500 mb-4">Challenge our clever bot!</p>
        <button
          onClick={handleStartPvE}
          className="w-full font-brand text-xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Start PvE Game
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
