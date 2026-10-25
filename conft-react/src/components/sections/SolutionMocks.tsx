import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { motionConfig } from '../../config/motion';
import type { ChecklistItem } from '../../data/content';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './SolutionMocks.module.css';

const BARS = [35, 55, 42, 70, 58, 88, 76];
const HIGHLIGHT = 5;
const SPARK_POINTS = '0,50 25,42 50,46 75,30 100,34 125,18 150,24 175,8 200,12';

interface DashboardMockProps {
  kpis: { label: string; value: string }[];
}

/** Barras crescem quando o mockup entra na tela. */
export function DashboardMock({ kpis }: DashboardMockProps) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const show = reduced || inView;

  return (
    <div ref={ref} className={styles.mock} aria-hidden="true">
      <div className={styles.bar}>
        <i />
        <i />
        <i />
      </div>
      <div className={styles.kpis}>
        {kpis.map((k) => (
          <div key={k.label}>
            <small>{k.label}</small>
            <b>{k.value}</b>
          </div>
        ))}
      </div>
      <div className={styles.chart}>
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={i === HIGHLIGHT ? styles.hi : undefined}
            initial={{ height: reduced ? `${h}%` : 0 }}
            animate={{ height: show ? `${h}%` : 0 }}
            transition={{ duration: 1, delay: i * 0.07, ease: motionConfig.reveal.ease }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChecklistProps {
  items: ChecklistItem[];
}

/** Itens marcados em sequência. */
export function Checklist({ items }: ChecklistProps) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLUListElement>({ threshold: 0.4 });
  const [checked, setChecked] = useState(0);
  const total = items.filter((i) => i.done).length;

  useEffect(() => {
    if (reduced) {
      setChecked(total);
      return;
    }
    if (!inView) return;
    const timers = Array.from({ length: total }, (_, i) => window.setTimeout(() => setChecked(i + 1), 500 + i * 650));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduced, total]);

  let doneSeen = 0;
  return (
    <ul ref={ref} className={styles.checks} aria-hidden="true">
      {items.map((item) => {
        const order = item.done ? ++doneSeen : 0;
        const on = item.done && checked >= order;
        return (
          <li key={item.label}>
            <motion.span
              className={`${styles.box} ${on ? styles.on : ''}`}
              animate={on && !reduced ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
            />
            <span className={on ? styles.doneText : undefined}>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Linha do gráfico se desenha ao entrar na tela. */
export function Sparkline() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const show = reduced || inView;

  return (
    <div ref={ref} className={styles.spark} aria-hidden="true">
      <svg viewBox="0 0 200 60" preserveAspectRatio="none">
        <motion.polyline
          points={SPARK_POINTS}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration: 1.8, ease: motionConfig.reveal.ease }}
        />
      </svg>
    </div>
  );
}
