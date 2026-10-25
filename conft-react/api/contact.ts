/**
 * Função serverless da Vercel: recebe o formulário e envia o e-mail pelo Resend.
 * Variáveis de ambiente (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  chave da API do Resend (só existe aqui, nunca no bundle do frontend)
 *   CONTACT_TO      e-mail que vai receber as mensagens
 *   CONTACT_FROM    (opcional) remetente; padrão "CONFT <onboarding@resend.dev>"
 *
 * Toda a validação do frontend é repetida aqui: a API pode ser chamada direto, sem a interface.
 * O formulário não aceita arquivos: qualquer corpo que não seja JSON é recusado.
 */

const LIMITS = { name: 100, email: 254, company: 100, message: 2000 } as const;
const MAX_BODY_BYTES = 10_000;

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const UNSAFE_RE = /<\s*\/?\s*(script|iframe|object|embed|style|link|meta|svg)\b|\bon\w+\s*=|javascript\s*:|data\s*:\s*text\/html|vbscript\s*:/i;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  });

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clean = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '').replace(CONTROL_RE, '').trim().slice(0, max + 1);

// Rate limit em memória: vale por instância da função (best effort, não é global).
// Para um limite estrito entre instâncias, trocar por Upstash/Vercel KV ou Vercel Firewall.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) return json({ error: 'Servidor não configurado' }, 500);

  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'Requisição inválida' }, 415);
  }

  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (limited(ip)) return json({ error: 'Muitas tentativas. Aguarde um minuto.' }, 429, { 'Retry-After': '60' });

  let data: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: 'Requisição muito grande' }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    data = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'Requisição inválida' }, 400);
  }

  // honeypot: bots preenchem o campo oculto; responde sucesso sem enviar nada
  if (typeof data.website === 'string' && data.website.trim() !== '') return json({ ok: true });

  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const company = clean(data.company, LIMITS.company);
  const message = clean(data.message, LIMITS.message);

  if (
    name.length < 2 || name.length > LIMITS.name ||
    company.length > LIMITS.company ||
    message.length < 10 || message.length > LIMITS.message ||
    email.length > LIMITS.email || !EMAIL_RE.test(email)
  ) {
    return json({ error: 'Dados inválidos' }, 400);
  }
  if ([name, company, message].some((s) => UNSAFE_RE.test(s))) {
    return json({ error: 'Conteúdo não permitido' }, 400);
  }

  const subjectName = name.replace(/[\r\n]+/g, ' ');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'CONFT <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Novo contato pelo site: ${subjectName}`,
      html: `<p><b>Nome:</b> ${escapeHtml(name)}</p>
<p><b>E-mail:</b> ${escapeHtml(email)}</p>
<p><b>Empresa:</b> ${escapeHtml(company) || '—'}</p>
<p><b>Mensagem:</b></p>
<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      text: `Nome: ${name}\nE-mail: ${email}\nEmpresa: ${company || '—'}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    // só vai para os logs da Vercel (nunca para o cliente); o corpo do erro do Resend não contém a chave
    console.error('Resend recusou o envio', res.status, (await res.text().catch(() => '')).slice(0, 500));
    return json({ error: 'Falha ao enviar' }, 502);
  }
  return json({ ok: true });
}
