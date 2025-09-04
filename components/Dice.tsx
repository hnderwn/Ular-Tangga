import React, { useState, useEffect, useRef, useCallback } from 'react';

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
    const base = 'absolute w-3 h-3 md:w-4 md:h-4 bg-teal-800 rounded-full';
    switch (pos) {
      case 'center': return `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
      case 'top-left': return `${base} top-2 left-2 md:top-3 md:left-3 -translate-x-1/2 -translate-y-1/2`;
      case 'top-right': return `${base} top-2 right-2 md:top-3 md:right-3 translate-x-1/2 -translate-y-1/2`;
      case 'bottom-left': return `${base} bottom-2 left-2 md:bottom-3 md:left-3 -translate-x-1/2 translate-y-1/2`;
      case 'bottom-right': return `${base} bottom-2 right-2 md:bottom-3 md:right-3 translate-x-1/2 translate-y-1/2`;
      case 'middle-left': return `${base} top-1/2 left-2 md:left-3 -translate-x-1/2 -translate-y-1/2`;
      case 'middle-right': return `${base} top-1/2 right-2 md:right-3 translate-x-1/2 -translate-y-1/2`;
      default: return '';
    }
  };

  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg shadow-md border-2 border-teal-200">
      {dotPositions[value]?.map(pos => <div key={pos} className={getDotClass(pos)} />)}
    </div>
  );
};

const Dice: React.FC<DiceProps> = ({ value, onRoll, isRolling, disabled }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isHolding, setIsHolding] = useState(false);
  // FIX: The useRef hook requires an initial value. Pass `undefined` to initialize the ref.
  const animationIntervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // When the roll is finished or cancelled, show the final correct value.
    if (!isRolling && !isHolding) {
      setDisplayValue(value);
    }
  }, [value, isRolling, isHolding]);

  // Ensure interval is cleared on unmount
  useEffect(() => {
    return () => clearInterval(animationIntervalRef.current);
  }, []);

  const startFlicker = useCallback(() => {
    clearInterval(animationIntervalRef.current); // Stop any existing flicker
    animationIntervalRef.current = window.setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 75);
  }, []);

  const stopFlicker = useCallback(() => {
    clearInterval(animationIntervalRef.current);
  }, []);

  const handlePress = useCallback(() => {
    if (isRolling || disabled) return;
    setIsHolding(true);
    startFlicker();
  }, [isRolling, disabled, startFlicker]);
  
  const handleRelease = useCallback(() => {
    if (!isHolding) return; // Only fire if we were holding
    setIsHolding(false);
    stopFlicker();
    onRoll();
  }, [isHolding, stopFlicker, onRoll]);

  const handleCancel = () => {
    if (isHolding) {
      // If user drags off, cancel the action.
      setIsHolding(false);
      stopFlicker();
      setDisplayValue(value); // Revert to last actual value
    }
  };

  // Effect for keyboard controls (Space bar)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isHolding || disabled || isRolling) {
        return;
      }
      event.preventDefault(); // Prevent page scroll
      handlePress();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || !isHolding) {
        return;
      }
      event.preventDefault();
      handleRelease();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, isRolling, isHolding, handlePress, handleRelease]);


  const buttonText = isRolling ? 'Rolling...' : isHolding ? 'Release!' : 'Hold to Roll';
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold text-teal-700">Dice</h3>
      <div className={`${isRolling ? 'animate-spin' : ''}`}>
        <DiceFace value={displayValue} />
      </div>
      <button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleCancel}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        disabled={disabled || isRolling}
        className={`w-full font-brand text-lg bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform active:scale-100 shadow-md ${
            isHolding ? 'scale-105 shadow-xl' : 'hover:scale-105'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dice;