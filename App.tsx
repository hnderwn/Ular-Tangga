import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import GameInfo from './components/GameInfo';
import MainMenu from './components/MainMenu';
import { Player, GameStatus, GameMode, FloatingText as FloatingTextType } from './types';
import { PLAYER_CONFIGS, SNAKES, LADDERS, BOARD_SIZE } from './constants';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MainMenu);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextType[]>([]);

  const addLog = (message: string) => {
    setGameLog(prev => [message, ...prev].slice(0, 10));
  };

  const addFloatingText = (text: string, square: number, type: FloatingTextType['type']) => {
    const newText = { id: Date.now() + Math.random(), text, square, type };
    setFloatingTexts(prev => [...prev, newText]);
    setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 2000); // Remove after 2s animation
  };

  const handleStartGame = (config: { mode: GameMode; numPlayers: number }) => {
    const { mode, numPlayers } = config;
    let newPlayers: Player[] = [];

    if (mode === 'PvE') {
      newPlayers = [
        { ...PLAYER_CONFIGS[0], position: 1, isBot: false, name: 'You' },
        { ...PLAYER_CONFIGS[1], position: 1, isBot: true, name: 'Bot' },
      ];
    } else { // PvP
      newPlayers = PLAYER_CONFIGS.slice(0, numPlayers).map(p => ({
        ...p,
        position: 1,
        isBot: false,
      }));
    }

    setPlayers(newPlayers);
    setGameStatus(GameStatus.Playing);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setDiceValue(1);
    setGameLog([`Game Started! ${newPlayers[0].name}'s turn.`]);
  };

  const resetGame = () => {
    setGameStatus(GameStatus.MainMenu);
    setPlayers([]);
    setWinner(null);
    setGameLog([]);
    setFloatingTexts([]);
  };

  const movePlayer = useCallback(async (steps: number) => {
    setIsMoving(true);

    const currentPlayer = players[currentPlayerIndex];

    const animateStep = (toPosition: number) => {
      return new Promise(resolve => {
        setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? { ...p, position: toPosition } : p));
        setTimeout(resolve, 800);
      });
    };

    const oldPosition = currentPlayer.position;
    let newPosition = oldPosition + steps;

    if (newPosition > BOARD_SIZE) {
      addLog(`${currentPlayer.name} needs ${BOARD_SIZE - oldPosition} to win. Rolled ${steps}. No move.`);
      newPosition = oldPosition;
    } else {
      addLog(`${currentPlayer.name} rolled a ${steps} and moved from ${oldPosition} to ${newPosition}.`);
      await animateStep(newPosition);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const snake = SNAKES[newPosition];
    if (snake) {
      addFloatingText(`🐍 to ${snake}`, newPosition, 'snake');
      await new Promise(resolve => setTimeout(resolve, 800)); // Pause to see text
      newPosition = snake;
      addLog(`Oh no! ${currentPlayer.name} landed on a snake and slid down to ${newPosition}.`);
      await animateStep(newPosition);
    }

    const ladder = LADDERS[newPosition];
    if (ladder) {
      addFloatingText(`🪜 to ${ladder}`, newPosition, 'ladder');
      await new Promise(resolve => setTimeout(resolve, 800)); // Pause to see text
      newPosition = ladder;
      addLog(`Wow! ${currentPlayer.name} found a ladder and climbed up to ${newPosition}!`);
      await animateStep(newPosition);
    }

    if (newPosition === BOARD_SIZE) {
      setGameStatus(GameStatus.Won);
      setWinner(currentPlayer);
      addLog(`🎉 ${currentPlayer.name} has won the game! 🎉`);
    } else {
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextPlayerIndex);
      addLog(`It's ${players[nextPlayerIndex].name}'s turn.`);
    }

    setIsMoving(false);
  }, [currentPlayerIndex, players, gameStatus]);


  const handleRollDice = useCallback(() => {
    if (isRolling || isMoving || gameStatus !== GameStatus.Playing) return;

    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    const currentPlayer = players[currentPlayerIndex];
    addFloatingText(`+${roll}`, currentPlayer.position, 'dice');
    setDiceValue(roll);
    
    setTimeout(() => {
        movePlayer(roll);
    }, 800);

    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  }, [isRolling, isMoving, gameStatus, movePlayer, players, currentPlayerIndex]);

  useEffect(() => {
    if (gameStatus === GameStatus.Playing && players[currentPlayerIndex]?.isBot && !isRolling && !isMoving) {
      const botTurnTimeout = setTimeout(() => {
        handleRollDice();
      }, 1500);

      return () => clearTimeout(botTurnTimeout);
    }
  }, [gameStatus, currentPlayerIndex, players, isRolling, isMoving, handleRollDice]);
  
  if (gameStatus === GameStatus.MainMenu) {
     return (
       <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-4">
         <header className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-brand text-teal-600 tracking-wider">Snakes & Ladders</h1>
            <p className="text-teal-500">A classic game of luck and fun</p>
         </header>
         <MainMenu onStartGame={handleStartGame} />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-4 lg:p-8">
      <header className="text-center mb-4">
        <h1 className="text-5xl md:text-7xl font-brand text-teal-600 tracking-wider">Snakes & Ladders</h1>
        <p className="text-teal-500">A classic game of luck and fun</p>
      </header>
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Board players={players} floatingTexts={floatingTexts} />
        </div>
        <div className="flex flex-col gap-6">
          <GameInfo 
            status={gameStatus} 
            currentPlayer={players[currentPlayerIndex]}
            winner={winner}
            onReset={resetGame}
            log={gameLog}
          />
          <Dice 
            value={diceValue} 
            onRoll={handleRollDice} 
            isRolling={isRolling} 
            disabled={gameStatus !== GameStatus.Playing || !!players[currentPlayerIndex]?.isBot || isMoving}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
