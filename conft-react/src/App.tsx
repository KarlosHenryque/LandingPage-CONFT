import { content } from './data/content';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useMouse } from './hooks/useMouse';
import { useScrollState } from './hooks/useScrollState';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Faq } from './components/sections/Faq';
import { Hero } from './components/sections/Hero';
import { Process } from './components/sections/Process';
import { Results } from './components/sections/Results';
import { SegmentsMarquee } from './components/sections/SegmentsMarquee';
import { Solutions } from './components/sections/Solutions';
import { CustomCursor } from './components/ui/CustomCursor';
import { LogoSprite } from './components/ui/LogoMark';

export default function App() {
  useSmoothScroll();
  useMouse();
  useScrollState();

  return (
    <>
      <LogoSprite />
      <a className="skip-link" href="#sobre">
        {content.nav.skipToContent}
      </a>
      <Header />
      <main>
        <Hero />
        <SegmentsMarquee />
        <About />
        <Solutions />
        <Process />
        <Results />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
    </>
  );
}
