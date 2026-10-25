import { useEffect } from 'react';
import { animate } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Número que sobe de 0 até `value` quando entra na viewport. */
export function Counter({ value, prefix = '', suffix = '', className }: CounterProps) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const final = `${prefix}${value}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduced || !el) return;
    const controls = animate(0, value, {
      duration: motionConfig.counter.duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, prefix, suffix, ref]);

  return (
    <>
      <span ref={ref} className={className} aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {reduced ? final : `${prefix}0${suffix}`}
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}
