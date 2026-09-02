import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingParticle {
  id: string;
  emoji: string;
  xOffset: number;
  yOffset: number;
  rotate: number;
  scale: number;
  duration: number;
}

interface FloatingEmojiProps {
  particles: FloatingParticle[];
  onComplete: (id: string) => void;
}

export const FloatingEmojiContainer: React.FC<FloatingEmojiProps> = ({ particles, onComplete }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: p.scale * 0.5,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0.9, 0],
              scale: [p.scale * 0.5, p.scale * 1.2, p.scale],
              x: p.xOffset,
              y: p.yOffset,
              rotate: p.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => onComplete(p.id)}
            className="absolute left-1/2 bottom-4 text-2xl select-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
