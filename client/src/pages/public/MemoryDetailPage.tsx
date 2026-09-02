import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Tag, Users, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useMemory } from '../../hooks/useData';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatMediaUrl } from '../../lib/utils';
import { Tape } from '../../components/common/Tape';
import { toast } from 'sonner';

export const MemoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useMemory(id || '');

  if (isLoading) {
    return <LoadingSpinner message="Retrieving memory artifact..." />;
  }

  if (!data?.memory) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Memory Not Found</h2>
        <Link to="/gallery" className="text-primary underline font-montserrat text-sm font-semibold">
          Return to Gallery
        </Link>
      </div>
    );
  }

  const { memory, adjacent } = data;
  const isVideo = memory.mediaType === 'video' || memory.media?.resourceType === 'video';
  const mediaUrl = formatMediaUrl(memory.media?.url);
  const chapterTitle = typeof memory.chapter === 'object' ? memory.chapter?.title : 'College Memory';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: memory.title,
        text: memory.caption || memory.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Memory link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-gutter py-8 md:py-12">
      {/* Top Back & Share Actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-montserrat font-bold uppercase tracking-wider text-primary hover:text-primary-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Memories
        </button>

        <button
          onClick={handleShare}
          className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Share2 className="w-4 h-4" />
          Share Memory
        </button>
      </div>

      {/* Main Memory Scrapbook Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/40 relative">
        <Tape className="-top-3 left-12 w-28 h-6 opacity-70" rotation={-1} />

        {/* Media Container */}
        <div className="w-full bg-black/95 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[75vh] object-contain"
            />
          ) : mediaUrl ? (
            <img
              src={mediaUrl}
              alt={memory.title}
              className="w-full max-h-[75vh] object-contain"
            />
          ) : (
            <div className="p-16 text-center text-white/60">
              <p className="font-handwriting text-3xl">Handwritten Memory Note 📝</p>
            </div>
          )}
        </div>

        {/* Details & Notes */}
        <div className="p-6 md:p-10 bg-surface relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-widest bg-primary-fixed text-primary">
              {chapterTitle}
            </span>
            {memory.emoji && <span className="text-2xl">{memory.emoji}</span>}
          </div>

          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-3">
            {memory.title}
          </h1>

          {memory.caption && (
            <p className="font-handwriting text-2xl md:text-3xl text-on-surface-variant font-medium -rotate-1 mb-6">
              “{memory.caption}”
            </p>
          )}

          {memory.description && (
            <p className="text-on-surface/90 text-base leading-relaxed mb-8 font-body">
              {memory.description}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-outline-variant/40 text-xs font-medium text-on-surface-variant">
            {memory.memoryDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{memory.memoryDate} ({memory.year})</span>
              </div>
            )}
            {memory.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{memory.location}</span>
              </div>
            )}
            {memory.people && memory.people.length > 0 && (
              <div className="sm:col-span-2 flex items-start gap-2">
                <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {memory.people.map((person, idx) => (
                    <span key={idx} className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px]">
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Adjacent Navigation */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          {adjacent?.prev ? (
            <Link
              to={`/memory/${adjacent.prev._id}`}
              className="flex items-center gap-2 text-xs font-montserrat font-bold text-primary hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: {adjacent.prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {adjacent?.next && (
            <Link
              to={`/memory/${adjacent.next._id}`}
              className="flex items-center gap-2 text-xs font-montserrat font-bold text-primary hover:underline ml-auto"
            >
              <span>Next: {adjacent.next.title}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
