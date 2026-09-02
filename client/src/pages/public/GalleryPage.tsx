import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Image, Video, FileText, Sparkles, X } from 'lucide-react';
import { useChapters, useMemories } from '../../hooks/useData';
import { MemoryCard } from '../../components/memories/MemoryCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Tape } from '../../components/common/Tape';

export const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialChapter = searchParams.get('chapter') || '';

  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const { data: memoriesData, isLoading: memoriesLoading } = useMemories({
    chapter: selectedChapter || undefined,
    mediaType: selectedMediaType !== 'all' ? selectedMediaType : undefined,
    year: selectedYear !== 'all' ? selectedYear : undefined,
    search: searchQuery || undefined,
    sort: sortBy,
  });

  const memories = memoriesData?.memories || [];

  // Extract unique years
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    memories.forEach((m) => {
      if (m.year) yearsSet.add(m.year);
    });
    return Array.from(yearsSet).sort();
  }, [memories]);

  if (chaptersLoading && memoriesLoading) {
    return <LoadingSpinner message="Curating the photo archives..." />;
  }

  const clearFilters = () => {
    setSelectedChapter('');
    setSelectedMediaType('all');
    setSelectedYear('all');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedChapter || selectedMediaType !== 'all' || selectedYear !== 'all' || searchQuery;

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-gutter py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
          The Photographic Archive
        </span>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary mt-2">
          Polaroid & Memory Gallery
        </h1>
        <p className="font-handwriting text-2xl text-on-surface-variant mt-1">
          Every snapshot, late night study ticket, and candid Polaroid.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-lg border border-outline-variant/40 dark:border-slate-800 mb-10 relative">
        <Tape className="-top-3 right-10 w-24 h-6 opacity-60" rotation={2} />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location, tag, friend..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium bg-surface dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Chapter Selector */}
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                if (e.target.value) {
                  setSearchParams({ chapter: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-montserrat font-bold text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch._id} value={ch.slug}>
                  {ch.chapterNumber < 10 ? `0${ch.chapterNumber}` : ch.chapterNumber}. {ch.title}
                </option>
              ))}
            </select>

            {/* Media Type Selector */}
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-montserrat font-bold text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Media</option>
              <option value="image">📸 Photos & Polaroids</option>
              <option value="video">🎥 Videos</option>
              <option value="text">📝 Handwritten Notes</option>
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-montserrat font-bold text-primary dark:text-rose-400 hover:text-primary-container flex items-center gap-1 bg-surface-container dark:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {memories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
          {memories.map((mem, idx) => {
            const rot = mem.rotation || (idx % 2 === 0 ? -2 : 3);
            return (
              <div key={mem._id} className="flex justify-center">
                <MemoryCard
                  memory={mem}
                  customRotation={rot}
                  allMemoriesInContext={memories}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-outline-variant dark:border-slate-800 p-8 max-w-lg mx-auto">
          <p className="text-4xl mb-2">🔍</p>
          <h3 className="font-headline text-xl font-bold text-primary dark:text-rose-400 mb-1">No Memories Found</h3>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 font-body mb-4">
            Try adjusting your search query or chapter filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-primary dark:bg-rose-700 text-white px-5 py-2 rounded-full font-montserrat text-xs font-bold uppercase"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
