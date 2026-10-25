import { lazy, useEffect, useState } from 'react';
import { content } from '../../data/content';
import { useInView } from '../../hooks/useInView';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SafeScene } from '../three/SafeScene';
import { Eyebrow } from '../ui/Eyebrow';
import { LogoMark } from '../ui/LogoMark';
import { Reveal } from '../ui/Reveal';
import styles from './About.module.css';

const LogoMesh = lazy(() => import('../three/LogoMesh'));

export function About() {
  const { about } = content;
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  // só carrega o 3D perto de entrar na tela e pausa quando sai
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, threshold: 0, rootMargin: '300px 0px' });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  return (
    <section className={styles.about} id="sobre" aria-labelledby="sobre-title">
      <div className={styles.scatter} aria-hidden="true">
        <div className={`${styles.tile} ${styles.a}`}>
          <LogoMark />
        </div>
        <div className={`${styles.tile} ${styles.b}`} />
        <div className={`${styles.tile} ${styles.c}`}>
          <span>{about.tiles.code}</span>
        </div>
        <div className={`${styles.tile} ${styles.d}`} />
        <div className={`${styles.tile} ${styles.e}`}>
          <span>{about.tiles.check}</span>
        </div>
        <div className={`${styles.tile} ${styles.f}`} />
      </div>

      <Reveal className={styles.text}>
        <div ref={ref} className={styles.logo3d} role="img" aria-label={about.logoLabel}>
          <SafeScene ready={seen} fallback={<LogoMark className={styles.logoFallback} />}>
            <LogoMesh active={inView} interactive={fine && !reduced} reducedMotion={reduced} />
          </SafeScene>
        </div>
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <p id="sobre-title" className={styles.statement}>
          {about.before}
          <em>{about.highlight}</em>
          {about.after}
        </p>
        <p className={styles.signature}>
          {about.signatureBefore}
          <b>{about.signatureStrong}</b>
        </p>
      </Reveal>
    </section>
  );
}
