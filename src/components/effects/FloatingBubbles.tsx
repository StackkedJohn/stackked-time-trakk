import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
}

export const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const createBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 8; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 60 + 20, // 20-80px
          left: Math.random() * 100, // 0-100%
          animationDelay: Math.random() * 20, // 0-20s
          animationDuration: Math.random() * 10 + 15, // 15-25s
        });
      }
      setBubbles(newBubbles);
    };

    createBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="float-bubble absolute"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDelay: `${bubble.animationDelay}s`,
            animationDuration: `${bubble.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};