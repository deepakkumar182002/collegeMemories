import React from 'react';
import { cn } from '../../lib/utils';

interface TapeProps {
  className?: string;
  rotation?: number;
}

export const Tape: React.FC<TapeProps> = ({ className = '', rotation = -3 }) => {
  return (
    <div
      className={cn('tape rounded-sm', className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    />
  );
};
