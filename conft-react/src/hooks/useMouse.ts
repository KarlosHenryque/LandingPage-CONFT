import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

/**
 * Posição do cursor compartilhada por toda a página.
 * Um único listener alimenta DOM, Framer Motion e o 3D, sem re-render do React.
 */
export interface MouseState {
  /** -1 (esquerda) … 1 (direita) */
  x: number;
  /** -1 (topo) … 1 (base) */
  y: number;
  /** posição em pixels da viewport */
  px: number;
  py: number;
  /** instante (ms) do último movimento */
  t: number;
}

export const mouse: MouseState = { x: 0, y: 0, px: 0, py: 0, t: 0 };

type Listener = (m: MouseState) => void;
const listeners = new Set<Listener>();
let installed = false;

function install(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouse.px = e.clientX;
      mouse.py = e.clientY;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.t = performance.now();
      listeners.forEach((l) => l(mouse));
    },
    { passive: true },
  );
}

/** Garante o listener global e devolve o objeto mutável (leia dentro de useFrame/rAF). */
export function useMouse(): MouseState {
  useEffect(install, []);
  return mouse;
}

export function subscribeMouse(listener: Listener): () => void {
  install();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Cursor normalizado (-1…1) como MotionValues suavizados por mola. */
export function useMouseMotion(spring: { stiffness: number; damping: number; mass: number }): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const ref = useRef({ rawX, rawY });

  useEffect(
    () =>
      subscribeMouse((m) => {
        ref.current.rawX.set(m.x);
        ref.current.rawY.set(m.y);
      }),
    [],
  );

  return { x, y };
}
