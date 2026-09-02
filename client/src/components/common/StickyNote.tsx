import React from 'react';
import { cn } from '../../lib/utils';
import { Tape } from './Tape';

interface StickyNoteProps {
  content: string;
  author?: string;
  emoji?: string;
  style?: 'yellow' | 'pink' | 'purple' | 'blue' | 'green' | 'orange' | 'cream';
  rotation?: number;
  className?: string;
  tapeTop?: boolean;
}

const colorMap = {
  yellow: 'bg-[#ffdf96] text-[#332500]',
  pink: 'bg-[#ffd0d7] text-[#4f101f]',
  purple: 'bg-[#e2d5f8] text-[#2c1b4d]',
  blue: 'bg-[#d0e5ff] text-[#0d2a52]',
  green: 'bg-[#d2f3d5] text-[#143d1a]',
  orange: 'bg-[#ffe1c6] text-[#4d2503]',
  cream: 'bg-[#f5f0e6] text-[#2e261d]',
};

export const StickyNote: React.FC<StickyNoteProps> = ({
  content,
  author,
  emoji,
  style = 'yellow',
  rotation = 0,
  className = '',
  tapeTop = true,
}) => {
  return (
    <div
      className={cn('sticky-note select-none', colorMap[style] || colorMap.yellow, className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {tapeTop && <Tape className="-top-3 left-1/2 -translate-x-1/2 w-16 h-5 opacity-70" rotation={1} />}
      
      {emoji && <div className="text-2xl mb-1">{emoji}</div>}
      
      <p className="font-handwriting text-xl md:text-2xl leading-snug break-words">
        "{content}"
      </p>
      
      {author && (
        <div className="mt-3 text-right font-handwriting text-base font-bold opacity-85">
          — {author}
        </div>
      )}
    </div>
  );
};
