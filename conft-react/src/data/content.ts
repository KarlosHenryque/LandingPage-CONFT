/* Todo o texto do site vive aqui. Edite à vontade: os componentes só renderizam. */

export interface NavItem {
  id: string;
  label: string;
}

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepItem {
  title: string;
  text: string;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface FormField {
  label: string;
  placeholder: string;
}

export interface Content {
  brand: { name: string; ariaHome: string; ariaTop: string; symbolLabel: string };
  nav: {
    ariaLabel: string;
    items: NavItem[];
    contact: string;
    proposal: string;
    mobileCta: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    globeLabel: string;
    left: { top: string; arrowLabel: string; title: string[]; footnote: string };
    right: { top: string; arrowLabel: string; value: number; suffix: string; footnote: string };
  };
  segments: { label: string; items: string[] };
  about: {
    eyebrow: string;
    before: string;
    highlight: string;
    after: string;
    signatureBefore: string;
    signatureStrong: string;
    logoLabel: string;
    tiles: { code: string; check: string };
  };
  solutions: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    cursorLabel: string;
    custom: { title: string; text: string; link: string; kpis: { label: string; value: string }[] };
    automation: { title: string; text: string; items: ChecklistItem[] };
    dashboards: { title: string; text: string };
    integrations: { title: string; text: string; chips: string[] };
    scalable: { title: string; text: string };
  };
  process: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    progressLabel: string;
    steps: StepItem[];
  };
  results: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    stats: StatItem[];
    note: string;
  };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    info: { icon: string; text: string }[];
    note: string;
    emailTo: string;
    emailSubjectPrefix: string;
    emailBody: { name: string; email: string; company: string; empty: string };
    form: {
      name: FormField;
      email: FormField;
      company: FormField;
      message: FormField;
      submit: string;
      sending: string;
      success: string;
      error: string;
      errors: { name: string; email: string; message: string };
    };
  };
  footer: {
    tagline: string;
    taglineStrong: string;
    nav: NavItem[];
    navLabel: string;
    wordmark: string;
    rights: string;
    slogan: string;
  };
}

export const content: Content = {
  brand: {
    name: 'CONFT',
    ariaHome: 'CONFT — início',
    ariaTop: 'CONFT — voltar ao topo',
    symbolLabel: 'Símbolo da CONFT',
  },

  nav: {
    ariaLabel: 'Principal',
    items: [
      { id: 'sobre', label: 'Sobre' },
      { id: 'solucoes', label: 'Soluções' },
      { id: 'processo', label: 'Processo' },
      { id: 'resultados', label: 'Resultados' },
      { id: 'faq', label: 'FAQ' },
    ],
    contact: 'Contato',
    proposal: 'Solicitar proposta',
    mobileCta: 'Falar com a CONFT',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    skipToContent: 'Ir para o conteúdo',
  },

  hero: {
    eyebrow: 'Desenvolve. Entrega. Evolui.',
    titleLines: ['Eleve a eficiência', 'do seu negócio'],
    subtitle:
      'Criamos aplicações web sob medida que transformam processos cansativos em sistemas simples e eficazes — para pequenas e grandes empresas.',
    primaryCta: 'Solicitar proposta',
    secondaryCta: 'Ver soluções',
    globeLabel: 'Globo animado em linhas azuis e roxas',
    left: {
      top: 'Abordagem',
      arrowLabel: 'Ver soluções',
      title: ['Sistemas sob medida', 'para sua rotina'],
      footnote: '100% web',
    },
    right: {
      top: 'Processos simplificados',
      arrowLabel: 'Ver resultados',
      value: 3,
      suffix: 'x',
      footnote: 'mais agilidade no dia a dia*',
    },
  },

  segments: {
    label: 'Soluções para quem quer evoluir em qualquer segmento',
    items: ['Indústria', 'Varejo', 'Logística', 'Saúde', 'Educação', 'Financeiro', 'Agro', 'Serviços'],
  },

  about: {
    eyebrow: 'Sobre a CONFT',
    before: 'Acreditamos que a tecnologia deve ',
    highlight: 'simplificar',
    after:
      ', não complicar. Por isso construímos sistemas web que acabam com planilhas, retrabalho e tarefas repetitivas — e devolvem o tempo da sua equipe para o que importa.',
    signatureBefore: 'Tecnologia que impulsiona ',
    signatureStrong: 'o seu negócio.',
    logoLabel: 'Símbolo da CONFT em 3D, que acompanha o cursor',
    tiles: { code: '</>', check: '✓' },
  },

  solutions: {
    eyebrow: 'Soluções',
    titleBefore: 'Transforme processos cansativos em ',
    titleHighlight: 'fluxos simples',
    subtitle: 'Desenvolvemos a aplicação certa para o seu cenário: do primeiro painel ao sistema completo.',
    cursorLabel: 'Ver',
    custom: {
      title: 'Sistemas web sob medida',
      text: 'Aplicações feitas para o seu processo, não o contrário. Sem funções sobrando, sem adaptações forçadas.',
      link: 'Conversar sobre meu projeto →',
      kpis: [
        { label: 'Pedidos', value: '1.284' },
        { label: 'Em andamento', value: '86' },
        { label: 'Concluídos', value: '94%' },
      ],
    },
    automation: {
      title: 'Automação de rotinas',
      text: 'Menos digitação, menos erros. Tarefas repetitivas rodam sozinhas.',
      items: [
        { label: 'Emitir relatório semanal', done: true },
        { label: 'Enviar lembretes aos clientes', done: true },
        { label: 'Conciliar lançamentos', done: false },
      ],
    },
    dashboards: {
      title: 'Painéis em tempo real',
      text: 'Decisões com base em dados atualizados, em uma tela só.',
    },
    integrations: {
      title: 'Integrações',
      text: 'Conectamos seu sistema às ferramentas que você já usa.',
      chips: ['ERP', 'CRM', 'Pagamentos', 'E-mail', 'WhatsApp', 'APIs'],
    },
    scalable: {
      title: 'Escalável e seguro',
      text: 'Arquitetura pronta para crescer com o seu negócio, com boas práticas de segurança desde o início.',
    },
  },

  process: {
    eyebrow: 'Como trabalhamos',
    titleBefore: 'Desenvolve. Entrega. ',
    titleHighlight: 'Evolui.',
    subtitle: 'Um caminho claro, com entregas frequentes e você participando de cada etapa.',
    progressLabel: 'Progresso das etapas',
    steps: [
      {
        title: 'Desenvolve',
        text: 'Entendemos sua operação, mapeamos os gargalos e desenhamos a solução ideal, simples de usar e fácil de adotar.',
      },
      {
        title: 'Entrega',
        text: 'Colocamos o sistema no ar em ciclos curtos, com treinamento e acompanhamento para sua equipe ganhar autonomia.',
      },
      {
        title: 'Evolui',
        text: 'Medimos resultados, ajustamos e adicionamos novos recursos conforme o seu negócio cresce.',
      },
    ],
  },

  results: {
    eyebrow: 'Resultados que buscamos',
    titleBefore: 'Menos esforço manual. ',
    titleHighlight: 'Mais resultado.',
    stats: [
      { value: 70, prefix: '−', suffix: '%', label: 'menos tempo em tarefas manuais*' },
      { value: 3, suffix: 'x', label: 'mais agilidade nos processos*' },
      { value: 100, suffix: '%', label: 'sob medida para sua operação' },
      { value: 24, suffix: '/7', label: 'acesso de qualquer lugar, pelo navegador' },
    ],
    note: '* Valores ilustrativos — substitua pelos números reais da CONFT.',
  },

  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Tire suas dúvidas',
    items: [
      {
        question: 'Para quais empresas a CONFT desenvolve?',
        answer:
          'Para pequenas e grandes empresas de qualquer segmento que queiram substituir processos manuais, planilhas e ferramentas desconectadas por um sistema web simples e eficaz.',
      },
      {
        question: 'Quanto tempo leva para ter o sistema no ar?',
        answer:
          'Depende do escopo. Trabalhamos com entregas em ciclos curtos, então você começa a usar as primeiras funcionalidades antes do projeto completo ficar pronto.',
      },
      {
        question: 'Posso começar pequeno e crescer depois?',
        answer:
          'Sim. Construímos uma base escalável: você começa pelo que mais dói hoje e evoluímos o sistema conforme novas necessidades aparecem.',
      },
      {
        question: 'O sistema se conecta às ferramentas que já uso?',
        answer:
          'Na maioria dos casos, sim. Integramos com ERPs, CRMs, meios de pagamento, e-mail, WhatsApp e outras APIs.',
      },
      {
        question: 'Existe suporte depois da entrega?',
        answer: 'Sim. Acompanhamos o uso, corrigimos o que for necessário e seguimos evoluindo o sistema com você.',
      },
    ],
  },

  contact: {
    eyebrow: 'Vamos conversar',
    title: 'Pronto para simplificar o seu negócio?',
    text: 'Conte um pouco sobre o seu desafio e a gente volta com um caminho claro para resolvê-lo.',
    info: [
      { icon: '✉', text: 'hello@conft.com' },
      { icon: '☎', text: '+1 234 567 4060' },
      { icon: '🌐', text: 'conft.com' },
    ],
    note: 'Dados de contato de exemplo — ajuste para os oficiais.',
    emailTo: 'hello@conft.com',
    emailSubjectPrefix: 'Contato pelo site — ',
    emailBody: { name: 'Nome', email: 'E-mail', company: 'Empresa', empty: '-' },
    form: {
      name: { label: 'Nome', placeholder: 'Seu nome' },
      email: { label: 'E-mail', placeholder: 'voce@empresa.com' },
      company: { label: 'Empresa', placeholder: 'Nome da empresa' },
      message: { label: 'Como podemos ajudar?', placeholder: 'Descreva o processo que você quer melhorar' },
      submit: 'Enviar mensagem',
      sending: 'Enviando…',
      success: 'Pronto! Abrindo seu aplicativo de e-mail para finalizar o envio.',
      error: 'Não foi possível abrir o e-mail. Tente novamente ou escreva direto para o endereço ao lado.',
      errors: {
        name: 'Informe seu nome.',
        email: 'Informe um e-mail válido, como voce@empresa.com.',
        message: 'Conte um pouco sobre o que você precisa (mínimo de 10 caracteres).',
      },
    },
  },

  footer: {
    tagline: 'Construindo soluções para ',
    taglineStrong: 'o seu negócio.',
    nav: [
      { id: 'sobre', label: 'Sobre' },
      { id: 'solucoes', label: 'Soluções' },
      { id: 'processo', label: 'Processo' },
      { id: 'faq', label: 'FAQ' },
      { id: 'contato', label: 'Contato' },
    ],
    navLabel: 'Rodapé',
    wordmark: 'CONFT',
    rights: 'Todos os direitos reservados.',
    slogan: 'Desenvolve. Entrega. Evolui.',
  },
};
