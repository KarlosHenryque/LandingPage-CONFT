import { motion } from 'framer-motion';
import { content } from '../../data/content';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  id: string;
  active: string | null;
  onNavigate: () => void;
}

export function MobileMenu({ id, active, onNavigate }: MobileMenuProps) {
  const { nav } = content;
  return (
    <motion.nav
      id={id}
      className={styles.menu}
      aria-label={nav.ariaLabel}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      {nav.items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={onNavigate}
          className={active === item.id ? styles.active : undefined}
          aria-current={active === item.id ? 'location' : undefined}
        >
          {item.label}
        </a>
      ))}
      <a href="#contato" className={styles.cta} onClick={onNavigate}>
        {nav.mobileCta}
      </a>
    </motion.nav>
  );
}
