import styles from './GlobeFallback.module.css';

/** Globo estático em SVG: aparece enquanto o 3D carrega ou quando não há WebGL. */
export function GlobeFallback() {
  const rings = Array.from({ length: 7 }, (_, i) => ({
    ry: 90 + (i % 5) * 38,
    rot: -60 + i * 20,
    purple: i % 3 === 0,
  }));

  return (
    <svg className={styles.svg} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="gf-glow" cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor="#7a25eb" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#2563eb" stopOpacity="0.12" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#gf-glow)" />
      <g transform="translate(500 620)" fill="none" strokeWidth="1.6">
        {rings.map((r, i) => (
          <ellipse
            key={i}
            rx="420"
            ry={r.ry}
            transform={`rotate(${r.rot})`}
            stroke={r.purple ? '#a78bfa' : '#60a5fa'}
            strokeOpacity="0.45"
          />
        ))}
      </g>
    </svg>
  );
}
