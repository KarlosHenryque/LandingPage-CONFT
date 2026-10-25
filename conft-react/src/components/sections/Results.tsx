import { content } from '../../data/content';
import { Counter } from '../ui/Counter';
import { Highlight } from '../ui/Highlight';
import { Reveal } from '../ui/Reveal';
import { SectionHead } from './SectionHead';
import styles from './Results.module.css';

export function Results() {
  const { results } = content;
  return (
    <section className={styles.results} id="resultados" aria-labelledby="resultados-title">
      <SectionHead
        eyebrow={results.eyebrow}
        titleId="resultados-title"
        title={
          <>
            {results.titleBefore}
            <Highlight>{results.titleHighlight}</Highlight>
          </>
        }
      />

      <ul className={styles.stats}>
        {results.stats.map((stat, i) => (
          <li key={stat.label}>
            <Reveal index={i} className={styles.stat}>
              <b>
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </b>
              <p>{stat.label}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className={styles.note}>{results.note}</p>
    </section>
  );
}
