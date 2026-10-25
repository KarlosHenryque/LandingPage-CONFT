# CONFT — Landing page (Vite + React + TypeScript)

## Como rodar
```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # servir o build
```

## Como editar os textos
Todo o conteúdo (inclusive `aria-label`, mensagens de erro do formulário e dados de contato) está em
`src/data/content.ts`. Os componentes só renderizam esses dados.
O e-mail que recebe o formulário é `contact.emailTo`. O envio atual abre o app de e-mail (mailto);
para usar uma API, troque o corpo de `src/services/contact.ts`.

## Como ajustar as animações
Todas as intensidades ficam em `src/config/motion.ts`: entrada ao rolar, inclinação dos cards, força do
efeito magnético, cursor, parallax, velocidade e inclinação do globo, bloom, quantidade de partículas, logo 3D.

## Estrutura
- `components/ui` — Button, MagneticButton, TiltCard, GlassCard, Counter, Reveal, CustomCursor, TextField
- `components/three` — GlobeScene, Particles, LogoMesh (carregados com `React.lazy`) e fallbacks em SVG
- `components/sections` — Hero, SegmentsMarquee, About, Solutions, Process, Results, Faq, Contact
- `hooks` — useMouse (cursor compartilhado), useReducedMotion, useInView, useMediaQuery, useSmoothScroll

## Acessibilidade e performance
- `prefers-reduced-motion`: desliga tilt, efeito magnético, cursor customizado, scroll suave, rotação do 3D e marquee.
- Touch/mobile: sem cursor customizado nem tilt; o globo usa balanço automático, sem bloom e com menos partículas.
- O 3D só carrega quando o navegador fica ocioso (hero) ou perto de entrar na tela (logo), e pausa fora da viewport.
  Sem WebGL, ou se o 3D falhar, aparece um SVG estático.
- Open Graph: troque `og:image` em `index.html` por um PNG 1200×630 com URL absoluta.
