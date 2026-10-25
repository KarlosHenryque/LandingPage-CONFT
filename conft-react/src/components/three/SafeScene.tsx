import { Component, Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { hasWebGL } from './webgl';

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface SafeSceneProps {
  fallback: ReactNode;
  children: ReactNode;
  /** só monta a cena quando for true (ex.: após ocioso ou ao entrar na viewport) */
  ready?: boolean;
}

/** Suspense + error boundary + detecção de WebGL. Mostra o fallback estático em qualquer falha. */
export function SafeScene({ fallback, children, ready = true }: SafeSceneProps) {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(hasWebGL()), []);

  if (!ready || !webgl) return <>{fallback}</>;
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Boundary>
  );
}

/** Espera o navegador ficar ocioso antes de carregar o 3D (protege o LCP). */
export function useIdleReady(timeout = 1500): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(done, { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(done, 300);
    return () => window.clearTimeout(id);
  }, [timeout]);
  return ready;
}
