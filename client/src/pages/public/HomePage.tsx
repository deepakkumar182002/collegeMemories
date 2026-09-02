import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowDown,
  Calendar,
  MapPin,
  Heart,
  Send,
  Film,
  Camera,
  BookOpen,
  Users,
} from 'lucide-react';
import { useChapters, useMemories, useMessages, useCreateMessageMutation, useSiteSettings } from '../../hooks/useData';
import { MemoryCard } from '../../components/memories/MemoryCard';
import { StickyNote } from '../../components/common/StickyNote';
import { Tape } from '../../components/common/Tape';
import { Doodle } from '../../components/common/Doodle';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { formatMediaUrl } from '../../lib/utils';
import { Chapter, Memory } from '../../types';

export const HomePage: React.FC = () => {
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: memoriesData, isLoading: memoriesLoading } = useMemories();
  const { data: messages = [] } = useMessages();
  const { data: settingsData } = useSiteSettings();
  const createMessageMutation = useCreateMessageMutation();

  const settings = settingsData?.settings;
  const memories = memoriesData?.memories || [];

  // Sticky Note Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'yellow' | 'pink' | 'purple' | 'blue' | 'green' | 'orange'>('yellow');
  const [selectedEmoji, setSelectedEmoji] = useState('💌');

  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger timeline filling animation
  useEffect(() => {
    if (chaptersLoading || !chapters.length) return;

    const ctx = gsap.context(() => {
      // Animate chapter rows on scroll
      const chapterSections = gsap.utils.toArray('.chapter-section');
      chapterSections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    }, timelineContainerRef);

    return () => ctx.revert();
  }, [chapters, chaptersLoading]);

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    createMessageMutation.mutate({
      authorName: newAuthor.trim(),
      message: newMessage.trim(),
      emoji: selectedEmoji,
      style: selectedStyle,
    });

    setNewAuthor('');
    setNewMessage('');
  };

  if (chaptersLoading || memoriesLoading) {
    return <LoadingSpinner message="Opening the memory box & turning the pages..." />;
  }

  // Filter featured memories for the hero section
  const featuredMemories = memories.filter((m) => m.isFeatured);
  const heroMem1 = featuredMemories[0] || memories[0];
  const heroMem2 = featuredMemories[1] || memories[1];

  return (
    <div className="relative w-full overflow-hidden">
      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO SECTION                                   */}
      {/* ============================================================ */}
      <section className="min-h-[92vh] flex flex-col justify-center items-center relative px-4 py-12 md:py-20 text-center">
        {/* Floating Scrapbook Doodles */}
        <div className="absolute top-12 left-[8%] text-5xl md:text-6xl animate-float-slow select-none opacity-80" style={{ animationDelay: '0s' }}>
          🎒
        </div>
        <div className="absolute top-24 right-[10%] text-5xl md:text-6xl animate-float-delayed select-none opacity-80">
          📚
        </div>
        <div className="absolute bottom-16 left-[12%] text-4xl md:text-5xl animate-float-slow select-none opacity-75" style={{ animationDelay: '1.5s' }}>
          ☕
        </div>
        <div className="absolute bottom-28 right-[12%] text-4xl md:text-5xl animate-float-delayed select-none opacity-75">
          ✨
        </div>

        {/* Hero Copy */}
        <div className="max-w-4xl mx-auto mb-10 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-montserrat font-bold tracking-widest text-primary uppercase bg-surface-container-high border border-outline-variant/40 mb-4 shadow-xs">
              {settings?.collegeName || 'Class of 2020 - 2024'}
            </span>

            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary leading-tight mb-6">
              Some places become memories.<br className="hidden sm:inline" />
              Some people become{' '}
              <span className="relative inline-block text-primary-container">
                family.
                <svg
                  className="absolute w-full h-3 md:h-4 -bottom-1 left-0 text-tertiary-fixed-dim opacity-80"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 20"
                >
                  <path d="M0,10 Q50,22 100,5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="font-body text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {settings?.heroSubtitle ||
                'A journey that started as strangers and ended with unforgettable memories. Welcome to the interactive scrapbook of our college life.'}
            </p>
          </motion.div>
        </div>

        {/* 3D Interactive Scrapbook Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative w-full max-w-4xl h-[380px] sm:h-[460px] md:h-[540px] flex items-center justify-center perspective-[1000px] z-10 mx-auto"
        >
          <div className="w-full h-full glass-panel rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/60 transform rotate-x-[4deg] transition-transform duration-700 hover:rotate-x-[1deg] hover:scale-[1.01]">
            
            {/* Center Spread Image */}
            <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center opacity-95">
              <div
                className="w-full h-full bg-cover bg-center rounded-lg shadow-inner border border-outline-variant/30"
                style={{
                  backgroundImage: `url('${formatMediaUrl(settings?.heroImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop')}')`,
                }}
              />
            </div>

            {/* Floating Polaroid Left */}
            {heroMem1 && (
              <div className="absolute left-[4%] md:left-[8%] top-[14%] w-44 sm:w-52 md:w-60 z-20 transform -rotate-[10deg] hover:rotate-0 transition-transform duration-300">
                <MemoryCard memory={heroMem1} customRotation={-10} allMemoriesInContext={memories} />
              </div>
            )}

            {/* Floating Polaroid Right */}
            {heroMem2 && (
              <div className="absolute right-[4%] md:right-[8%] bottom-[10%] w-48 sm:w-56 md:w-64 z-30 transform rotate-[8deg] hover:rotate-0 transition-transform duration-300">
                <MemoryCard memory={heroMem2} customRotation={8} allMemoriesInContext={memories} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center animate-bounce z-20">
          <span className="font-handwriting text-xl md:text-2xl text-on-surface-variant mb-1 font-semibold">
            Scroll to travel back in time
          </span>
          <a href="#chapters" className="text-primary hover:text-primary-container p-1" aria-label="Scroll to chapters">
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CONTINUOUS TIMELINE OF CHAPTERS                           */}
      {/* ============================================================ */}
      <div id="chapters" ref={timelineContainerRef} className="relative w-full max-w-container-max mx-auto px-4 md:px-gutter py-16 md:py-24">
        {/* Central Dashed Timeline Stitch */}
        <div className="timeline-line hidden md:block" />

        <div className="text-center mb-16 relative z-10">
          <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
            The Chronicle
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mt-2">
            13 Chapters of Our Story
          </h2>
          <p className="font-handwriting text-2xl text-on-surface-variant mt-2 max-w-md mx-auto">
            From Day One strangers to lifelong family.
          </p>
        </div>

        {/* Render Chapters Dynamically */}
        <div className="space-y-24 md:space-y-36 relative z-10">
          {chapters.map((chapter: Chapter, index: number) => {
            const isEven = index % 2 === 0;
            const chapterMemories = memories.filter(
              (m) =>
                (typeof m.chapter === 'object' && m.chapter?._id === chapter._id) ||
                m.chapter === chapter._id
            );

            return (
              <section
                key={chapter._id}
                id={`chapter-${chapter.slug}`}
                className="chapter-section relative flex flex-col md:flex-row items-center w-full group"
              >
                {/* Center Node Dot */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border-4 border-primary z-20 items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>

                {/* Chapter Information Column (Alternates Left/Right) */}
                <div
                  className={`w-full md:w-1/2 ${
                    isEven
                      ? 'md:pr-16 md:text-right text-left order-1'
                      : 'md:pl-16 md:text-left text-left order-1 md:order-2'
                  } mb-8 md:mb-0`}
                >
                  <div className={`flex items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-outline bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30">
                      Chapter {chapter.chapterNumber < 10 ? `0${chapter.chapterNumber}` : chapter.chapterNumber}
                    </span>
                    {chapter.year && (
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {chapter.year}
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline text-2xl md:text-4xl font-bold text-primary mb-3 leading-tight flex items-center gap-2 flex-wrap" style={{ color: chapter.accentColor || '#570000' }}>
                    {chapter.title}
                    {chapter.emoji && <span className="text-2xl">{chapter.emoji}</span>}
                  </h3>

                  <p className="font-body text-base text-on-surface-variant max-w-lg mb-4 leading-relaxed font-normal">
                    {chapter.shortDescription || chapter.fullDescription}
                  </p>

                  <Link
                    to={`/gallery?chapter=${chapter.slug}`}
                    className="inline-flex items-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-container transition-colors"
                  >
                    View all chapter photos ({chapterMemories.length}) →
                  </Link>
                </div>

                {/* Chapter Memories Display Column (Alternates Left/Right) */}
                <div
                  className={`w-full md:w-1/2 ${
                    isEven ? 'md:pl-16 order-2' : 'md:pr-16 order-2 md:order-1'
                  } relative`}
                >
                  {chapterMemories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
                      {chapterMemories.slice(0, 2).map((memory, mIdx) => {
                        const defaultRotations = [isEven ? -3 : 3, isEven ? 4 : -4];
                        const cardRotation = memory.rotation || defaultRotations[mIdx % 2];

                        return (
                          <div
                            key={memory._id}
                            className={`transform ${mIdx === 1 ? 'sm:mt-8' : ''}`}
                          >
                            <MemoryCard
                              memory={memory}
                              customRotation={cardRotation}
                              allMemoriesInContext={chapterMemories}
                            />
                          </div>
                        );
                      })}

                      {/* Small Floating Sticky Note Annotation */}
                      {chapterMemories.length > 0 && (
                        <div className="absolute -bottom-6 -right-2 sm:-right-6 z-30 max-w-[170px] hidden sm:block">
                          <StickyNote
                            content={`${chapter.emoji || '✨'} Year ${chapter.year || 'Memories'}`}
                            style={isEven ? 'yellow' : 'pink'}
                            rotation={isEven ? 8 : -7}
                            tapeTop={true}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback Cover Preview if no memories uploaded yet */
                    <div className="polaroid max-w-md mx-auto transform rotate-2">
                      {chapter.coverImage ? (
                        <img
                          src={formatMediaUrl(chapter.coverImage)}
                          alt={chapter.title}
                          className="w-full h-48 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-48 bg-surface-container flex items-center justify-center text-4xl">
                          {chapter.emoji || '📖'}
                        </div>
                      )}
                      <p className="font-handwriting text-xl text-center mt-3">{chapter.title}</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MOTION PICTURE VAULT TEASER (VIDEOS)                      */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#1b1c1a] text-white relative overflow-hidden my-16">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-tertiary-fixed bg-white/10 px-3 py-1 rounded-full">
                Motion Picture Vault
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mt-2">
                Live Video Reels & Nostalgia In Motion
              </h2>
              <p className="font-handwriting text-xl text-white/70 mt-1">
                Hear the laughter, the cheering, and the late night hostel acoustics.
              </p>
            </div>
            <Link
              to="/videos"
              className="bg-primary text-white hover:bg-primary-container px-6 py-2.5 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider transition-all"
            >
              Open Full Video Archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {memories
              .filter((m) => m.mediaType === 'video' || m.media?.resourceType === 'video')
              .slice(0, 3)
              .map((videoMem, vIdx) => (
                <div key={videoMem._id} className="film-frame">
                  <MemoryCard memory={videoMem} customRotation={0} allMemoriesInContext={memories} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE INTERACTIVE MEMORY WALL (STICKY NOTES GUESTBOOK)      */}
      {/* ============================================================ */}
      <section id="memory-wall" className="py-20 relative max-w-container-max mx-auto px-4 md:px-gutter">
        <div className="text-center mb-12">
          <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
            Interactive Guestbook
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mt-2">
            The Memory Wall
          </h2>
          <p className="font-handwriting text-2xl text-on-surface-variant mt-2 max-w-lg mx-auto">
            Leave a sticky note for the batch. Say something you never got to say!
          </p>
        </div>

        {/* Note Submission Card */}
        <div className="max-w-xl mx-auto mb-16 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-outline-variant/40 relative">
          <Tape className="-top-3 left-8 w-24 h-6 opacity-70" rotation={-1} />
          
          <form onSubmit={handlePostNote} className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
              <span>📌</span> Pin a Sticky Note to the Wall
            </h3>

            <div>
              <label className="block font-montserrat text-xs font-bold uppercase text-on-surface-variant mb-1">
                Your Name / Nickname
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sneha K. (Room 302)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium bg-surface"
              />
            </div>

            <div>
              <label className="block font-montserrat text-xs font-bold uppercase text-on-surface-variant mb-1">
                Your Memory Note / Message
              </label>
              <textarea
                required
                rows={3}
                maxLength={300}
                placeholder="Write a message, inside joke, or heartfelt farewell..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium bg-surface resize-none"
              />
            </div>

            {/* Note Color Selector */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-montserrat text-xs font-bold text-on-surface-variant">Note Color:</span>
                {(['yellow', 'pink', 'purple', 'blue', 'green', 'orange'] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedStyle(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedStyle === color ? 'scale-125 border-primary shadow' : 'border-black/10'
                    }`}
                    style={{
                      backgroundColor:
                        color === 'yellow'
                          ? '#ffdf96'
                          : color === 'pink'
                          ? '#ffd0d7'
                          : color === 'purple'
                          ? '#e2d5f8'
                          : color === 'blue'
                          ? '#d0e5ff'
                          : color === 'green'
                          ? '#d2f3d5'
                          : '#ffe1c6',
                    }}
                    aria-label={`Select ${color} note color`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={createMessageMutation.isPending}
                className="bg-primary hover:bg-primary-container text-white px-6 py-2 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {createMessageMutation.isPending ? 'Pinning...' : 'Pin Note'}
              </button>
            </div>
          </form>
        </div>

        {/* Pinned Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
          {messages.map((msg, index) => {
            const rotations = [-4, 3, -2, 5, -5, 2, -3, 4];
            const rot = msg.rotation || rotations[index % rotations.length];

            return (
              <div key={msg._id} className="flex justify-center">
                <StickyNote
                  content={msg.message}
                  author={msg.authorName}
                  emoji={msg.emoji}
                  style={msg.style}
                  rotation={rot}
                  className="w-full max-w-xs"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. EMOTIONAL GRADUATION & FAREWELL FINALE                    */}
      {/* ============================================================ */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-transparent to-[#f5f0e6]/70">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="text-5xl mb-4">🎓✨❤️</div>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
            The Classroom Closed.<br />The Bonds Are Forever.
          </h2>
          <p className="font-handwriting text-2xl md:text-3xl text-on-surface-variant leading-relaxed mb-8">
            “Here’s to the all-nighters, the canteen laughter, the shared notes, and the friendships that will outlive time.”
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/gallery"
              className="bg-primary text-on-primary hover:bg-primary-container px-8 py-3 rounded-full font-montserrat text-sm font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              Browse Complete Photo Album 📸
            </Link>
            <Link
              to="/friends"
              className="bg-surface-container-high text-primary hover:bg-surface-container-highest px-8 py-3 rounded-full font-montserrat text-sm font-bold uppercase tracking-wider border border-outline-variant/50 transition-all"
            >
              Meet The Batchmates 👥
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
