import { content } from '../../data/content';
import { LogoMark } from '../ui/LogoMark';
import styles from './Footer.module.css';

export function Footer() {
  const { brand, footer } = content;

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <a href="#topo" className={styles.brand} aria-label={brand.ariaTop}>
          <LogoMark className={styles.mark} />
          <span className={styles.word}>{brand.name}</span>
        </a>
        <span className={styles.copy}>© {new Date().getFullYear()} {brand.name}. {footer.rights}</span>
      </div>
    </footer>
  );
}
