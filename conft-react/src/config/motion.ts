/* Intensidade de todas as animações num só lugar. Valores menores = efeito mais sutil. */

export const motionConfig = {
  /** Entrada dos elementos ao rolar */
  reveal: {
    distance: 26, // px de subida
    duration: 0.8, // s
    stagger: 0.08, // s entre irmãos
    staggerCycle: 4, // reinicia o atraso a cada N itens
    ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
    viewportAmount: 0.18,
  },

  /** TiltCard: inclinação 3D, reflexo e spotlight */
  tilt: {
    maxDeg: 8, // inclinação máxima
    perspective: 900, // px
    scale: 1.02,
    glareOpacity: 0.16,
    spotlightOpacity: 0.16,
    spring: { stiffness: 220, damping: 20, mass: 0.5 },
  },

  /** MagneticButton */
  magnetic: {
    strength: 0.35, // 0 = parado, 1 = cola no cursor
    maxOffset: 14, // px
    spring: { stiffness: 260, damping: 14, mass: 0.4 },
  },

  /** Cursor customizado */
  cursor: {
    dot: 6, // px
    ring: 34, // px
    ringHover: 58,
    ringLabel: 76,
    lag: 0.16, // 0–1: menor = anel mais atrasado
  },

  /** Parallax dos cards de vidro do hero (px de deslocamento máximo) */
  glassParallax: {
    left: 26,
    right: 44,
    spring: { stiffness: 90, damping: 18, mass: 0.6 },
  },

  /** Globo 3D */
  globe: {
    rings: 9,
    idleSpeed: 1, // multiplicador da rotação lenta
    boostOnMove: 2.2, // aceleração máxima ao mover o mouse
    tiltX: 0.22, // rad, inclinação vertical máxima
    tiltY: 0.38, // rad, inclinação horizontal máxima
    damping: 2.6, // maior = segue mais rápido
    bloom: { intensity: 0.7, threshold: 0.12, smoothing: 0.4 },
    dpr: [1, 2] as [number, number],
  },

  /** Partículas */
  particles: {
    desktop: 700,
    mobile: 220,
    layers: [0.12, 0.3, 0.6], // intensidade do parallax por camada (fundo → frente)
    parallax: 0.55, // unidades do mundo
  },

  /** Logo 3D */
  logo: {
    followY: 0.65, // rad
    followX: 0.4, // rad
    damping: 3.2,
    depth: 0.28,
    idleSway: 0.18, // balanço automático quando não há cursor
  },

  /** Reação ao scroll */
  scroll: {
    starsShift: 1.3, // quanto as camadas de estrelas se separam ao rolar (profundidade)
    starsWarp: 0.045, // esticamento vertical das estrelas conforme a velocidade
    starsWarpMax: 0.9,
    globeSink: 0.35, // quanto o globo desce ao rolar (fração da altura da viewport)
    globeSpinBoost: 0.18, // aceleração do globo por velocidade de scroll
    globeSpinMax: 4,
    heroContentLift: 90, // px que o texto do hero sobe ao rolar
    heroFade: 0.55, // opacidade mínima do texto do hero ao sair
    logoSpin: 0.0045, // rad por px rolado: o logo gira ao rolar
    logoBob: 0.14, // balanço vertical do logo (unidades do mundo)
    logoPulse: 0.012, // aumento de escala por velocidade
  },

  /** Wordmark gigante do footer */
  footerGlow: {
    radius: 280, // px
    opacity: 0.95,
  },

  /** Contadores */
  counter: { duration: 1.6 },

  /** Linha de progresso do processo (GSAP scrub) */
  processScrub: { smooth: 0.6 },

  /** Scroll suave (Lenis) */
  lenis: { lerp: 0.1 },
} as const;
