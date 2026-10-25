import { useRef } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './TiltCard.module.css';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** texto exibido no cursor customizado ao passar por cima */
  cursorLabel?: string;
}

/** Inclinação 3D seguindo o cursor + reflexo (glare) + spotlight. Desligado em touch e reduced motion. */
export function TiltCard({ children, className = '', cursorLabel }: TiltCardProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const scale = useMotionValue(1);
  const { spring, maxDeg, perspective, scale: hoverScale, glareOpacity, spotlightOpacity } = motionConfig.tilt;
  const srx = useSpring(rx, spring);
  const sry = useSpring(ry, spring);
  const sscale = useSpring(scale, spring);

  if (!fine || reduced) {
    return (
      <div className={`${styles.tilt} ${className}`} data-cursor={cursorLabel}>
        {children}
      </div>
    );
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * maxDeg);
    rx.set(-(py - 0.5) * 2 * maxDeg);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };
  const onEnter = () => {
    scale.set(hoverScale);
    ref.current?.style.setProperty('--o', '1');
  };
  const onLeave = () => {
    scale.set(1);
    rx.set(0);
    ry.set(0);
    ref.current?.style.setProperty('--o', '0');
  };

  const vars = { '--glare': glareOpacity, '--spot': spotlightOpacity } as CSSProperties;

  return (
    <motion.div
      ref={ref}
      className={`${styles.tilt} ${className}`}
      data-cursor={cursorLabel}
      style={{ ...vars, rotateX: srx, rotateY: sry, scale: sscale, transformPerspective: perspective }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
      <span className={styles.fx} aria-hidden="true" />
    </motion.div>
  );
}
