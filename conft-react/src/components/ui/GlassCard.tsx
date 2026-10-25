import type { ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import { useMouseMotion } from '../../hooks/useMouse';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
  /** deslocamento máximo do parallax em px (cada card usa um valor) */
  depth: number;
  /** atraso da flutuação em segundos */
  floatDelay?: number;
  /** deslocamento vertical (px) vindo do scroll; cada card usa um ritmo */
  scrollY?: MotionValue<number>;
}

/** Card de vidro que flutua e se desloca em profundidade conforme o cursor. */
export function GlassCard({ children, className = '', ariaLabel, depth, floatDelay = 0, scrollY }: GlassCardProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { x, y } = useMouseMotion(motionConfig.glassParallax.spring);
  const idle = useMotionValue(0);
  const tx = useTransform(x, (v) => v * -depth);
  // soma o parallax do cursor com o deslocamento causado pelo scroll
  const ty = useTransform([y, scrollY ?? idle], ([my, sy]: number[]) => my * -depth * 0.6 + sy);
  const parallax = fine && !reduced;

  return (
    <motion.aside
      className={`${styles.wrap} ${className}`}
      aria-label={ariaLabel}
      style={reduced ? undefined : { x: parallax ? tx : 0, y: ty }}
    >
      <div className={styles.glass} style={{ animationDelay: `${floatDelay}s` }}>
        {children}
      </div>
    </motion.aside>
  );
}
