import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionConfig } from '../config/motion';
import { useReducedMotion } from './useReducedMotion';

/** Scroll suave (Lenis) sincronizado com o ScrollTrigger. Desligado com reduced motion. */
export function useSmoothScroll(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: motionConfig.lenis.lerp,
      anchors: { offset: -80 },
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);
}
