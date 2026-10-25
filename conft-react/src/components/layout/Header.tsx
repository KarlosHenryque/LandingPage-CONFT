import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { content } from '../../data/content';
import { useActiveSection } from '../../hooks/useActiveSection';
import { Button } from '../ui/Button';
import { MagneticButton } from '../ui/MagneticButton';
import { LogoMark } from '../ui/LogoMark';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

export function Header() {
  const { brand, nav } = content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(nav.items.map((i) => i.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.bar}>
        <a href="#topo" className={styles.brand} aria-label={brand.ariaHome}>
          <LogoMark className={styles.mark} />
          <span className={styles.word}>{brand.name}</span>
        </a>

        <nav className={styles.nav} aria-label={nav.ariaLabel}>
          {nav.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? styles.active : undefined}
              aria-current={active === item.id ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="#contato" variant="ghost" size="sm">
            {nav.contact}
          </Button>
          <MagneticButton>
            <Button href="#contato" size="sm">
              {nav.proposal}
            </Button>
          </MagneticButton>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? nav.closeMenu : nav.openMenu}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && <MobileMenu id="menu-mobile" active={active} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
