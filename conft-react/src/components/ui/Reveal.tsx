import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** posição entre irmãos: define o atraso do stagger */
  index?: number;
  /** atraso extra em segundos */
  delay?: number;
}

/** Fade + subida quando o elemento entra na viewport. */
export function Reveal({ children, className, index = 0, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const { distance, duration, stagger, staggerCycle, ease, viewportAmount } = motionConfig.reveal;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: viewportAmount, margin: '0px 0px -40px 0px' }}
      transition={{ duration, ease, delay: delay + (index % staggerCycle) * stagger }}
    >
      {children}
    </motion.div>
  );
}
