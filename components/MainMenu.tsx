import React, { useState } from 'react';
import { GameConfig, Theme } from '../types';
import { THEMES } from '../themes';
import Settings from './Settings';

interface MainMenuProps {
  onStartSetup: (config: GameConfig) => void;
  onThemeChange: (themeId: string) => void;
  currentThemeId: string;
  isMusicEnabled: boolean;
  areSoundsEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSounds: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartSetup, onThemeChange, currentThemeId, isMusicEnabled, areSoundsEnabled, onToggleMusic, onToggleSounds }) => {
  const [numPlayers, setNumPlayers] = useState(2);

  const handleStartPvP = () => {
    onStartSetup({ mode: 'PvP', numPlayers });
  };

  const handleStartPvE = () => {
    onStartSetup({ mode: 'PvE', numPlayers: 2 });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-2xl border-2 border-teal-200">
      <h2 className="text-3xl font-brand text-teal-600 text-center mb-6">Select Game Mode</h2>

      {/* Player vs Player */}
      <div className="mb-6 p-4 border border-teal-100 rounded-lg">
        <h3 className="text-xl font-bold text-teal-700 mb-3 text-center">Player vs Player</h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <label htmlFor="numPlayers" className="font-semibold text-gray-600">Players:</label>
          <div className="flex items-center gap-2">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setNumPlayers(num)}
                className={`w-10 h-10 rounded-full font-bold text-base transition-all ${
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
          className="w-full font-brand text-lg bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Start PvP Game
        </button>
      </div>

      {/* Player vs Bot */}
      <div className="p-4 border border-teal-100 rounded-lg">
        <h3 className="text-xl font-bold text-teal-700 mb-3 text-center">Player vs Bot</h3>
        <p className="text-center text-gray-500 mb-4">Challenge our clever bot!</p>
        <button
          onClick={handleStartPvE}
          className="w-full font-brand text-lg bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Start PvE Game
        </button>
      </div>

      {/* Theme Selector */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-teal-700 mb-4">Choose a Theme</h3>
        <div className="flex justify-center gap-4 flex-wrap">
            {THEMES.map(theme => (
                <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`w-12 h-12 rounded-full transition-all transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-teal-400 ${currentThemeId === theme.id ? 'ring-4 ring-offset-2 ring-teal-400 scale-110' : 'hover:scale-110'}`}
                    aria-label={`Select ${theme.name} theme`}
                    title={theme.name}
                >
                    <div className="w-full h-full rounded-full overflow-hidden flex shadow-inner">
                        <div className={`w-1/2 h-full ${theme.colors.squareOddClass}`}></div>
                        <div className={`w-1/2 h-full ${theme.colors.squareEvenClass}`}></div>
                    </div>
                </button>
            ))}
        </div>
      </div>
      
      {/* Settings */}
      <div className="mt-8 pt-6 border-t border-teal-100">
         <Settings 
            isMusicEnabled={isMusicEnabled}
            areSoundsEnabled={areSoundsEnabled}
            onToggleMusic={onToggleMusic}
            onToggleSounds={onToggleSounds}
        />
      </div>
    </div>
  );
};

export default MainMenu;