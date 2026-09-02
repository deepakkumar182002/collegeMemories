import React, { useState } from 'react';
import { Film, Play, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useMemories } from '../../hooks/useData';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { VideoModal } from '../../components/common/VideoModal';
import { formatMediaUrl } from '../../lib/utils';
import { Memory } from '../../types';

export const VideosPage: React.FC = () => {
  const { data: memoriesData, isLoading } = useMemories({ mediaType: 'video' });
  const [activeVideo, setActiveVideo] = useState<Memory | null>(null);

  const videoMemories = memoriesData?.memories || [];

  if (isLoading) {
    return <LoadingSpinner message="Spinning the cinematic film reels..." />;
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-gutter py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
          The Film Vault
        </span>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary mt-2">
          Motion Pictures & College Reels
        </h1>
        <p className="font-handwriting text-2xl text-on-surface-variant mt-1">
          Captured on cameras, camcorders, and phones through the years.
        </p>
      </div>

      {/* Video Grid */}
      {videoMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoMemories.map((mem) => {
            const thumb = formatMediaUrl(mem.media?.thumbnail || mem.media?.url);
            const chapterTitle = typeof mem.chapter === 'object' ? mem.chapter?.title : 'College Memory';

            return (
              <div
                key={mem._id}
                onClick={() => setActiveVideo(mem)}
                className="film-frame cursor-pointer group hover:shadow-2xl transition-all duration-300"
              >
                <div className="film-perforations-top" />

                <div className="relative aspect-video w-full overflow-hidden bg-black/80 rounded my-3">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <Film className="w-12 h-12" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  {mem.emoji && (
                    <span className="absolute top-2 right-2 text-xl drop-shadow">{mem.emoji}</span>
                  )}
                </div>

                <div className="film-perforations-bottom" />

                {/* Details under film frame */}
                <div className="px-1 text-white mt-1">
                  <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                    <span className="uppercase tracking-wider font-semibold text-tertiary-fixed">
                      {chapterTitle}
                    </span>
                    {mem.memoryDate && <span>{mem.memoryDate}</span>}
                  </div>

                  <h3 className="font-headline font-bold text-base text-white truncate">
                    {mem.title}
                  </h3>

                  {mem.caption && (
                    <p className="font-handwriting text-white/80 text-lg truncate">
                      “{mem.caption}”
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-outline-variant p-8 max-w-lg mx-auto">
          <p className="text-4xl mb-2">🎬</p>
          <h3 className="font-headline text-xl font-bold text-primary mb-1">No Videos in the Vault Yet</h3>
          <p className="text-sm text-on-surface-variant font-body">
            Videos uploaded by the administrator will be preserved here in motion reels.
          </p>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.media?.url}
          title={activeVideo.title}
          caption={activeVideo.caption}
        />
      )}
    </div>
  );
};
