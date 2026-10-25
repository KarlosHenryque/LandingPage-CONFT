import { content } from '../../data/content';
import styles from './SegmentsMarquee.module.css';

export function SegmentsMarquee() {
  const { segments } = content;
  return (
    <section className={styles.strip} aria-label={segments.label}>
      <p className={styles.label}>{segments.label}</p>
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {segments.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {/* cópia para o loop contínuo; fica fora da árvore de acessibilidade */}
          {segments.items.map((item) => (
            <li key={`${item}-dup`} className={styles.dup} aria-hidden="true">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
