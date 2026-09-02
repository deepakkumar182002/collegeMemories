import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag, Users, Film, Maximize2 } from 'lucide-react';
import { useLightbox } from '../../context/LightboxContext';
import { formatMediaUrl } from '../../lib/utils';
import { Tape } from './Tape';

export const Lightbox: React.FC = () => {
  const { activeMemory, closeLightbox, nextMemory, prevMemory, memoriesList } = useLightbox();

  if (!activeMemory) return null;

  const isVideo = activeMemory.mediaType === 'video' || activeMemory.media?.resourceType === 'video';
  const mediaUrl = formatMediaUrl(activeMemory.media?.url);
  const chapterTitle = typeof activeMemory.chapter === 'object' ? activeMemory.chapter?.title : 'College Memory';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={closeLightbox}
        />

        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Arrow */}
        {memoriesList.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevMemory();
            }}
            className="absolute left-2 md:left-6 z-50 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-transform hover:scale-110"
            aria-label="Previous memory"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}

        {/* Right Arrow */}
        {memoriesList.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMemory();
            }}
            className="absolute right-2 md:right-6 z-50 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-transform hover:scale-110"
            aria-label="Next memory"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}

        {/* Modal Container */}
        <motion.div
          key={activeMemory._id}
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-surface rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-outline-variant/40"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Column */}
          <div className="w-full md:w-3/5 bg-black/95 flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[60vh] md:max-h-[85vh] relative overflow-hidden">
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain max-h-[75vh]"
              />
            ) : mediaUrl ? (
              <img
                src={mediaUrl}
                alt={activeMemory.title}
                className="w-full h-full object-contain max-h-[80vh]"
                loading="eager"
              />
            ) : (
              <div className="p-12 text-center text-white/60">
                <p className="font-handwriting text-3xl">A cherished text memory 📝</p>
              </div>
            )}
          </div>

          {/* Details Scrapbook Column */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[85vh] bg-[#fbf9f5] relative">
            <Tape className="-top-3 right-6 w-20 h-6 opacity-60" rotation={2} />

            <div>
              {/* Chapter Tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-fixed text-primary border border-primary/20">
                  {chapterTitle}
                </span>
                {activeMemory.emoji && <span className="text-xl">{activeMemory.emoji}</span>}
              </div>

              {/* Title */}
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">
                {activeMemory.title}
              </h2>

              {/* Handwritten Caption */}
              {activeMemory.caption && (
                <p className="font-handwriting text-xl md:text-2xl text-on-surface-variant font-medium -rotate-1 mb-4">
                  “{activeMemory.caption}”
                </p>
              )}

              {/* Full Description */}
              {activeMemory.description && (
                <p className="text-on-surface/90 text-sm md:text-base leading-relaxed mb-6 font-body">
                  {activeMemory.description}
                </p>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="border-t border-outline-variant/40 pt-4 space-y-2.5 text-xs text-on-surface-variant font-medium">
              {activeMemory.memoryDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{activeMemory.memoryDate}</span>
                </div>
              )}

              {activeMemory.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{activeMemory.location}</span>
                </div>
              )}

              {activeMemory.people && activeMemory.people.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {activeMemory.people.map((person, idx) => (
                      <span key={idx} className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px]">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeMemory.tags && activeMemory.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {activeMemory.tags.map((tag, idx) => (
                      <span key={idx} className="text-primary font-semibold text-[11px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
