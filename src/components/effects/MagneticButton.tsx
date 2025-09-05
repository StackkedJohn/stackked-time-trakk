import { useEffect, useRef, ReactElement, cloneElement } from 'react';

interface MagneticButtonProps {
  children: ReactElement;
  strength?: number;
}

export const MagneticButton = ({ children, strength = 15 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 100;
      
      if (distance < maxDistance) {
        const factor = (maxDistance - distance) / maxDistance;
        const moveX = deltaX * factor * (strength / 15);
        const moveY = deltaY * factor * (strength / 15);
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="magnetic inline-block">
      {cloneElement(children, {
        className: `${children.props.className || ''} btn-liquid prismatic`,
      })}
    </div>
  );
};