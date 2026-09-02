import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '../lib/gsap';

export function useLenis() {
  useEffect(() => {
    // Only on client side
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Integrate with GSAP ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    const handleRaf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(handleRaf);
    };

    const animId = requestAnimationFrame(handleRaf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);
}
