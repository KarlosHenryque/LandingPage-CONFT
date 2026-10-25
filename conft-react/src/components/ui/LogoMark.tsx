import type { CSSProperties } from 'react';

/** Definido uma vez no App; reutilizado com <use> em qualquer lugar. */
export function LogoSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="conft-perna" gradientUnits="userSpaceOnUse" x1="150" y1="360" x2="330" y2="0">
          <stop offset="0" stopColor="#0159FB" />
          <stop offset="1" stopColor="#0260F7" />
        </linearGradient>
        <linearGradient id="conft-barra" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="380" y2="0">
          <stop offset="0" stopColor="#045AFD" />
          <stop offset="1" stopColor="#024CFC" />
        </linearGradient>
        <linearGradient id="conft-roxo" gradientUnits="userSpaceOnUse" x1="350" y1="200" x2="600" y2="545">
          <stop offset="0" stopColor="#881AFD" />
          <stop offset="1" stopColor="#8B16FB" />
        </linearGradient>
      </defs>
      <symbol id="conft-logo" viewBox="-10 -10 650 566">
        <g strokeLinejoin="round" strokeWidth="10">
          <polygon points="315,0 379.4,111.5 240,353 111.2,353" fill="url(#conft-perna)" stroke="url(#conft-perna)" />
          <polygon points="75.4,415 303,415 378.4,545.6 0,545.6" fill="url(#conft-barra)" stroke="url(#conft-barra)" />
          <polygon points="415.2,173.6 630,545.6 450,545.6 325.2,329.4" fill="url(#conft-roxo)" stroke="url(#conft-roxo)" />
        </g>
      </symbol>
    </svg>
  );
}

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
  label?: string;
}

export function LogoMark({ className, style, label }: LogoMarkProps) {
  return (
    <svg
      className={className}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href="#conft-logo" />
    </svg>
  );
}
