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
    vec3 c = mix(uBack, uFront, vDepth) * (0.6 + vDepth * 0.35);
    gl_FragColor = vec4(c, 0.07 + vDepth * 0.3);
  }
`;

interface RingSpec {
  /** orientação fixa do plano da órbita */
  base: THREE.Quaternion;
  /** giro da elipse dentro do próprio plano */
  angle: number;
  spin: number;
  squash: number;
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const tmpQuat = new THREE.Quaternion();

interface ElectronSpec {
  ring: number;
  phase: number;
  speed: number; // rad/s; o sinal define o sentido
}

// rastro do elétron: opacidade e escala de cada ponto, da cabeça para a cauda
const TRAIL = Array.from({ length: 9 }, (_, k) => ({
  opacity: k === 0 ? 0.7 : 0.3 * (1 - k / 9) ** 2,
  scale: k === 0 ? 1 : 0.75 - (k / 9) * 0.45,
}));
const TRAIL_STEP = 0.012; // rad entre os pontos do rastro

interface GlobeProps {
  interactive: boolean;
  animate: boolean;
}

function Globe({ interactive, animate }: GlobeProps) {
  const root = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const boost = useRef(1);
  const { viewport } = useThree();
  const cfg = motionConfig.globe;

  // órbitas ordenadas: planos distribuídos por igual em volta da esfera (espiral de Fibonacci),
  // todas com o mesmo achatamento, como a gaiola de um átomo, sem ponto onde todas se cruzam
  const rings = useMemo<RingSpec[]>(
    () =>
      Array.from({ length: cfg.rings }, (_, i) => {
        const y = 1 - (i + 0.5) / cfg.rings;
        const r = Math.sqrt(1 - y * y);
        const th = i * GOLDEN_ANGLE;
        const normal = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
        return {
          base: new THREE.Quaternion().setFromUnitVectors(Z_AXIS, normal),
          angle: (Math.PI * i) / cfg.rings,
          spin: cfg.ringSpin * (i % 2 ? -1 : 1),
          squash: cfg.ringSquash,
        };
      }),
    [cfg.rings, cfg.ringSpin, cfg.ringSquash],
  );

  // um elétron por anel, defasados para não andarem alinhados
  const electrons = useMemo<ElectronSpec[]>(
    () =>
      rings.map((_, i) => ({
        ring: i,
        phase: (Math.PI * 2 * i) / rings.length,
        speed: cfg.electronSpeed * (i % 2 ? -1 : 1),
      })),
    [rings, cfg.electronSpeed],
  );
  const electronRefs = useRef<(THREE.Mesh | null)[]>([]);
  const electronGeometry = useMemo(() => new THREE.SphereGeometry(0.0075, 10, 10), []);
  const electronMaterials = useMemo(
    () =>
      TRAIL.map(
        (p) =>
          new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: p.opacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          }),
      ),
    [],
  );

  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.0022, 6, 260), []);
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
          uBack: { value: new THREE.Color('#8f9bb3') },
          uFront: { value: new THREE.Color('#ffffff') },
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

    // a gaiola inteira gira devagar em Y; cada elipse gira no próprio plano
    if (cage.current && animate) cage.current.rotation.y += cfg.cageSpin * cfg.idleSpeed * boost.current * dt;
    rings.forEach((r, i) => {
      const ring = ringRefs.current[i];
      if (!ring) return;
      if (animate) r.angle += r.spin * cfg.idleSpeed * boost.current * dt;
      ring.quaternion.copy(r.base).multiply(tmpQuat.setFromAxisAngle(Z_AXIS, r.angle));
    });

    // elétrons correm sobre a elipse do anel (mesmo achatamento do torus)
    electrons.forEach((e, ei) => {
      const squash = rings[e.ring].squash;
      if (animate) e.phase += e.speed * boost.current * dt;
      const back = -Math.sign(e.speed);
      TRAIL.forEach((_, k) => {
        const m = electronRefs.current[ei * TRAIL.length + k];
        if (!m) return;
        const a = e.phase + back * k * TRAIL_STEP;
        m.position.set(Math.cos(a), Math.sin(a) * squash, 0);
      });
    });
  });

  return (
    <group ref={root} position={[0, centerY, 0]} scale={radius}>
      <group ref={cage}>
      {rings.map((r, i) => (
        <group
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
        >
          <mesh geometry={geometry} material={material} scale={[1, r.squash, 1]} />
          {electrons.map((e, ei) =>
            e.ring === i
              ? TRAIL.map((p, k) => (
                  <mesh
                    key={`${ei}-${k}`}
                    ref={(el) => {
                      electronRefs.current[ei * TRAIL.length + k] = el;
                    }}
                    geometry={electronGeometry}
                    material={electronMaterials[k]}
                    scale={p.scale}
                  />
                ))
              : null,
          )}
        </group>
      ))}
      </group>
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
