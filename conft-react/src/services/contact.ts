import type { Content } from '../data/content';

export interface ContactValues {
  name: string;
  email: string;
  company?: string;
  message: string;
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Hoje o envio abre o aplicativo de e-mail do usuário (mailto).
 * Para enviar por API, troque o corpo desta função por um fetch e mantenha a assinatura.
 */
export async function sendContact(values: ContactValues, cfg: Content['contact']): Promise<void> {
  await wait(800); // dá tempo de o estado de carregamento aparecer

  if (!cfg.emailTo) throw new Error('Destinatário não configurado');

  const subject = encodeURIComponent(`${cfg.emailSubjectPrefix}${values.name}`);
  const { emailBody: b } = cfg;
  const body = encodeURIComponent(
    `${b.name}: ${values.name}\n${b.email}: ${values.email}\n${b.company}: ${values.company?.trim() || b.empty}\n\n${values.message}`,
  );
  window.location.href = `mailto:${cfg.emailTo}?subject=${subject}&body=${body}`;
}
