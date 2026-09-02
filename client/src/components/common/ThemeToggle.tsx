import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { isDark, toggleTheme } = useTheme();

  const isSmall = size === 'sm';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-between rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500/40 select-none shadow-md ${
        isDark
          ? 'bg-slate-900 border border-indigo-500/30 text-amber-200'
          : 'bg-amber-100/90 border border-amber-300/70 text-amber-700'
      } ${isSmall ? 'w-14 h-7' : 'w-16 h-8'} ${className}`}
    >
      {/* Background Micro Details */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        {isDark ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-slate-950 flex items-center justify-start pl-2">
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              className="text-[9px] text-indigo-300"
            >
              ✦
            </motion.span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 via-amber-100 to-orange-100/60 flex items-center justify-end pr-2">
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              className="text-[9px] text-amber-500"
            >
              ☼
            </motion.span>
          </div>
        )}
      </div>

      {/* Static Icons in track */}
      <span className={`z-0 transition-opacity duration-300 flex items-center justify-center ${isDark ? 'opacity-30 pl-1' : 'opacity-0'} ${isSmall ? 'w-4 h-4' : 'w-5 h-5'}`}>
        <Sun className="w-3.5 h-3.5 text-amber-500" />
      </span>

      <span className={`z-0 transition-opacity duration-300 flex items-center justify-center ${!isDark ? 'opacity-30 pr-1' : 'opacity-0'} ${isSmall ? 'w-4 h-4' : 'w-5 h-5'}`}>
        <Moon className="w-3.5 h-3.5 text-indigo-300" />
      </span>

      {/* Animated Sliding Thumb */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
        }}
        className={`absolute rounded-full shadow-md flex items-center justify-center transform ${
          isDark
            ? isSmall ? 'left-[30px] bg-slate-800 border border-indigo-400/40 text-yellow-300' : 'left-[34px] bg-slate-800 border border-indigo-400/40 text-yellow-300'
            : isSmall ? 'left-1 bg-white border border-amber-200 text-amber-500' : 'left-1 bg-white border border-amber-200 text-amber-500'
        } ${isSmall ? 'w-5 h-5' : 'w-6 h-6'}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0.2, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Moon className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-300 fill-amber-300/30`} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0.2, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Sun className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-500 fill-amber-400/40`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};
