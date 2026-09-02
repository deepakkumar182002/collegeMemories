import React from 'react';
import { Memory } from '../../types';
import { useLightbox } from '../../context/LightboxContext';
import { formatMediaUrl, cn } from '../../lib/utils';
import { Play, MapPin, Calendar, Film } from 'lucide-react';
import { Tape } from '../common/Tape';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  customRotation?: number;
  className?: string;
  allMemoriesInContext?: Memory[];
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
  customRotation,
  className = '',
  allMemoriesInContext = [],
}) => {
  const { openLightbox } = useLightbox();

  const rotation = customRotation !== undefined ? customRotation : memory.rotation || 0;
  const isVideo = memory.mediaType === 'video' || memory.media?.resourceType === 'video';
  const mediaUrl = formatMediaUrl(memory.media?.thumbnail || memory.media?.url);
  const fullUrl = formatMediaUrl(memory.media?.url);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openLightbox(memory, allMemoriesInContext);
    }
  };

  // 1. STICKY NOTE STYLE
  if (memory.layoutStyle === 'sticky-note') {
    return (
      <div
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className={cn(
          'sticky-note bg-[#ffdf96] text-[#332500] cursor-pointer group transition-all duration-300 select-none max-w-sm',
          className
        )}
      >
        <Tape className="-top-3 left-1/2 -translate-x-1/2 w-16 h-5 opacity-70" rotation={-1} />
        {memory.emoji && <div className="text-2xl mb-1">{memory.emoji}</div>}
        <h4 className="font-headline font-bold text-base mb-1 text-primary">{memory.title}</h4>
        <p className="font-handwriting text-xl md:text-2xl leading-snug break-words">
          “{memory.caption || memory.description || memory.title}”
        </p>
        <div className="mt-3 flex items-center justify-between text-xs opacity-75 font-medium border-t border-black/10 pt-2">
          <span>{memory.memoryDate || memory.year || 'College Memory'}</span>
          {memory.location && <span>📍 {memory.location}</span>}
        </div>
      </div>
    );
  }

  // 2. FILM FRAME STYLE (Great for Videos)
  if (memory.layoutStyle === 'film-frame') {
    return (
      <div
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className={cn(
          'film-frame cursor-pointer group transition-all duration-300 relative overflow-hidden select-none',
          className
        )}
      >
        <div className="film-perforations-top" />
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60 rounded my-3">
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              <Film className="w-10 h-10" />
            </div>
          )}

          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/15 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {memory.emoji && (
            <span className="absolute top-2 right-2 text-xl drop-shadow">{memory.emoji}</span>
          )}
        </div>
        <div className="film-perforations-bottom" />

        <div className="px-1 text-white">
          <p className="font-headline font-semibold text-sm truncate">{memory.title}</p>
          {memory.caption && (
            <p className="font-handwriting text-white/80 text-lg truncate">“{memory.caption}”</p>
          )}
        </div>
      </div>
    );
  }

  // 3. NOTEBOOK CARD STYLE
  if (memory.layoutStyle === 'notebook-card') {
    return (
      <div
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className={cn(
          'bg-[#ffffff] p-5 rounded-lg border border-outline-variant/50 shadow-md cursor-pointer group transition-all duration-300 relative select-none hover:shadow-xl hover:scale-[1.02] notebook-lines',
          className
        )}
      >
        <Tape className="-top-3 right-4 w-20 h-5 opacity-60" rotation={2} />
        {mediaUrl && (
          <div className="aspect-video w-full overflow-hidden rounded mb-3 bg-surface-container-high border border-outline-variant/30">
            <img
              src={mediaUrl}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          {memory.emoji && <span className="text-xl">{memory.emoji}</span>}
          <h4 className="font-headline font-bold text-base text-primary">{memory.title}</h4>
        </div>
        {memory.caption && (
          <p className="font-handwriting text-xl text-on-surface-variant mb-2">
            “{memory.caption}”
          </p>
        )}
        {memory.description && (
          <p className="text-xs text-on-surface/80 line-clamp-2 leading-relaxed font-body">
            {memory.description}
          </p>
        )}
        <div className="mt-3 text-[11px] font-semibold text-outline flex items-center justify-between">
          <span>{memory.memoryDate || memory.year}</span>
          {memory.tags?.[0] && <span className="text-primary">#{memory.tags[0]}</span>}
        </div>
      </div>
    );
  }

  // 4. TICKET STYLE (Events & Festivals)
  if (memory.layoutStyle === 'ticket') {
    return (
      <div
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className={cn(
          'bg-[#fffdf7] border-2 border-dashed border-primary/40 rounded-xl p-4 shadow-md cursor-pointer group transition-all duration-300 relative select-none hover:scale-[1.02] hover:border-primary',
          className
        )}
      >
        <div className="flex items-center justify-between pb-2 border-b border-dashed border-outline-variant/50 mb-2">
          <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-primary">
            ADMIT ONE • MEMORY PASS
          </span>
          <span className="text-xl">{memory.emoji || '🎟️'}</span>
        </div>
        <h4 className="font-headline font-bold text-lg text-primary mb-1">{memory.title}</h4>
        {memory.caption && (
          <p className="font-handwriting text-xl text-on-surface-variant mb-2">
            “{memory.caption}”
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium pt-2">
          <span>📍 {memory.location || 'Campus'}</span>
          <span>{memory.memoryDate || memory.year}</span>
        </div>
      </div>
    );
  }

  // 5. POSTCARD STYLE
  if (memory.layoutStyle === 'postcard') {
    return (
      <div
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
        className={cn(
          'bg-[#fdfaf2] p-4 rounded shadow-md border border-[#e4dcce] cursor-pointer group transition-all duration-300 relative select-none hover:shadow-xl hover:scale-[1.02]',
          className
        )}
      >
        <Tape className="-top-3 left-6 w-16 h-5 opacity-60" rotation={-2} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {mediaUrl && (
            <div className="aspect-[4/3] overflow-hidden rounded bg-surface-container-high">
              <img
                src={mediaUrl}
                alt={memory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-headline font-bold text-sm text-primary">{memory.title}</h4>
              <span className="text-lg">💌</span>
            </div>
            {memory.caption && (
              <p className="font-handwriting text-lg text-on-surface-variant mb-1">
                “{memory.caption}”
              </p>
            )}
            <p className="text-xs text-on-surface/70 line-clamp-2 mb-2 font-body">
              {memory.description}
            </p>
            <div className="text-[10px] text-outline uppercase tracking-wider font-semibold">
              {memory.location} • {memory.year}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. DEFAULT POLAROID STYLE (Core Scrapbook Visual)
  return (
    <div
      onClick={handleClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={cn(
        'polaroid cursor-pointer group transition-all duration-300 select-none',
        className
      )}
    >
      <Tape className="-top-3 left-1/4 w-20 h-6 opacity-60" rotation={-rotation * 0.8} />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-high rounded-sm shadow-inner">
        {mediaUrl ? (
          <img
            src={mediaUrl}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 text-center bg-[#f7f4ec]">
            <p className="font-handwriting text-2xl text-on-surface-variant">
              “{memory.caption || memory.title}”
            </p>
          </div>
        )}

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
            <div className="w-11 h-11 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}

        {memory.emoji && (
          <span className="absolute top-2 right-2 text-xl drop-shadow-sm pointer-events-none">
            {memory.emoji}
          </span>
        )}
      </div>

      <div className="text-center mt-3">
        <p className="font-handwriting text-xl md:text-2xl text-on-surface font-semibold leading-tight line-clamp-1">
          {memory.caption || memory.title}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant/80 mt-1 font-medium">
          {memory.memoryDate && <span>{memory.memoryDate}</span>}
          {memory.location && <span>• 📍 {memory.location}</span>}
        </div>
      </div>
    </div>
  );
};
