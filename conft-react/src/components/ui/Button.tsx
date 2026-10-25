import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'white' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'sm';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

type AnchorProps = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>;
type NativeProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export type ButtonProps = AnchorProps | NativeProps;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', block, loading, className, children } = props;
  const cls = [styles.btn, styles[variant], size === 'sm' ? styles.sm : '', block ? styles.block : '', loading ? styles.loading : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  if (props.href !== undefined) {
    const { variant: _v, size: _s, block: _b, loading: _l, className: _c, children: _ch, ...rest } = props;
    void [_v, _s, _b, _l, _c, _ch];
    return (
      <a className={cls} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, block: _b, loading: _l, className: _c, children: _ch, href: _h, ...rest } = props;
  void [_v, _s, _b, _l, _c, _ch, _h];
  return (
    <button className={cls} type="button" aria-busy={loading || undefined} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}
