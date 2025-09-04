
import React from 'react';
import { Player } from '../types';

interface PlayerTokenProps {
  player: Player;
  position: { x: number; y: number };
  playerIndex: number;
  totalPlayers: number;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, position, playerIndex, totalPlayers }) => {
  const angle = (playerIndex / totalPlayers) * 2 * Math.PI;
  const radius = totalPlayers > 1 ? 8 : 0; // Center token if only one player
  const offsetX = radius * Math.cos(angle);
  const offsetY = radius * Math.sin(angle);

  const style = {
    transform: `translate(-50%, -50%) translate(${position.x + offsetX}px, ${position.y + offsetY}px)`,
  };

  return (
    <div
      className={`absolute w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-lg transition-all duration-700 ease-in-out ${player.color} ${player.tokenClass}`}
      style={style}
    >
      {totalPlayers <= 4 && (
        <span 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap"
          style={{ textShadow: '0px 0px 5px white, 0px 0px 5px white' }} // Double shadow for boldness
        >
          {player.name}
        </span>
      )}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-20"></div>
    </div>
  );
};

export default PlayerToken;