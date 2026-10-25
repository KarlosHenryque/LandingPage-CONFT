import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './TextField.module.css';

interface TextFieldProps {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  /** campo já tocado e válido: destaca o contorno */
  valid?: boolean;
  type?: 'text' | 'email';
  multiline?: boolean;
  rows?: number;
  autoComplete?: string;
}

export function TextField({
  label,
  placeholder,
  registration,
  error,
  valid,
  type = 'text',
  multiline,
  rows = 4,
  autoComplete,
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const fieldProps = {
    id,
    placeholder,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `${styles.input} ${error ? styles.invalid : ''} ${valid && !error ? styles.valid : ''}`,
    ...registration,
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {multiline ? <textarea rows={rows} {...fieldProps} /> : <input type={type} {...fieldProps} />}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            className={styles.error}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
