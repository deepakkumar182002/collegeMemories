import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const TorchCursor: React.FC = () => {
  const { isDark } = useTheme();
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [isVisible, setIsVisible] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!isDark) return;

    // Check if it's a touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isDark, isVisible]);

  if (!isDark || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 280px at ${pos.x}px ${pos.y}px, rgba(254, 240, 138, 0.12) 0%, rgba(251, 191, 36, 0.05) 45%, rgba(15, 16, 19, 0) 100%)`,
      }}
    >
      {/* Inner brighter spotlight focus */}
      <div
        className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(253, 224, 71, 0.08) 50%, transparent 100%)',
          boxShadow: '0 0 50px 20px rgba(254, 240, 138, 0.08)',
        }}
      />
    </div>
  );
};
