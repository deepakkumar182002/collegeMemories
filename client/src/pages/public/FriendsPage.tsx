import React from 'react';
import { useFriends } from '../../hooks/useData';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatMediaUrl } from '../../lib/utils';
import { Instagram, Linkedin, Twitter, Github, Sparkles, Award } from 'lucide-react';
import { Tape } from '../../components/common/Tape';

export const FriendsPage: React.FC = () => {
  const { data: friends = [], isLoading } = useFriends();

  if (isLoading) {
    return <LoadingSpinner message="Locating your batchmates & ID cards..." />;
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-gutter py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
          The Hall of Legends
        </span>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary mt-2">
          The People Who Made It Unforgettable
        </h1>
        <p className="font-handwriting text-2xl text-on-surface-variant mt-1">
          Every group had its legends, rebels, proxy masters, and canteen philosophers.
        </p>
      </div>

      {/* College ID Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {friends.map((friend) => {
          const photoUrl = formatMediaUrl(friend.profileImage);

          return (
            <div
              key={friend._id}
              className="college-id-card relative flex flex-col justify-between border-2 border-[#e2bfb9]/60 shadow-lg bg-white"
            >
              {/* Lanyard Hole Visual */}
              <div className="w-8 h-2 bg-slate-300 rounded-full mx-auto my-2 border border-slate-400 shadow-inner" />

              {/* ID Card Navy Header */}
              <div className="bg-[#131b30] text-white px-5 py-3 border-b-2 border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-tertiary-fixed">
                      COLLEGE STUDENT ID
                    </span>
                    <h3 className="font-headline font-bold text-lg text-white leading-tight">
                      {friend.name}
                    </h3>
                  </div>
                  <span className="text-2xl">{friend.emoji || '🎓'}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  {/* Photo & Titles */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-surface-container-high border-2 border-outline-variant/50 shrink-0 shadow-sm relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-primary bg-primary-fixed">
                          {friend.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      {friend.nickname && (
                        <span className="inline-block bg-primary-fixed text-primary px-2 py-0.5 rounded text-xs font-bold font-montserrat mb-1">
                          {friend.nickname}
                        </span>
                      )}

                      <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wide">
                        {friend.funTitle || 'Honorary Batch Legend'}
                      </h4>

                      <p className="text-[11px] text-on-surface-variant font-medium mt-1">
                        {friend.batch || 'Class of 2024'}
                      </p>
                    </div>
                  </div>

                  {/* Short description / Bio */}
                  {friend.shortDescription && (
                    <p className="text-xs text-on-surface/85 leading-relaxed mb-3 font-body">
                      {friend.shortDescription}
                    </p>
                  )}

                  {/* Favorite Memory Quote */}
                  {friend.favoriteMemory && (
                    <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 mb-4">
                      <span className="text-[10px] font-montserrat font-bold uppercase text-primary block mb-0.5">
                        Favorite Memory:
                      </span>
                      <p className="font-handwriting text-lg text-on-surface-variant leading-snug">
                        “{friend.favoriteMemory}”
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Links & Barcode Decorative Footer */}
                <div className="pt-3 border-t border-dashed border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {friend.socialLinks?.instagram && (
                      <a
                        href={friend.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {friend.socialLinks?.linkedin && (
                      <a
                        href={friend.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {friend.socialLinks?.github && (
                      <a
                        href={friend.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Faux Barcode */}
                  <div className="flex items-center gap-0.5 opacity-60">
                    <div className="w-0.5 h-6 bg-black" />
                    <div className="w-1 h-6 bg-black" />
                    <div className="w-0.5 h-6 bg-black" />
                    <div className="w-1.5 h-6 bg-black" />
                    <div className="w-0.5 h-6 bg-black" />
                    <div className="w-1 h-6 bg-black" />
                    <div className="w-0.5 h-6 bg-black" />
                    <div className="w-1.5 h-6 bg-black" />
                    <div className="w-0.5 h-6 bg-black" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
