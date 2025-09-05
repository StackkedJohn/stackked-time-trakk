import { useEffect, useState } from 'react';

export const useParallax = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getParallaxStyle = (intensity: number = 1) => ({
    transform: `translate3d(${mousePosition.x * intensity * 20}px, ${scrollY * intensity * 0.1 + mousePosition.y * intensity * 20}px, 0)`,
  });

  return { scrollY, mousePosition, getParallaxStyle };
};