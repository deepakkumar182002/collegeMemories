import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Memory } from '../types';

interface LightboxContextType {
  activeMemory: Memory | null;
  memoriesList: Memory[];
  openLightbox: (memory: Memory, list?: Memory[]) => void;
  closeLightbox: () => void;
  nextMemory: () => void;
  prevMemory: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export const LightboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [memoriesList, setMemoriesList] = useState<Memory[]>([]);

  const openLightbox = (memory: Memory, list: Memory[] = []) => {
    setActiveMemory(memory);
    setMemoriesList(list.length > 0 ? list : [memory]);
  };

  const closeLightbox = () => {
    setActiveMemory(null);
  };

  const nextMemory = useCallback(() => {
    if (!activeMemory || memoriesList.length <= 1) return;
    const currentIndex = memoriesList.findIndex((m) => m._id === activeMemory._id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % memoriesList.length;
      setActiveMemory(memoriesList[nextIndex]);
    }
  }, [activeMemory, memoriesList]);

  const prevMemory = useCallback(() => {
    if (!activeMemory || memoriesList.length <= 1) return;
    const currentIndex = memoriesList.findIndex((m) => m._id === activeMemory._id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + memoriesList.length) % memoriesList.length;
      setActiveMemory(memoriesList[prevIndex]);
    }
  }, [activeMemory, memoriesList]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMemory) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMemory();
      if (e.key === 'ArrowLeft') prevMemory();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMemory, nextMemory, prevMemory]);

  return (
    <LightboxContext.Provider
      value={{
        activeMemory,
        memoriesList,
        openLightbox,
        closeLightbox,
        nextMemory,
        prevMemory,
      }}
    >
      {children}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return context;
};
