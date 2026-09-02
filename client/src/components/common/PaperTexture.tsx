import React from 'react';

export const PaperTexture: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full z-[-1] paper-texture pointer-events-none opacity-40"
      aria-hidden="true"
    />
  );
};
