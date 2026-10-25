import { useRef } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { content } from '../../data/content';
import { motionConfig } from '../../config/motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { LogoMark } from '../ui/LogoMark';
import styles from './Footer.module.css';

export function Footer() {
  const { brand, footer } = content;
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const wordRef = useRef<HTMLDivElement>(null);
  const glow = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    el.style.setProperty('--go', String(motionConfig.footerGlow.opacity));
  };
  const onLeave = () => wordRef.current?.style.setProperty('--go', '0');

  const vars = { '--gr': `${motionConfig.footerGlow.radius}px` } as CSSProperties;

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <a href="#topo" className={styles.brand} aria-label={brand.ariaTop}>
          <LogoMark className={styles.mark} />
          <span className={styles.word}>{brand.name}</span>
        </a>
        <p>
          {footer.tagline}
          <b>{footer.taglineStrong}</b>
        </p>
        <nav aria-label={footer.navLabel}>
          {footer.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        ref={wordRef}
        className={styles.giant}
        style={vars}
        aria-hidden="true"
        onPointerMove={glow ? onMove : undefined}
        onPointerLeave={glow ? onLeave : undefined}
      >
        {footer.wordmark}
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} {brand.name}. {footer.rights}
        </span>
        <span>{footer.slogan}</span>
      </div>
    </footer>
  );
}
