import { useEffect, useRef, ReactElement, cloneElement } from 'react';

interface ParticleBurstProps {
  children: ReactElement;
  particleCount?: number;
}

export const ParticleBurst = ({ children, particleCount = 8 }: ParticleBurstProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const createParticles = (x: number, y: number) => {
    const container = ref.current;
    if (!container) return;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = Math.random() * 80 + 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 800);
    }
  };

  const handleClick = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createParticles(x, y);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={ref} className="particle-burst inline-block">
      {children}
    </div>
  );
};