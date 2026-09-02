import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Opening the memory box...' }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">✨</span>
      </div>
      <p className="font-handwriting text-2xl text-primary font-bold animate-pulse">
        {message}
      </p>
    </div>
  );
};
