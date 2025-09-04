import React from 'react';

interface FloatingTextProps {
  text: string;
  position: { x: number; y: number };
  type: 'dice' | 'snake' | 'ladder';
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, position, type }) => {
  const typeStyles = {
    dice: 'text-blue-600',
    snake: 'text-red-600',
    ladder: 'text-green-600',
  };

  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div
      className={`absolute text-2xl md:text-3xl font-brand font-bold pointer-events-none -translate-x-1/2 -translate-y-full ${typeStyles[type]} animate-float-up`}
      style={{ ...style, textShadow: '1px 1px 3px rgba(255,255,255,0.7)' }}
    >
      {text}
    </div>
  );
};

export default FloatingText;
