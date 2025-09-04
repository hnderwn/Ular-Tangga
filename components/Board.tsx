import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Player, FloatingText as FloatingTextType, Theme } from '../types';
import { BOARD_ROWS, BOARD_COLS } from '../constants';
import PlayerToken from './PlayerToken';
import FloatingText from './FloatingText';

interface BoardProps {
  players: Player[];
  floatingTexts: FloatingTextType[];
  currentPlayerId?: number;
  theme: Theme;
  snakes: Record<number, number>;
  ladders: Record<number, number>;
}

interface Point {
  x: number;
  y: number;
}

const SnakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" fill="currentColor" className="w-full h-full text-red-500 transform -scale-x-100">
        <g>
            <path d="M395.25,443.374c-2.552-2.5-4.370-5.249-5.636-8.24c-1.886-4.469-2.424-9.521-1.552-14.315 c0.886-4.795,3.029-9.21,6.748-13.035l47.694-48.899c8.953-9.164,15.724-19.852,20.148-31.19c6.65-17.011,8.12-35.424,4.484-53.041 c-3.613-17.595-12.482-34.523-26.267-47.944c-9.164-8.953-19.86-15.724-31.19-20.147c-17.011-6.65-35.424-8.12-53.034-4.491 c-17.602,3.62-34.53,12.489-47.959,26.274l-77.816,79.77c-2.499,2.552-5.256,4.378-8.248,5.636c-4.46,1.886-9.52,2.424-14.307,1.56 c-4.802-0.894-9.21-3.037-13.034-6.755c-2.552-2.492-4.37-5.242-5.635-8.241c-1.886-4.469-2.424-9.513-1.553-14.3 c0.886-4.802,3.029-9.218,6.74-13.042l20.087-20.586c8.952-9.165,15.723-19.86,20.146-31.19c6.651-17.012,8.12-35.424,4.484-53.034 c-3.469-16.906-11.831-33.137-24.677-46.293l-10.679-35.462c-6.044-20.117-22.17-35.614-42.506-40.87l-40.34-10.437 c-7.513-1.939-15.496,0.288-20.919,5.832L85.613,56.125c-5.423,5.552-7.446,13.588-5.316,21.048l11.429,40.074 c5.764,20.208,21.654,35.932,41.923,41.491l33.174,9.089c0,0,3.136,6.514,4.393,9.506c1.886,4.477,2.424,9.52,1.56,14.307 c-0.894,4.803-3.037,9.218-6.756,13.043L145.94,225.27c-8.945,9.172-15.716,19.859-20.146,31.19 c-6.643,17.011-8.112,35.424-4.477,53.041c3.606,17.595,12.482,34.531,26.26,47.952c9.164,8.953,19.859,15.724,31.19,20.148 c17.012,6.65,35.424,8.112,53.042,4.484c17.602-3.62,34.523-12.482,47.951-26.267l77.824-79.778c2.5-2.545,5.249-4.37,8.24-5.628 c4.469-1.886,9.521-2.432,14.3-1.56c4.802,0.894,9.225,3.037,13.042,6.748c2.56,2.5,4.378,5.249,5.635,8.24 c1.893,4.469,2.431,9.521,1.56,14.308c-0.886,4.802-3.037,9.21-6.748,13.042l-47.702,48.891 c-8.953,9.164-15.716,19.867-20.147,31.198c-6.643,17.004-8.112,35.416-4.476,53.034c3.606,17.602,12.482,34.522,26.26,47.952 c41.18,40.165,117.088,11.262,123.087-18.05C449.041,475.753,415.238,466.641,395.25,443.374z"></path>
            <path d="M92.786,42.461c0,0-32.19-30.403-31.713-42.461c-7.165,7.166,0.576,20.284,0.576,20.284 s-13.118-7.741-20.284-0.576c12.066-0.478,42.468,31.706,42.468,31.706L92.786,42.461z"></path>
        </g>
    </svg>
);

const LadderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-green-500">
        <path fillRule="evenodd" d="M8.25 3.75H9a.75.75 0 01.75.75v15a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75zm6 0H15a.75.75 0 01.75.75v15a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75zM12 6a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V6.75A.75.75 0 0112 6zm0 3.75a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.01a.75.75 0 01.75-.75zm0 3.75a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.01a.75.75 0 01.75-.75zm0 3.75a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.01a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);


const Board: React.FC<BoardProps> = ({ players, floatingTexts, currentPlayerId, theme, snakes, ladders }) => {
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const [squarePositions, setSquarePositions] = useState<Record<number, Point>>({});
  const [linesVisible, setLinesVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useLayoutEffect(() => {
    const calculatePositions = () => {
        if (!boardRef.current) return;
        const boardRect = boardRef.current.getBoundingClientRect();
        const newPositions: Record<number, Point> = {};
        squareRefs.current.forEach((el, index) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                newPositions[index + 1] = {
                    x: rect.left - boardRect.left + rect.width / 2,
                    y: rect.top - boardRect.top + rect.height / 2,
                };
            }
        });
        setSquarePositions(newPositions);
    };
    calculatePositions();

    const resizeObserver = new ResizeObserver(calculatePositions);
    if (boardRef.current) {
        resizeObserver.observe(boardRef.current);
    }
    return () => {
        if (boardRef.current) {
            resizeObserver.unobserve(boardRef.current);
        }
    };
  }, []);

  useEffect(() => {
    setLinesVisible(false);
    const timer = setTimeout(() => {
        if (Object.keys(squarePositions).length > 0) {
            setLinesVisible(true);
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [snakes, squarePositions]);


  const renderSquares = () => {
    const squares = [];
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const squareNumber = row * BOARD_COLS + (row % 2 === 0 ? col + 1 : BOARD_COLS - col);
        const isEven = (row + col) % 2 === 0;
        const bgColor = isEven ? theme.colors.squareEvenClass : theme.colors.squareOddClass;
        
        squares.push(
          <div
            key={squareNumber}
            ref={el => { squareRefs.current[squareNumber - 1] = el; }}
            className={`relative w-full aspect-square flex items-center justify-center ${bgColor}`}
          >
            <span className={`font-semibold text-xs ${theme.colors.textColorClass}`}>{squareNumber}</span>
             {snakes[squareNumber] && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 opacity-40"><SnakeIcon /></div>}
            {ladders[squareNumber] && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 opacity-40"><LadderIcon /></div>}
          </div>
        );
      }
    }
    return squares;
  };

  const renderConnections = (connections: Record<number, number>, color: string, type: 'snake' | 'ladder') => {
    return Object.entries(connections).map(([start, end]) => {
      const startPos = squarePositions[parseInt(start)];
      const endPos = squarePositions[end];

      if (!startPos || !endPos) return null;

      const controlPointX = startPos.x + (endPos.x - startPos.x) / 2 + (type === 'snake' ? 40 : -40) * (startPos.y > endPos.y ? 1 : -1) ;
      const controlPointY = startPos.y + (endPos.y - startPos.y) / 2;

      const pathData = `M ${startPos.x} ${startPos.y} Q ${controlPointX} ${controlPointY} ${endPos.x} ${endPos.y}`;
      const strokeWidth = type === 'snake' ? (isMobile ? '3' : '5') : '5';

      return (
        <path
          key={`${type}-${start}-${end}`}
          d={pathData}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`transition-opacity duration-1000 ease-in-out ${linesVisible ? 'opacity-70' : 'opacity-0'}`}
          style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}
        />
      );
    });
  };

  return (
    <div ref={boardRef} className="relative aspect-square w-full bg-white rounded-lg shadow-2xl p-2 md:p-3 overflow-hidden border-2 border-teal-300">
      <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
        {renderSquares()}
      </div>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {renderConnections(snakes, theme.colors.snakeColor, 'snake')}
        {renderConnections(ladders, theme.colors.ladderColor, 'ladder')}
      </svg>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {players.map((player, index) => {
          const pos = squarePositions[player.position];
          if (!pos) return null;
          return <PlayerToken 
                    key={player.id} 
                    player={player} 
                    position={pos} 
                    playerIndex={index} 
                    totalPlayers={players.length}
                    isCurrentPlayer={player.id === currentPlayerId}
                 />;
        })}
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {floatingTexts.map(text => {
            const pos = squarePositions[text.square];
            if (!pos) return null;
            return <FloatingText key={text.id} text={text.text} position={pos} type={text.type} />;
        })}
      </div>
    </div>
  );
};

export default Board;