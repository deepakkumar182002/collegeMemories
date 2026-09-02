import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Linkedin, Youtube, Globe, ArrowUp } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';
import { Tape } from './Tape';

export const Footer: React.FC = () => {
  const { data: settingsData } = useSiteSettings();
  const settings = settingsData?.settings;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#f5f0e6] border-t border-outline-variant/50 pt-16 pb-12 overflow-hidden text-on-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-outline-variant/30 items-start">
          
          {/* Brand & Nostalgic Stamp */}
          <div className="md:col-span-5 relative">
            <Tape className="-top-3 left-4 w-24 h-6 opacity-60" rotation={-2} />
            <div className="p-6 bg-surface rounded-xl shadow-sm border border-outline-variant/30 relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-primary italic">
                    {settings?.siteName || 'AlumniScraps'}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {settings?.collegeName || 'Class of 2020-2024 Archive'}
                  </p>
                </div>
              </div>
              <p className="font-handwriting text-xl text-on-surface-variant leading-relaxed mb-4">
                “We didn’t realize we were making memories, we just knew we were having fun.”
              </p>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant font-semibold">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Memory Archive Permanently Preserved
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Explore Chapters
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-on-surface-variant">
              <li><Link to="/#chapters" className="hover:text-primary transition-colors">Chapter Timeline</Link></li>
              <li><Link to="/journey" className="hover:text-primary transition-colors">Storybook Journey</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Polaroid Archive</Link></li>
              <li><Link to="/videos" className="hover:text-primary transition-colors">Motion Picture Vault</Link></li>
              <li><Link to="/friends" className="hover:text-primary transition-colors">Batchmate ID Cards</Link></li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="md:col-span-4">
            <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Stay Connected
            </h4>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed font-body">
              {settings?.footerText || 'Crafted with nostalgia & love for the batch. The story never really ends.'}
            </p>
            <div className="flex items-center gap-3">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant font-medium gap-4">
          <p className="flex items-center gap-1.5">
            Preserved with <Heart className="w-3.5 h-3.5 text-primary fill-primary inline" /> by the Batch Archivists
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-primary transition-colors group cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
