import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../../data/content';
import { motionConfig } from '../../config/motion';
import { Highlight } from '../ui/Highlight';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { SectionHead } from './SectionHead';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const { process: p } = content;
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);
  const total = p.steps.length;

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    const mm = gsap.matchMedia();
    mm.add(
      { wide: '(min-width: 981px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { wide, reduce } = ctx.conditions as { wide: boolean; reduce: boolean };
        if (reduce) {
          gsap.set(fill, { scale: 1 });
          setLit(total);
          return;
        }
        // linha horizontal no desktop, vertical no mobile
        gsap.set(fill, wide ? { scaleX: 0, scaleY: 1, transformOrigin: '0% 50%' } : { scaleY: 0, scaleX: 1, transformOrigin: '50% 0%' });
        gsap.to(fill, {
          ...(wide ? { scaleX: 1 } : { scaleY: 1 }),
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: motionConfig.processScrub.smooth,
            onUpdate: (self) => {
              // cada etapa acende quando a linha chega até ela
              let count = 0;
              for (let i = 0; i < total; i++) if (self.progress >= i / total + 0.03) count = i + 1;
              setLit(count);
            },
          },
        });
      },
    );
    return () => mm.revert();
  }, [total]);

  return (
    <section className={styles.process} id="processo" aria-labelledby="processo-title">
      <SectionHead
        dark
        eyebrow={p.eyebrow}
        titleId="processo-title"
        title={
          <>
            {p.titleBefore}
            <Highlight light>{p.titleHighlight}</Highlight>
          </>
        }
        subtitle={p.subtitle}
      />

      <div className={styles.wrap}>
        <div className={styles.track} aria-hidden="true">
          <div ref={fillRef} className={styles.fill} />
        </div>
        <ol ref={listRef} className={styles.steps} aria-label={p.progressLabel}>
          {p.steps.map((step, i) => (
            <li key={step.title} className={`${styles.item} ${i < lit ? styles.lit : ''}`}>
              <span className={styles.node} aria-hidden="true" />
              <Reveal index={i}>
                <TiltCard className={styles.step}>
                  <span className={styles.n} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
