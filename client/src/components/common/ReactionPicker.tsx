import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Sparkles } from 'lucide-react';
import { useReactMutation } from '../../hooks/useData';
import { FloatingEmojiContainer, FloatingParticle } from './FloatingEmoji';

const AVAILABLE_EMOJIS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Lit' },
  { emoji: '🥹', label: 'Nostalgia' },
  { emoji: '🎓', label: 'Batch' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '👏', label: 'Cheers' },
  { emoji: '🥳', label: 'Party' },
];

interface ReactionPickerProps {
  targetType: 'chapter' | 'memory';
  targetId: string;
  targetTitle?: string;
  initialReactions?: Record<string, number>;
  initialLikes?: number;
  commentsCount?: number;
  onToggleComments?: () => void;
  showCommentsButton?: boolean;
  className?: string;
  compact?: boolean;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  targetType,
  targetId,
  targetTitle = 'Scrapbook Item',
  initialReactions = {},
  initialLikes = 0,
  commentsCount = 0,
  onToggleComments,
  showCommentsButton = true,
  className = '',
  compact = false,
}) => {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  const reactMutation = useReactMutation();

  const spawnParticles = (emoji: string) => {
    const newParticles: FloatingParticle[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      emoji,
      xOffset: (Math.random() - 0.5) * 120,
      yOffset: -60 - Math.random() * 80,
      rotate: (Math.random() - 0.5) * 60,
      scale: 0.8 + Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.4,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEmojiClick = (emoji: string) => {
    // Optimistic UI update
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    spawnParticles(emoji);

    reactMutation.mutate({
      targetType,
      targetId,
      emoji,
      type: 'reaction',
    });
  };

  const handleLikeClick = () => {
    setIsLiked(true);
    setLikesCount((prev) => prev + 1);
    spawnParticles('❤️');

    reactMutation.mutate({
      targetType,
      targetId,
      emoji: '❤️',
      type: 'like',
    });
  };

  return (
    <div className={`relative flex items-center justify-between flex-wrap gap-2 py-2 px-3 rounded-2xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs select-none transition-colors ${className}`}>
      {/* Floating particles viewport */}
      <FloatingEmojiContainer particles={particles} onComplete={removeParticle} />

      {/* Main Like & Emoji Reaction Row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-montserrat font-bold transition-all ${
            isLiked || likesCount > 0
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
          }`}
          title="Send Love & Like"
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked || likesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
              }`}
            />
          </motion.div>
          <span>{likesCount > 0 ? likesCount : 'Like'}</span>
        </motion.button>

        {/* Emoji Reaction Pills */}
        <div className="flex items-center gap-1">
          {AVAILABLE_EMOJIS.slice(0, compact ? 4 : 7).map(({ emoji, label }) => {
            const count = reactions[emoji] || 0;
            return (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleEmojiClick(emoji)}
                className={`relative px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                  count > 0
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-slate-800 dark:text-slate-100'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                }`}
                title={`React with ${label}`}
              >
                <span className="text-sm">{emoji}</span>
                {count > 0 && <span className="text-[10px] font-bold">{count}</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Optional Comments Toggle Button */}
      {showCommentsButton && onToggleComments && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleComments}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-montserrat font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          title="View & Add Memory Notes/Comments"
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-800 dark:text-rose-400" />
          <span>{commentsCount > 0 ? `${commentsCount} notes` : 'Add note'}</span>
        </motion.button>
      )}
    </div>
  );
};
