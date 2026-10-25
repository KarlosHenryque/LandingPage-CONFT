import type { ReactNode } from 'react';
import styles from './Highlight.module.css';

interface HighlightProps {
  children: ReactNode;
  /** versão clara, para fundos escuros */
  light?: boolean;
}

/** Trecho de título com o degradê da marca. */
export function Highlight({ children, light }: HighlightProps) {
  return <span className={`${styles.grad} ${light ? styles.light : ''}`}>{children}</span>;
}
