import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Shield, BookOpen, Image, Video, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../hooks/useData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: settingsData } = useSiteSettings();
  const siteName = settingsData?.settings?.siteName || 'AlumniScraps';
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Chapters', href: '/#chapters', icon: BookOpen },
    { label: 'Journey', href: '/journey', icon: Sparkles },
    { label: 'Gallery', href: '/gallery', icon: Image },
    { label: 'Videos', href: '/videos', icon: Video },
    { label: 'Friends', href: '/friends', icon: Users },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <nav className="glass-dock rounded-full px-5 md:px-8 py-3 flex items-center justify-between shadow-lg">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-300">🎓</span>
              <span className="font-headline text-xl md:text-2xl font-bold italic tracking-tight text-primary">
                {siteName}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-montserrat text-sm font-semibold transition-all duration-200 relative hover:text-primary ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#memory-wall"
                className="bg-primary text-on-primary px-5 py-2 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-container transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Relive Memories
              </a>

              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="p-2 text-primary hover:bg-primary-fixed/50 rounded-full transition-colors"
                  title="Admin Dashboard"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
                  title="Archivist Login"
                >
                  <Shield className="w-4 h-4 opacity-60 hover:opacity-100" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-surface h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30">
                <span className="font-headline text-xl font-bold text-primary italic">{siteName}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-on-surface-variant hover:text-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg font-montserrat font-semibold text-base text-on-surface hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-primary" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/30 space-y-3">
              <a
                href="#memory-wall"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-montserrat text-sm font-bold text-center block"
              >
                💌 Memory Wall
              </a>

              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-surface-container-high text-on-surface py-2.5 rounded-xl font-montserrat text-xs font-semibold text-center flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-primary" />
                {isAuthenticated ? 'Admin Dashboard' : 'Archivist Login'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
