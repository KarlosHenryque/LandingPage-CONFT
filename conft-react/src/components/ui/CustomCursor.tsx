import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motionConfig } from '../../config/motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './CustomCursor.module.css';

const INTERACTIVE = 'a, button, summary, label, select, input, textarea, [role="button"]';

/** Ponto + anel com atraso suave. Só em desktop e sem reduced motion. Estado via data-attributes, sem re-render. */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!enabled || !dot || !ring || !label) return;

    document.body.classList.add('has-custom-cursor');
    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    let shown = false;
    let raf = 0;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        rx = tx;
        ry = ty;
        dot.dataset.visible = 'true';
        ring.dataset.visible = 'true';
      }
      place(dot, tx, ty);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled?.dataset.cursor) {
        label.textContent = labelled.dataset.cursor;
        ring.dataset.state = 'label';
      } else if (target?.closest(INTERACTIVE)) {
        label.textContent = '';
        ring.dataset.state = 'hover';
      } else {
        label.textContent = '';
        ring.dataset.state = 'idle';
      }
    };

    const onDown = () => {
      ring.dataset.pressed = 'true';
    };
    const onUp = () => {
      ring.dataset.pressed = 'false';
    };
    const onLeaveWindow = () => {
      dot.dataset.visible = 'false';
      ring.dataset.visible = 'false';
      shown = false;
    };

    const tick = () => {
      rx += (tx - rx) * motionConfig.cursor.lag;
      ry += (ty - ry) * motionConfig.cursor.lag;
      place(ring, rx, ry);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  const { dot, ring, ringHover, ringLabel } = motionConfig.cursor;
  const vars = {
    '--dot': `${dot}px`,
    '--ring': `${ring}px`,
    '--ring-hover': `${ringHover}px`,
    '--ring-label': `${ringLabel}px`,
  } as CSSProperties;

  return (
    <div style={vars} aria-hidden="true">
      <div ref={ringRef} className={styles.ring} data-state="idle" data-visible="false">
        <div className={styles.ringInner}>
          <span ref={labelRef} className={styles.label} />
        </div>
      </div>
      <div ref={dotRef} className={styles.dot} data-visible="false" />
    </div>
  );
}
