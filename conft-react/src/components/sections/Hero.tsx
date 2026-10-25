import { lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { content } from '../../data/content';
import { motionConfig } from '../../config/motion';
import { useInView } from '../../hooks/useInView';
import { useFinePointer, useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlobeFallback } from '../three/GlobeFallback';
import { SafeScene, useIdleReady } from '../three/SafeScene';
import { Button } from '../ui/Button';
import { Counter } from '../ui/Counter';
import { Eyebrow } from '../ui/Eyebrow';
import { GlassCard } from '../ui/GlassCard';
import { MagneticButton } from '../ui/MagneticButton';
import { Reveal } from '../ui/Reveal';
import styles from './Hero.module.css';

const GlobeScene = lazy(() => import('../three/GlobeScene'));

export function Hero() {
  const { hero } = content;
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const narrow = useMediaQuery('(max-width: 860px)');
  const idle = useIdleReady();
  // pausa o render do 3D quando o hero sai da tela
  const [ref, inView] = useInView<HTMLElement>({ once: false, threshold: 0, rootMargin: '120px 0px' });

  // elementos do hero se movem em ritmos diferentes ao rolar (profundidade)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sc = motionConfig.scroll;
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -sc.heroContentLift]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, sc.heroFade]);
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className={styles.shell}>
      <section ref={ref} className={styles.hero} id="topo" aria-labelledby="hero-title">
        <div className={styles.canvas} role="img" aria-label={hero.globeLabel}>
          <SafeScene ready={idle} fallback={<GlobeFallback />}>
            <GlobeScene active={inView} interactive={fine && !reduced} reducedMotion={reduced} lowPower={narrow || !fine} />
          </SafeScene>
        </div>

        <motion.div className={styles.content} style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}>
          <Reveal index={0}>
            <Eyebrow dark>{hero.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal index={1}>
            <h1 id="hero-title" className={styles.title}>
              {hero.titleLines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className={styles.sub}>{hero.subtitle}</p>
          </Reveal>
          <Reveal index={3} className={styles.cta}>
            <MagneticButton>
              <Button href="#contato" variant="white">
                {hero.primaryCta}
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button href="#solucoes" variant="outline">
                {hero.secondaryCta}
              </Button>
            </MagneticButton>
          </Reveal>
        </motion.div>

        <GlassCard
          className={styles.left}
          ariaLabel={hero.left.top}
          depth={motionConfig.glassParallax.left}
          scrollY={leftY}
        >
          <div className={styles.top}>
            <span>{hero.left.top}</span>
            <a href="#solucoes" className={styles.arrow} aria-label={hero.left.arrowLabel}>
              ↗
            </a>
          </div>
          <strong className={styles.strong}>
            {hero.left.title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </strong>
          <small className={styles.small}>{hero.left.footnote}</small>
        </GlassCard>

        <GlassCard
          className={styles.right}
          ariaLabel={hero.right.top}
          depth={motionConfig.glassParallax.right}
          floatDelay={-3}
          scrollY={rightY}
        >
          <div className={styles.top}>
            <span>{hero.right.top}</span>
            <a href="#resultados" className={styles.arrow} aria-label={hero.right.arrowLabel}>
              ↗
            </a>
          </div>
          <div className={styles.big}>
            <Counter value={hero.right.value} suffix={hero.right.suffix} />
          </div>
          <div className={styles.bar} aria-hidden="true">
            <motion.span
              initial={{ width: reduced ? '78%' : 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1.6, delay: 0.7, ease: motionConfig.reveal.ease }}
            />
          </div>
          <small className={styles.small}>{hero.right.footnote}</small>
        </GlassCard>
      </section>
    </div>
  );
}
