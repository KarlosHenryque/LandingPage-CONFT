import type { Content } from '../data/content';

export interface ContactValues {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/** Envia o formulário para a função serverless /api/contact (Vercel), que dispara o e-mail. */
export async function sendContact(values: ContactValues, _cfg: Content['contact']): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error(`Falha no envio (${res.status})`);
}
