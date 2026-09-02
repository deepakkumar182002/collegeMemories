import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { WebGLPaperShader } from '../common/WebGLPaperShader';
import { PaperTexture } from '../common/PaperTexture';
import { Lightbox } from '../common/Lightbox';
import { useLenis } from '../../hooks/useLenis';

export const PublicLayout: React.FC = () => {
  useLenis();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Dynamic Backgrounds */}
      <WebGLPaperShader />
      <PaperTexture />

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-grow relative z-10 w-full pt-20 md:pt-24">
        <Outlet />
      </main>

      {/* Global Scrapbook Lightbox */}
      <Lightbox />

      {/* Footer */}
      <Footer />
    </div>
  );
};
