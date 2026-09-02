import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BulbConfig {
  top: string;
  left?: string;
  right?: string;
  color: string;
  glow: string;
  delay: string;
  duration: string;
  size?: string;
}

const LEFT_BULBS: BulbConfig[] = [
  { top: '24px', left: '14px', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.9)', delay: '0s', duration: '2.1s' },
  { top: '68px', left: '18px', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)', delay: '0.6s', duration: '3.2s' },
  { top: '115px', left: '12px', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.9)', delay: '1.2s', duration: '2.5s' },
  { top: '165px', left: '20px', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)', delay: '0.3s', duration: '2.8s' },
  { top: '215px', left: '15px', color: '#4ade80', glow: 'rgba(74, 222, 128, 0.9)', delay: '1.5s', duration: '3.0s' },
  { top: '265px', left: '22px', color: '#fb923c', glow: 'rgba(251, 146, 60, 0.9)', delay: '0.9s', duration: '2.4s' },
  { top: '320px', left: '16px', color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', delay: '1.8s', duration: '2.7s' },
];

const RIGHT_BULBS: BulbConfig[] = [
  { top: '24px', right: '14px', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)', delay: '0.4s', duration: '2.9s' },
  { top: '68px', right: '20px', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.9)', delay: '1.1s', duration: '2.3s' },
  { top: '115px', right: '14px', color: '#4ade80', glow: 'rgba(74, 222, 128, 0.9)', delay: '0.2s', duration: '3.1s' },
  { top: '165px', right: '18px', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.9)', delay: '1.6s', duration: '2.6s' },
  { top: '215px', right: '12px', color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', delay: '0.8s', duration: '2.8s' },
  { top: '265px', right: '22px', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)', delay: '1.4s', duration: '3.3s' },
  { top: '320px', right: '16px', color: '#fb923c', glow: 'rgba(251, 146, 60, 0.9)', delay: '0.5s', duration: '2.2s' },
];

export const FairyLights: React.FC = () => {
  const { isDark } = useTheme();

  if (!isDark) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {/* ============================================================ */}
      {/* 1. LEFT SIDE JHALAR STRING & HANGING VINTAGE LAMP             */}
      {/* ============================================================ */}
      <div className="absolute top-0 left-0 hidden md:block w-20 h-[520px]">
        {/* Wire SVG */}
        <svg className="absolute top-0 left-3 w-8 h-[370px] stroke-slate-600/70 fill-none" strokeWidth="1.5">
          <path d="M 10 0 Q 22 80 14 160 T 18 320 L 16 360" />
        </svg>

        {/* Fairy Bulbs */}
        {LEFT_BULBS.map((b, i) => (
          <div
            key={`left-bulb-${i}`}
            className="fairy-bulb absolute rounded-full"
            style={{
              top: b.top,
              left: b.left,
              backgroundColor: b.color,
              boxShadow: `0 0 14px 4px ${b.glow}, 0 0 24px 8px ${b.glow}`,
              animationDelay: b.delay,
              animationDuration: b.duration,
              width: '10px',
              height: '14px',
              borderRadius: '50% 50% 40% 40%',
            }}
          />
        ))}

        {/* Hanging Vintage College Lantern */}
        <div className="lamp-sway absolute top-[360px] left-1 origin-top flex flex-col items-center">
          {/* Lamp Holder Cap */}
          <div className="w-5 h-2 bg-amber-800 rounded-t-sm border border-amber-600/50" />
          {/* Glass Housing with glowing bulb */}
          <div className="relative w-8 h-12 bg-amber-500/20 border border-amber-400/40 rounded-b-xl backdrop-blur-xs flex items-center justify-center shadow-[0_0_30px_10px_rgba(251,191,36,0.35)]">
            <div className="w-3.5 h-5 bg-amber-300 rounded-full shadow-[0_0_16px_6px_rgba(253,224,71,0.9)] animate-pulse" />
          </div>
          {/* Downward light cone */}
          <div className="w-28 h-36 bg-gradient-to-b from-amber-400/15 to-transparent rounded-full blur-md -mt-2" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RIGHT SIDE JHALAR STRING & HANGING VINTAGE LAMP            */}
      {/* ============================================================ */}
      <div className="absolute top-0 right-0 hidden md:block w-20 h-[520px]">
        {/* Wire SVG */}
        <svg className="absolute top-0 right-3 w-8 h-[370px] stroke-slate-600/70 fill-none" strokeWidth="1.5">
          <path d="M 14 0 Q 4 80 12 160 T 8 320 L 10 360" />
        </svg>

        {/* Fairy Bulbs */}
        {RIGHT_BULBS.map((b, i) => (
          <div
            key={`right-bulb-${i}`}
            className="fairy-bulb absolute rounded-full"
            style={{
              top: b.top,
              right: b.right,
              backgroundColor: b.color,
              boxShadow: `0 0 14px 4px ${b.glow}, 0 0 24px 8px ${b.glow}`,
              animationDelay: b.delay,
              animationDuration: b.duration,
              width: '10px',
              height: '14px',
              borderRadius: '50% 50% 40% 40%',
            }}
          />
        ))}

        {/* Hanging Vintage College Lantern */}
        <div className="lamp-sway-delayed absolute top-[360px] right-1 origin-top flex flex-col items-center">
          {/* Lamp Holder Cap */}
          <div className="w-5 h-2 bg-amber-800 rounded-t-sm border border-amber-600/50" />
          {/* Glass Housing with glowing bulb */}
          <div className="relative w-8 h-12 bg-amber-500/20 border border-amber-400/40 rounded-b-xl backdrop-blur-xs flex items-center justify-center shadow-[0_0_30px_10px_rgba(251,191,36,0.35)]">
            <div className="w-3.5 h-5 bg-amber-300 rounded-full shadow-[0_0_16px_6px_rgba(253,224,71,0.9)] animate-pulse" />
          </div>
          {/* Downward light cone */}
          <div className="w-28 h-36 bg-gradient-to-b from-amber-400/15 to-transparent rounded-full blur-md -mt-2" />
        </div>
      </div>
    </div>
  );
};
