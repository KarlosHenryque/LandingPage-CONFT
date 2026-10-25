import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../../data/content';
import { motionConfig } from '../../config/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Reveal } from '../ui/Reveal';
import { SectionHead } from './SectionHead';
import styles from './Faq.module.css';

export function Faq() {
  const { faq } = content;
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-title">
      <SectionHead eyebrow={faq.eyebrow} titleId="faq-title" title={faq.title} />

      <Reveal className={styles.list}>
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.question} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  className={styles.q}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={styles.panel}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.4, ease: motionConfig.reveal.ease }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
