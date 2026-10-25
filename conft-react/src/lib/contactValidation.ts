/**
 * Regras de validação do formulário de contato (frontend).
 * O backend (api/contact.ts) repete as mesmas regras: ao alterar um limite, altere nos dois.
 */

export const LIMITS = { name: 100, email: 254, company: 100, message: 2000 } as const;

// formato simples e seguro: local@dominio.tld, sem espaços nem caracteres de controle
export const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

// <script>, <iframe>, atributos on*=, URLs javascript:/data:text/html
const UNSAFE_RE = /<\s*\/?\s*(script|iframe|object|embed|style|link|meta|svg)\b|\bon\w+\s*=|javascript\s*:|data\s*:\s*text\/html|vbscript\s*:/i;

// caracteres de controle (exceto \n e \t), usados em injeção de cabeçalhos de e-mail
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const cleanText = (s: string) => s.replace(CONTROL_RE, '').trim();
export const isSafeText = (s: string) => !UNSAFE_RE.test(s);
export const isEmail = (s: string) => s.length <= LIMITS.email && EMAIL_RE.test(s);
