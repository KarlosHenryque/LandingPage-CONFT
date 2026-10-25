import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motionConfig } from '../../config/motion';
import { mouse } from '../../hooks/useMouse';
import { scrollState, scrollVelocity } from '../../hooks/useScrollState';
import { Particles } from './Particles';

const CAMERA_Z = 6;

const vertexShader = /* glsl */ `
  uniform float uCenterZ;
  uniform float uRadius;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // 0 = lado de trás do globo, 1 = lado da frente
    vDepth = clamp((mv.z - uCenterZ) / (2.0 * uRadius) + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBack;
  uniform vec3 uFront;
  varying float vDepth;
  void main() {
    vec3 c = mix(uBack, uFront, vDepth) * (0.7 + vDepth * 0.9);
    gl_FragColor = vec4(c, 0.1 + vDepth * 0.42);
  }
`;

interface RingSpec {
  tiltX: number;
  tiltZ: number;
  spin: number;
  angle: number;
  squash: number;
}

interface GlobeProps {
  interactive: boolean;
  animate: boolean;
}

function Globe({ interactive, animate }: GlobeProps) {
  const root = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const boost = useRef(1);
  const { viewport } = useThree();
  const cfg = motionConfig.globe;

  const rings = useMemo<RingSpec[]>(
    () =>
      Array.from({ length: cfg.rings }, (_, i) => ({
        tiltX: (Math.PI / cfg.rings) * i + 0.2,
        tiltZ: (i % 3) * 0.55 - 0.5,
        // rad/s (equivale à velocidade por frame da versão em canvas, a 60 fps)
        spin: (0.0015 + (i % 4) * 0.0006) * 60 * 0.7,
        angle: i * 0.7,
        squash: 0.55 + (i % 5) * 0.11,
      })),
    [cfg.rings],
  );

  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.0065, 6, 220), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: {
          uCenterZ: { value: -CAMERA_Z },
          uRadius: { value: 1 },
          uBack: { value: new THREE.Color('#8266ff') },
          uFront: { value: new THREE.Color('#4a96ff') },
        },
      }),
    [],
  );

  // dimensiona e posiciona o globo como na versão 2D: centro logo abaixo da borda inferior
  const radius = Math.min(viewport.width * 0.4, viewport.height * 0.6);
  const centerY = -viewport.height * 0.52;

  useFrame(({ clock }, dt) => {
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime;
    material.uniforms.uRadius.value = radius;

    let targetX = 0;
    let targetY = 0;
    let target = 1;
    if (animate) {
      if (interactive) {
        targetX = mouse.y * cfg.tiltX;
        targetY = mouse.x * cfg.tiltY;
        const moving = performance.now() - mouse.t < 160 ? 1 : 0;
        target = 1 + moving * (cfg.boostOnMove - 1);
      } else {
        // touch: balanço automático simples, sem giroscópio
        targetX = Math.sin(t * 0.35) * 0.08;
        targetY = Math.sin(t * 0.25) * 0.22;
      }
    }
    if (animate) {
      // rolar acelera o giro e afunda o globo suavemente
      const sc = motionConfig.scroll;
      target += Math.min(Math.abs(scrollVelocity()) * sc.globeSpinBoost, sc.globeSpinMax);
      const sink = (scrollState.y / window.innerHeight) * viewport.height * sc.globeSink;
      g.position.y = THREE.MathUtils.damp(g.position.y, centerY - sink, 6, dt);
    }
    boost.current = THREE.MathUtils.damp(boost.current, target, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, cfg.damping, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, cfg.damping, dt);

    rings.forEach((r, i) => {
      const ring = ringRefs.current[i];
      if (!ring) return;
      if (animate) r.angle += r.spin * cfg.idleSpeed * boost.current * dt;
      // ordem ZXY: gira em Y (spin), depois inclina em X e Z, como na projeção original
      ring.rotation.set(r.tiltX, r.angle, r.tiltZ, 'ZXY');
    });
  });

  return (
    <group ref={root} position={[0, centerY, 0]} scale={radius}>
      {rings.map((r, i) => (
        <group
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
        >
          <mesh geometry={geometry} material={material} scale={[1, r.squash, 1]} />
        </group>
      ))}
    </group>
  );
}

interface GlobeSceneProps {
  /** false quando o hero saiu da tela: pausa o render */
  active: boolean;
  interactive: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
}

export default function GlobeScene({ active, interactive, reducedMotion, lowPower }: GlobeSceneProps) {
  const animate = active && !reducedMotion;
  const { bloom } = motionConfig.globe;
  const particles = lowPower ? motionConfig.particles.mobile : motionConfig.particles.desktop;

  return (
    <Canvas
      dpr={motionConfig.globe.dpr}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [0, 0, CAMERA_Z], fov: 40, near: 0.1, far: 50 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Particles count={particles} interactive={interactive} animate={animate} />
      <Globe interactive={interactive} animate={animate} />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={bloom.intensity}
            luminanceThreshold={bloom.threshold}
            luminanceSmoothing={bloom.smoothing}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
