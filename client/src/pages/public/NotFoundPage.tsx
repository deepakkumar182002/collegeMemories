import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Tape } from '../../components/common/Tape';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-outline-variant/40 relative">
        <Tape className="-top-4 left-1/2 -translate-x-1/2 w-28 h-6 opacity-70" rotation={1} />
        
        <div className="text-6xl mb-3 select-none">🗺️</div>
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="font-headline text-lg font-bold text-on-surface mb-2">Page Left The Campus</h2>
        <p className="font-handwriting text-2xl text-on-surface-variant mb-6">
          Looks like this memory was misplaced or moved to another chapter!
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-montserrat text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <Home className="w-4 h-4" />
          Back to Storybook
        </Link>
      </div>
    </div>
  );
};
