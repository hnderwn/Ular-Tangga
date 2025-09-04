import React, { useRef, useEffect } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: The useRef hook requires an initial value. Pass `undefined` to initialize the ref.
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#ec4899', '#8b5cf6'];
    const numConfetti = 150;
    const confetti: any[] = [];

    for (let i = 0; i < numConfetti; i++) {
      confetti.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height - rect.height,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 2,
        wind: Math.random() * 2 - 1,
        opacity: 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach(c => {
        c.y += c.speed;
        c.x += c.wind;
        c.rotation += c.speed * 0.1;

        ctx.globalAlpha = c.opacity;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation * Math.PI / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();

        if (c.y > rect.height) {
            // Reset confetti to the top
            c.y = -20;
            c.x = Math.random() * rect.width;
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
};

export default Confetti;
