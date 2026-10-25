import { useEffect } from 'react';

/**
 * Posição e velocidade do scroll compartilhadas (lidas dentro de useFrame, sem re-render).
 * Funciona com Lenis, que dispara eventos de scroll nativos.
 */
export const scrollState = { y: 0, velocity: 0, t: 0 };

let installed = false;
let lastY = 0;
let lastT = 0;

function install(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  lastY = window.scrollY;
  lastT = performance.now();
  scrollState.y = lastY;
  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const y = window.scrollY;
      // px por ~frame (16 ms); positivo = rolando para baixo
      scrollState.velocity = ((y - lastY) / Math.max(1, now - lastT)) * 16;
      scrollState.y = y;
      scrollState.t = now;
      lastY = y;
      lastT = now;
    },
    { passive: true },
  );
}

export function useScrollState(): typeof scrollState {
  useEffect(install, []);
  return scrollState;
}

/** Velocidade do scroll que decai para 0 quando a rolagem para. */
export function scrollVelocity(): number {
  return scrollState.velocity * Math.exp(-(performance.now() - scrollState.t) / 140);
}
