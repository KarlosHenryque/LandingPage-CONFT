import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  dark?: boolean;
}

export function Eyebrow({ children, dark }: EyebrowProps) {
  return <span className={`${styles.eyebrow} ${dark ? styles.dark : ''}`}>{children}</span>;
}
