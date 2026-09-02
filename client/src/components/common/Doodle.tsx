import React from 'react';
import { cn } from '../../lib/utils';

interface DoodleProps {
  emoji?: string;
  type?: 'star' | 'heart' | 'underline' | 'arrow' | 'sparkle' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

export const Doodle: React.FC<DoodleProps> = ({ emoji, type, className = '', style }) => {
  if (emoji) {
    return (
      <div
        className={cn('inline-block select-none pointer-events-none transition-transform hover:scale-110', className)}
        style={style}
        aria-hidden="true"
      >
        {emoji}
      </div>
    );
  }

  if (type === 'underline') {
    return (
      <svg
        className={cn('w-full h-3 text-secondary-fixed opacity-80', className)}
        preserveAspectRatio="none"
        viewBox="0 0 100 20"
        style={style}
      >
        <path d="M0,12 Q50,22 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'sparkle') {
    return (
      <svg className={cn('w-6 h-6 text-tertiary-fixed-dim', className)} viewBox="0 0 24 24" fill="currentColor" style={style}>
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg className={cn('w-6 h-6 text-primary', className)} viewBox="0 0 24 24" fill="currentColor" style={style}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  return null;
};
