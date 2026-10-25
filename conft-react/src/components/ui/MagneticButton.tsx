import { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './MagneticButton.module.css';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

/** Envolve um Button/link: ele é atraído pelo cursor e volta com mola. */
export function MagneticButton({ children, className }: MagneticButtonProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, motionConfig.magnetic.spring);
  const sy = useSpring(y, motionConfig.magnetic.spring);

  if (!fine || reduced) return <div className={`${styles.plain} ${className ?? ''}`}>{children}</div>;

  const { strength, maxOffset } = motionConfig.magnetic;
  const clamp = (v: number) => Math.max(-maxOffset, Math.min(maxOffset, v));

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(clamp((e.clientX - (rect.left + rect.width / 2)) * strength));
    y.set(clamp((e.clientY - (rect.top + rect.height / 2)) * strength));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`${styles.zone} ${className ?? ''}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
