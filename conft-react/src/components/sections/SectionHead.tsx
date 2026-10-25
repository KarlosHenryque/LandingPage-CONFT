import type { ReactNode } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';
import styles from './SectionHead.module.css';

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  dark?: boolean;
  /** id do h2, para aria-labelledby da seção */
  titleId?: string;
}

export function SectionHead({ eyebrow, title, subtitle, dark, titleId }: SectionHeadProps) {
  return (
    <Reveal className={`${styles.head} ${dark ? styles.dark : ''}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 id={titleId}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}
