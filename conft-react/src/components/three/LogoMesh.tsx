import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionConfig } from '../../config/motion';
import { mouse } from '../../hooks/useMouse';
import { scrollState, scrollVelocity } from '../../hooks/useScrollState';

type Point = [number, number];

/* Mesmos três polígonos do conft-simbolo.svg (coordenadas em px do SVG) */
const FACETS: { points: Point[]; color: string }[] = [
  { points: [[315, 0], [379.4, 111.5], [240, 353], [111.2, 353]], color: '#0159fb' },
  { points: [[75.4, 415], [303, 415], [378.4, 545.6], [0, 545.6]], color: '#045afd' },
  { points: [[415.2, 173.6], [630, 545.6], [450, 545.6], [325.2, 329.4]], color: '#881afd' },
];

const SCALE = 300; // px do SVG → unidades do mundo
const CENTER: Point = [315, 272.8];

function buildGeometry(points: Point[], depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => {
    const px = (x - CENTER[0]) / SCALE;
    const py = -(y - CENTER[1]) / SCALE; // o eixo Y do SVG é invertido
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.014,
    bevelThickness: 0.025,
    bevelSegments: 3,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

interface LogoProps {
  interactive: boolean;
  animate: boolean;
}

function Logo({ interactive, animate }: LogoProps) {
  const group = useRef<THREE.Group>(null);
  const cfg = motionConfig.logo;
  const geometries = useMemo(() => FACETS.map((f) => buildGeometry(f.points, cfg.depth)), [cfg.depth]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g || !animate) return;
    const t = clock.elapsedTime;
    const sc = motionConfig.scroll;
    const s = scrollState.y;
    const vel = Math.abs(scrollVelocity());
    const sway = Math.sin(t * 0.6) * cfg.idleSway;
    // o logo gira conforme a página rola, somado ao movimento pelo cursor
    const tx = (interactive ? mouse.y * cfg.followX + Math.sin(t * 0.5) * 0.04 : Math.sin(t * 0.4) * 0.08) + Math.sin(s * 0.003) * 0.3;
    const ty = (interactive ? mouse.x * cfg.followY + sway * 0.3 : sway * 2) + s * sc.logoSpin;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, cfg.damping, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, cfg.damping, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.sin(s * 0.004) * sc.logoBob, 4, dt);
    const pulse = 1 + Math.min(vel * sc.logoPulse, 0.18);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, pulse, 6, dt));
  });

  return (
    <group ref={group} rotation={[0.08, -0.35, 0]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            color={FACETS[i].color}
            emissive={FACETS[i].color}
            emissiveIntensity={0.28}
            metalness={0.3}
            roughness={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

interface LogoMeshProps {
  active: boolean;
  interactive: boolean;
  reducedMotion: boolean;
}

/** Símbolo da CONFT extrudado em 3D que gira seguindo o cursor. */
export default function LogoMesh({ active, interactive, reducedMotion }: LogoMeshProps) {
  const animate = active && !reducedMotion;
  return (
    <Canvas
      dpr={motionConfig.globe.dpr}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [0, 0, 5], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-3, -2, 2.5]} intensity={9} color="#8b5cf6" />
      <pointLight position={[3, 1.5, 2.5]} intensity={7} color="#3b82f6" />
      <Logo interactive={interactive} animate={animate} />
    </Canvas>
  );
}
