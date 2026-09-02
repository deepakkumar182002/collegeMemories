import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChapters, useMemories } from '../../hooks/useData';
import { MemoryCard } from '../../components/memories/MemoryCard';
import { StickyNote } from '../../components/common/StickyNote';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { Tape } from '../../components/common/Tape';
import { ReactionPicker } from '../../components/common/ReactionPicker';
import { CommentSection } from '../../components/common/CommentSection';

export const JourneyPage: React.FC = () => {
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: memoriesData, isLoading: memoriesLoading } = useMemories();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const memories = memoriesData?.memories || [];

  if (chaptersLoading || memoriesLoading) {
    return <LoadingSpinner message="Preparing your time machine journey..." />;
  }

  if (chapters.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <p className="font-handwriting text-3xl text-primary">No chapters available yet!</p>
      </div>
    );
  }

  const currentChapter = chapters[currentChapterIndex];
  const chapterMemories = memories.filter(
    (m) =>
      (typeof m.chapter === 'object' && m.chapter?._id === currentChapter._id) ||
      m.chapter === currentChapter._id
  );

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setShowComments(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setShowComments(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-gutter py-8 md:py-12">
      {/* Chapter Stepper Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 bg-surface dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={handlePrev}
          disabled={currentChapterIndex === 0}
          className="p-2 rounded-full hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-primary dark:text-rose-400" />
        </button>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {chapters.map((ch, idx) => (
            <button
              key={ch._id}
              onClick={() => {
                setCurrentChapterIndex(idx);
                setShowComments(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-montserrat font-bold whitespace-nowrap transition-all ${
                idx === currentChapterIndex
                  ? 'bg-primary dark:bg-rose-700 text-white shadow-sm scale-105'
                  : 'bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-300'
              }`}
            >
              {ch.chapterNumber < 10 ? `0${ch.chapterNumber}` : ch.chapterNumber}. {ch.title}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentChapterIndex === chapters.length - 1}
          className="p-2 rounded-full hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-primary dark:text-rose-400" />
        </button>
      </div>

      {/* Main Chapter Spread Presentation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 shadow-2xl border border-outline-variant/40 dark:border-slate-800 relative notebook-lines"
        >
          <Tape className="-top-4 left-16 w-28 h-7 opacity-70" rotation={-2} />

          {/* Chapter Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-outline-variant/30 dark:border-slate-800 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary dark:text-rose-300 bg-primary-fixed dark:bg-rose-950/60 px-3 py-1 rounded-full">
                  Chapter {currentChapter.chapterNumber} of {chapters.length}
                </span>
                {currentChapter.year && (
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {currentChapter.year}
                  </span>
                )}
              </div>

              <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary dark:text-rose-400 flex items-center gap-3">
                {currentChapter.title}
                {currentChapter.emoji && <span className="text-3xl">{currentChapter.emoji}</span>}
              </h1>
            </div>

            <div className="text-right hidden md:block">
              <span className="font-handwriting text-2xl text-on-surface-variant dark:text-slate-400">
                “Memories sealed in time”
              </span>
            </div>
          </div>

          {/* Full Narrative Text */}
          <div className="max-w-3xl mb-8">
            <p className="text-base md:text-lg text-on-surface/90 dark:text-slate-300 leading-relaxed font-body">
              {currentChapter.fullDescription || currentChapter.shortDescription}
            </p>
          </div>

          {/* Chapter Reactions & Like Bar */}
          <div className="mb-10 max-w-xl">
            <ReactionPicker
              targetType="chapter"
              targetId={currentChapter._id}
              targetTitle={currentChapter.title}
              initialReactions={currentChapter.reactions || {}}
              initialLikes={currentChapter.likesCount || 0}
              onToggleComments={() => setShowComments(!showComments)}
            />
          </div>

          {/* Expandable Chapter Comments Drawer */}
          {showComments && (
            <div className="mb-12 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-outline-variant/30 dark:border-slate-800">
              <CommentSection
                targetType="chapter"
                targetId={currentChapter._id}
                targetTitle={currentChapter.title}
              />
            </div>
          )}

          {/* Chapter Memories Gallery */}
          {chapterMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {chapterMemories.map((mem, idx) => (
                <div key={mem._id} className="flex justify-center">
                  <MemoryCard
                    memory={mem}
                    allMemoriesInContext={chapterMemories}
                    customRotation={mem.rotation || (idx % 2 === 0 ? -3 : 3)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface dark:bg-slate-800/40 rounded-2xl border border-dashed border-outline-variant dark:border-slate-700">
              <p className="font-handwriting text-2xl text-on-surface-variant dark:text-slate-400">
                Photos for this chapter are currently in the darkroom! 📸
              </p>
            </div>
          )}

          {/* Next / Previous Chapter Navigation at bottom */}
          <div className="flex items-center justify-between pt-12 mt-12 border-t border-outline-variant/30 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
              className="px-6 py-2.5 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider text-primary dark:text-rose-400 hover:bg-surface-container dark:hover:bg-slate-800 disabled:opacity-30 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Chapter
            </button>

            <span className="font-montserrat text-xs text-on-surface-variant dark:text-slate-400 font-semibold">
              {currentChapterIndex + 1} / {chapters.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentChapterIndex === chapters.length - 1}
              className="bg-primary dark:bg-rose-700 text-white hover:bg-primary-container dark:hover:bg-rose-800 px-6 py-2.5 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider disabled:opacity-30 transition-colors flex items-center gap-2"
            >
              Next Chapter
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

