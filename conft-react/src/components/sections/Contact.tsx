import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';
import { content } from '../../data/content';
import type { Content } from '../../data/content';
import { sendContact } from '../../services/contact';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { MagneticButton } from '../ui/MagneticButton';
import { Reveal } from '../ui/Reveal';
import { TextField } from '../ui/TextField';
import styles from './Contact.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

function makeSchema(errors: Content['contact']['form']['errors']) {
  return z.object({
    name: z.string().trim().min(2, errors.name),
    email: z.string().trim().email(errors.email),
    company: z.string().trim().optional(),
    message: z.string().trim().min(10, errors.message),
  });
}
type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function Contact() {
  const { contact } = content;
  const { form: f } = contact;
  const schema = useMemo(() => makeSchema(f.errors), [f.errors]);
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched', // valida ao sair do campo e, depois disso, a cada tecla
    defaultValues: { name: '', email: '', company: '', message: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus('sending');
    try {
      await sendContact(values, contact);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const valid = (name: keyof FormValues) => Boolean(touchedFields[name] && dirtyFields[name]);

  return (
    <section className={styles.contact} id="contato" aria-labelledby="contato-title">
      <div className={styles.box}>
        <Reveal className={styles.copy}>
          <Eyebrow dark>{contact.eyebrow}</Eyebrow>
          <h2 id="contato-title">{contact.title}</h2>
          <p>{contact.text}</p>
          <ul className={styles.info}>
            {contact.info.map((item) => (
              <li key={item.text}>
                <span aria-hidden="true">{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
          <small className={styles.note}>{contact.note}</small>
        </Reveal>

        <Reveal index={1}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label={f.name.label}
              placeholder={f.name.placeholder}
              autoComplete="name"
              registration={register('name')}
              error={errors.name?.message}
              valid={valid('name')}
            />
            <TextField
              label={f.email.label}
              placeholder={f.email.placeholder}
              type="email"
              autoComplete="email"
              registration={register('email')}
              error={errors.email?.message}
              valid={valid('email')}
            />
            <TextField
              label={f.company.label}
              placeholder={f.company.placeholder}
              autoComplete="organization"
              registration={register('company')}
            />
            <TextField
              multiline
              label={f.message.label}
              placeholder={f.message.placeholder}
              registration={register('message')}
              error={errors.message?.message}
              valid={valid('message')}
            />

            <MagneticButton className={styles.submit}>
              <Button type="submit" block loading={status === 'sending'} disabled={status === 'sending'}>
                {status === 'sending' ? f.sending : f.submit}
              </Button>
            </MagneticButton>

            <div className={styles.status} role="status" aria-live="polite">
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.p
                    key="success"
                    className={styles.success}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <motion.path
                        d="M7 12.5l3.2 3.2L17 9"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                      />
                    </svg>
                    {f.success}
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    key="error"
                    className={styles.fail}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: [0, -8, 8, -5, 5, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    {f.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
