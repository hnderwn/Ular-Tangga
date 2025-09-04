import React, { useState } from 'react';
import { GameConfig } from '../types';
import { PLAYER_CONFIGS } from '../constants';

interface PlayerSetupProps {
  config: GameConfig;
  onStartGame: (playerData: { name: string, color: string }[]) => void;
  onBack: () => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ config, onStartGame, onBack }) => {
  const numInputs = config.mode === 'PvE' ? 1 : config.numPlayers;
  
  const initialNames = Array(numInputs).fill('');
  const initialColors = PLAYER_CONFIGS.slice(0, numInputs).map(p => p.color);

  const [playerNames, setPlayerNames] = useState<string[]>(initialNames);
  const [playerColors, setPlayerColors] = useState<string[]>(initialColors);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...playerColors];
    newColors[index] = color;
    setPlayerColors(newColors);
  }

  const handleStart = () => {
    const finalPlayerData = playerNames.map((name, index) => ({
        name: name.trim() || `Player ${index + 1}`,
        color: playerColors[index]
    }));
    onStartGame(finalPlayerData);
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < numInputs; i++) {
        const playerConfig = PLAYER_CONFIGS[i];
        const label = config.mode === 'PvE' ? 'Your Name' : `Player ${i+1}`;
        inputs.push(
            <div key={i} className="flex items-center gap-3">
                 <div className="relative w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0">
                    <div 
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: playerColors[i] }}
                    />
                    <input
                        type="color"
                        value={playerColors[i]}
                        onChange={(e) => handleColorChange(i, e.target.value)}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        title={`Change ${label}'s color`}
                    />
                 </div>
                 <input
                    type="text"
                    value={playerNames[i]}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    placeholder={label}
                    className="w-full px-3 py-2 border bg-slate-100 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none transition text-teal-600 text-sm"
                    maxLength={15}
                 />
            </div>
        )
    }
    return inputs;
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-2xl border-2 border-teal-200">
      <h2 className="text-3xl font-brand text-teal-600 text-center mb-6">Enter Player Details</h2>

      <div className="space-y-4 mb-8">
        {renderInputs()}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleStart}
          className="w-full font-brand text-lg bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Let's Play!
        </button>
        <button
          onClick={onBack}
          className="w-full font-brand text-lg bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;