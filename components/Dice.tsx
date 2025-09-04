
import React, { useState, useEffect } from 'react';

interface DiceProps {
  value: number;
  onRoll: () => void;
  isRolling: boolean;
  disabled: boolean;
}

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const dotPositions: { [key: number]: string[] } = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };

  const getDotClass = (pos: string) => {
    const base = 'absolute w-4 h-4 md:w-5 md:h-5 bg-teal-800 rounded-full';
    switch (pos) {
      case 'center': return `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
      case 'top-left': return `${base} top-3 left-3 md:top-4 md:left-4 -translate-x-1/2 -translate-y-1/2`;
      case 'top-right': return `${base} top-3 right-3 md:top-4 md:right-4 translate-x-1/2 -translate-y-1/2`;
      case 'bottom-left': return `${base} bottom-3 left-3 md:bottom-4 md:left-4 -translate-x-1/2 translate-y-1/2`;
      case 'bottom-right': return `${base} bottom-3 right-3 md:bottom-4 md:right-4 translate-x-1/2 translate-y-1/2`;
      case 'middle-left': return `${base} top-1/2 left-3 md:left-4 -translate-x-1/2 -translate-y-1/2`;
      case 'middle-right': return `${base} top-1/2 right-3 md:right-4 translate-x-1/2 -translate-y-1/2`;
      default: return '';
    }
  };

  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg shadow-md border-2 border-teal-200">
      {dotPositions[value]?.map(pos => <div key={pos} className={getDotClass(pos)} />)}
    </div>
  );
};

const Dice: React.FC<DiceProps> = ({ value, onRoll, isRolling, disabled }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let animationInterval: number | undefined;
    if (isRolling) {
      // Start the animation: rapidly cycle through numbers to simulate rolling
      animationInterval = window.setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 75); // Change face every 75ms for a snappy flicker effect

      // After animation duration, stop flickering and show the final value
      const animationTimeout = setTimeout(() => {
        clearInterval(animationInterval);
        setDisplayValue(value);
      }, 800); // Total animation time before settling on the final value

      return () => {
        clearInterval(animationInterval);
        clearTimeout(animationTimeout);
      };
    } else {
      // If not rolling, ensure the display value matches the prop value
      setDisplayValue(value);
    }
  }, [isRolling, value]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center gap-4">
      <h3 className="text-xl font-bold text-teal-700">Dice</h3>
      <div className={`${isRolling ? 'animate-spin' : ''}`}>
        <DiceFace value={displayValue} />
      </div>
      <button
        onClick={onRoll}
        disabled={isRolling || disabled}
        className="w-full font-brand text-xl bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 shadow-md"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;
