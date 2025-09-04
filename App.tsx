import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import GameInfo from './components/GameInfo';
import MainMenu from './components/MainMenu';
import PlayerSetup from './components/PlayerSetup';
import Confetti from './components/Confetti';
import GameOverModal from './components/GameOverModal';
import { Player, GameStatus, GameMode, FloatingText as FloatingTextType, GameConfig, Theme } from './types';
import { PLAYER_CONFIGS, DEFAULT_SNAKES, DEFAULT_LADDERS, BOARD_SIZE, BOARD_ROWS } from './constants';
import { THEMES } from './themes';
import Settings from './components/Settings';

// --- Sound Effects System ---
type SoundType = 'roll' | 'snake' | 'ladder' | 'win' | 'move';

const audioFiles: Record<SoundType, string> = {
  roll: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2b33c0293d.mp3',
  move: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3b9c072b2.mp3',
  snake: 'https://cdn.pixabay.com/audio/2021/08/04/audio_1416940263.mp3',
  ladder: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88f2067578.mp3',
  win: 'https://cdn.pixabay.com/audio/2022/09/20/audio_32b0973059.mp3',
};

const sounds: Partial<Record<SoundType, HTMLAudioElement>> = {};

// Preload audio files for instant playback
if (typeof window !== 'undefined') {
    Object.keys(audioFiles).forEach(key => {
        const soundType = key as SoundType;
        const audio = new Audio(audioFiles[soundType]);
        audio.volume = 0.4; // Set a subtle volume
        sounds[soundType] = audio;
    });
}
// --- End Sound Effects System ---

const generateSnakesAndLadders = (numItems: number, boardSize: number, rows: number) => {
    const positions = Array.from({ length: boardSize - 2 }, (_, i) => i + 2); // Squares 2 to 99

    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const snakes: Record<number, number> = {};
    const ladders: Record<number, number> = {};
    const occupied = new Set<number>();

    let generatedSnakes = 0;
    let posIndex = 0;
    while (generatedSnakes < numItems && posIndex < positions.length) {
        const start = positions[posIndex];
        const startRow = Math.floor((start - 1) / rows);
        
        const potentialEnds = positions.filter(p => 
            !occupied.has(p) && 
            p < start && 
            Math.floor((p - 1) / rows) < startRow
        );

        if (potentialEnds.length > 0 && !occupied.has(start)) {
            const end = potentialEnds[Math.floor(Math.random() * potentialEnds.length)];
            snakes[start] = end;
            occupied.add(start);
            occupied.add(end);
            generatedSnakes++;
        }
        posIndex++;
    }

    let generatedLadders = 0;
    while (generatedLadders < numItems && posIndex < positions.length) {
        const start = positions[posIndex];
        const startRow = Math.floor((start - 1) / rows);
        
         const potentialEnds = positions.filter(p => 
            !occupied.has(p) && 
            p > start && 
            Math.floor((p - 1) / rows) > startRow
        );

        if (potentialEnds.length > 0 && !occupied.has(start)) {
             const end = potentialEnds[Math.floor(Math.random() * potentialEnds.length)];
            ladders[start] = end;
            occupied.add(start);
            occupied.add(end);
            generatedLadders++;
        }
        posIndex++;
    }
    
    return { snakes, ladders };
};


const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MainMenu);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextType[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [areSoundsEnabled, setAreSoundsEnabled] = useState(true);
  const [snakes, setSnakes] = useState<Record<number, number>>(DEFAULT_SNAKES);
  const [ladders, setLadders] = useState<Record<number, number>>(DEFAULT_LADDERS);

  const playSound = useCallback((type: SoundType) => {
    if (typeof window !== 'undefined' && areSoundsEnabled) {
      const sound = sounds[type];
      if (sound) {
        sound.currentTime = 0; // Rewind to start for rapid playback
        sound.play().catch(error => console.error(`Error playing sound: ${type}`, error));
      }
    }
  }, [areSoundsEnabled]);

  const toggleMusic = () => setIsMusicEnabled(prev => !prev);
  const toggleSounds = () => setAreSoundsEnabled(prev => !prev);

  useEffect(() => {
    const bgMusic = document.getElementById('background-music') as HTMLAudioElement;
    if (!bgMusic) return;

    if (isMusicEnabled) {
      bgMusic.volume = 0.2;
      bgMusic.play().catch(e => console.log("Could not play music automatically.", e));
    } else {
      bgMusic.pause();
    }
  }, [isMusicEnabled]);


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

  const handleSetup = (config: GameConfig) => {
    setGameConfig(config);
    setGameStatus(GameStatus.Setup);
     // Try to start music on first user interaction
    if (isMusicEnabled) {
      const bgMusic = document.getElementById('background-music') as HTMLAudioElement;
      if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(e => console.log("User interaction needed to play music."));
      }
    }
  };
  
  const handleStartGame = (playerData: { name: string; color: string }[]) => {
    if (!gameConfig) return;
    
    // Generate a new board layout for the new game
    const { snakes: newSnakes, ladders: newLadders } = generateSnakesAndLadders(8, BOARD_SIZE, BOARD_ROWS);
    setSnakes(newSnakes);
    setLadders(newLadders);

    let newPlayers: Player[] = [];

    if (gameConfig.mode === 'PvE') {
      newPlayers = [
        { ...PLAYER_CONFIGS[0], position: 1, isBot: false, name: playerData[0].name || 'You', color: playerData[0].color },
        { ...PLAYER_CONFIGS[1], position: 1, isBot: true, name: 'Bot' },
      ];
    } else { // PvP
      newPlayers = playerData.map((data, i) => ({
        ...PLAYER_CONFIGS[i],
        position: 1,
        isBot: false,
        name: data.name || PLAYER_CONFIGS[i].name,
        color: data.color,
      }));
    }

    setPlayers(newPlayers);
    setGameStatus(GameStatus.Ready);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setDiceValue(1);
    setGameLog([]);
  };

  const handleBeginPlay = () => {
    setGameStatus(GameStatus.Playing);
    addLog(`Game Started! ${players[currentPlayerIndex].name}'s turn.`);
  };

  const handlePlayAgain = () => {
    if (!players.length || !gameConfig) return;

    // Generate a new board layout for the new game
    const { snakes: newSnakes, ladders: newLadders } = generateSnakesAndLadders(8, BOARD_SIZE, BOARD_ROWS);
    setSnakes(newSnakes);
    setLadders(newLadders);

    // Reset player positions to 1
    const resetPlayers = players.map(p => ({ ...p, position: 1 }));
    setPlayers(resetPlayers);

    // Reset game state for a new round
    setGameStatus(GameStatus.Ready);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setDiceValue(1);
    setGameLog([]);
    setShowConfetti(false);
    setFloatingTexts([]);
  };

  const resetGame = () => {
    setGameStatus(GameStatus.MainMenu);
    setPlayers([]);
    setWinner(null);
    setGameLog([]);
    setFloatingTexts([]);
    setGameConfig(null);
    setShowConfetti(false);
    // Reset to default board when going to menu
    setSnakes(DEFAULT_SNAKES);
    setLadders(DEFAULT_LADDERS);
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
      playSound('move');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const snake = snakes[newPosition];
    if (snake) {
      playSound('snake');
      addFloatingText(`🐍 to ${snake}`, newPosition, 'snake');
      await new Promise(resolve => setTimeout(resolve, 800)); // Pause to see text
      newPosition = snake;
      addLog(`Oh no! ${currentPlayer.name} landed on a snake and slid down to ${newPosition}.`);
      await animateStep(newPosition);
    }

    const ladder = ladders[newPosition];
    if (ladder) {
      playSound('ladder');
      addFloatingText(`🪜 to ${ladder}`, newPosition, 'ladder');
      await new Promise(resolve => setTimeout(resolve, 800)); // Pause to see text
      newPosition = ladder;
      addLog(`Wow! ${currentPlayer.name} found a ladder and climbed up to ${newPosition}!`);
      await animateStep(newPosition);
    }

    if (newPosition === BOARD_SIZE) {
      playSound('win');
      setGameStatus(GameStatus.Won);
      setWinner(currentPlayer);
      setShowConfetti(true);
      addLog(`🎉 ${currentPlayer.name} has won the game! 🎉`);
    } else {
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextPlayerIndex);
      addLog(`It's ${players[nextPlayerIndex].name}'s turn.`);
    }

    setIsMoving(false);
  }, [currentPlayerIndex, players, playSound, snakes, ladders]);


  const handleRollDice = useCallback(() => {
    if (isRolling || isMoving || gameStatus !== GameStatus.Playing) return;

    playSound('roll');
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    const currentPlayer = players[currentPlayerIndex];
    addFloatingText(`+${roll}`, currentPlayer.position, 'dice');
    setDiceValue(roll);
    
    // Random duration for the roll animation
    const rollAnimationDuration = Math.floor(Math.random() * 800) + 700; // 700ms to 1500ms

    setTimeout(() => {
        setIsRolling(false); // End the visual rolling state
        
        // Trigger landing effects
        if (navigator.vibrate) {
            navigator.vibrate(100); // Haptic feedback
        }

        // After a very short pause for the shake to register, move the player
        setTimeout(() => {
            movePlayer(roll);
        }, 100);

    }, rollAnimationDuration);
  }, [isRolling, isMoving, gameStatus, movePlayer, players, currentPlayerIndex, playSound]);

  const handleThemeChange = (themeId: string) => {
    const newTheme = THEMES.find(t => t.id === themeId);
    if (newTheme) {
        setCurrentTheme(newTheme);
    }
  };

  useEffect(() => {
    if (gameStatus === GameStatus.Playing && players[currentPlayerIndex]?.isBot && !isRolling && !isMoving) {
      const botTurnTimeout = setTimeout(() => {
        handleRollDice();
      }, 1500);

      return () => clearTimeout(botTurnTimeout);
    }
  }, [gameStatus, currentPlayerIndex, players, isRolling, isMoving, handleRollDice]);
  
  const renderContent = () => {
    switch(gameStatus) {
      case GameStatus.MainMenu:
        return (
          <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-4">
             <header className="text-center mb-6">
                <h1 className="text-4xl md:text-6xl font-brand text-teal-600 tracking-wider">Snakes & Ladders</h1>
                <p className="text-teal-500">A classic game of luck and fun</p>
             </header>
             <MainMenu 
                onStartSetup={handleSetup} 
                onThemeChange={handleThemeChange} 
                currentThemeId={currentTheme.id} 
                isMusicEnabled={isMusicEnabled}
                areSoundsEnabled={areSoundsEnabled}
                onToggleMusic={toggleMusic}
                onToggleSounds={toggleSounds}
             />
           </div>
        );
      case GameStatus.Setup:
        if (!gameConfig) return null;
        return (
          <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-4">
             <header className="text-center mb-6">
                <h1 className="text-4xl md:text-6xl font-brand text-teal-600 tracking-wider">Snakes & Ladders</h1>
                <p className="text-teal-500">A classic game of luck and fun</p>
             </header>
            <PlayerSetup config={gameConfig} onStartGame={handleStartGame} onBack={resetGame} />
          </div>
        );
      case GameStatus.Ready:
      case GameStatus.Playing:
      case GameStatus.Won:
        return (
          <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-2 lg:p-6 transition-transform duration-75">
            {showConfetti && <Confetti />}

            {gameStatus === GameStatus.Won && winner && (
                <GameOverModal
                    winner={winner}
                    onPlayAgain={handlePlayAgain}
                    onGoToMenu={resetGame}
                />
            )}
            
            {gameStatus === GameStatus.Ready && (
                <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-20 animate-pop-in">
                  <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border-4 border-teal-300">
                    <h2 className="text-4xl font-brand text-teal-600 mb-4">Ready to Play?</h2>
                    <p className="text-gray-600 mb-6">The board is set. Good luck!</p>
                    <button
                      onClick={handleBeginPlay}
                      className="font-brand text-2xl bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-md"
                    >
                      Start Game
                    </button>
                  </div>
                </div>
            )}

            <header className="text-center mb-3">
              <h1 className="text-4xl md:text-6xl font-brand text-teal-600 tracking-wider">Snakes & Ladders</h1>
            </header>
            <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <Board 
                    players={players} 
                    floatingTexts={floatingTexts} 
                    currentPlayerId={players[currentPlayerIndex]?.id}
                    theme={currentTheme}
                    snakes={snakes}
                    ladders={ladders}
                  />
              </div>
              <div className="flex flex-col-reverse lg:flex-col gap-4">
                <GameInfo 
                  status={gameStatus} 
                  currentPlayer={players[currentPlayerIndex]}
                  winner={winner}
                  onReset={resetGame}
                  log={gameLog}
                  isMusicEnabled={isMusicEnabled}
                  areSoundsEnabled={areSoundsEnabled}
                  onToggleMusic={toggleMusic}
                  onToggleSounds={toggleSounds}
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
    }
  };

  return renderContent();
};

export default App;