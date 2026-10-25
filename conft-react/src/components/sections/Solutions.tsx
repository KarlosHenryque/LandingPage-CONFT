import { content } from '../../data/content';
import { Highlight } from '../ui/Highlight';
import { LogoMark } from '../ui/LogoMark';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { SectionHead } from './SectionHead';
import { Checklist, DashboardMock, Sparkline } from './SolutionMocks';
import styles from './Solutions.module.css';

export function Solutions() {
  const { solutions: s } = content;
  const label = s.cursorLabel;

  return (
    <section className={styles.solutions} id="solucoes" aria-labelledby="solucoes-title">
      <SectionHead
        eyebrow={s.eyebrow}
        titleId="solucoes-title"
        title={
          <>
            {s.titleBefore}
            <Highlight>{s.titleHighlight}</Highlight>
          </>
        }
        subtitle={s.subtitle}
      />

      <div className={styles.bento}>
        <Reveal className={styles.wide} index={0}>
          <TiltCard className={`${styles.card} ${styles.lg}`} cursorLabel={label}>
            <div>
              <h3>{s.custom.title}</h3>
              <p>{s.custom.text}</p>
              <a href="#contato" className={styles.link}>
                {s.custom.link}
              </a>
            </div>
            <DashboardMock kpis={s.custom.kpis} />
          </TiltCard>
        </Reveal>

        <Reveal index={1}>
          <TiltCard className={styles.card} cursorLabel={label}>
            <h3>{s.automation.title}</h3>
            <p>{s.automation.text}</p>
            <Checklist items={s.automation.items} />
          </TiltCard>
        </Reveal>

        <Reveal index={2}>
          <TiltCard className={styles.card} cursorLabel={label}>
            <h3>{s.dashboards.title}</h3>
            <p>{s.dashboards.text}</p>
            <Sparkline />
          </TiltCard>
        </Reveal>

        <Reveal index={3}>
          <TiltCard className={styles.card} cursorLabel={label}>
            <h3>{s.integrations.title}</h3>
            <p>{s.integrations.text}</p>
            <ul className={styles.chips}>
              {s.integrations.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </TiltCard>
        </Reveal>

        <Reveal index={4}>
          <TiltCard className={`${styles.card} ${styles.accent}`} cursorLabel={label}>
            <h3>{s.scalable.title}</h3>
            <p>{s.scalable.text}</p>
            <LogoMark className={styles.cardLogo} />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
