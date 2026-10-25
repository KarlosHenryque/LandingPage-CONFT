import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motionConfig } from '../../config/motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './CustomCursor.module.css';

/** Cor de fundo opaca mais próxima do ponto, subindo pelos ancestrais. */
function backgroundAt(x: number, y: number): [number, number, number] {
  let el: Element | null = document.elementFromPoint(x, y);
  while (el) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (m && (m.length < 4 || Number(m[3]) > 0.5)) return [Number(m[0]), Number(m[1]), Number(m[2])];
    el = el.parentElement;
  }
  return [248, 250, 252];
}

/** Ponto único: branco sobre fundo escuro/azul, azul sobre fundo claro. Só em desktop e sem reduced motion. */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!enabled || !dot) return;

    document.body.classList.add('has-custom-cursor');
    let x = 0;
    let y = 0;
    let raf = 0;

    const update = () => {
      raf = 0;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const [r, g, b] = backgroundAt(x, y);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      dot.dataset.tone = luminance < 0.6 ? 'light' : 'dark';
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.dataset.visible = 'true';
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeaveWindow = () => {
      dot.dataset.visible = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  const vars = { '--dot': `${motionConfig.cursor.dot}px` } as CSSProperties;

  return <div ref={dotRef} className={styles.dot} style={vars} data-visible="false" data-tone="dark" aria-hidden="true" />;
}
