import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motionConfig } from '../../config/motion';
import { mouse } from '../../hooks/useMouse';
import { scrollState, scrollVelocity } from '../../hooks/useScrollState';

interface ParticlesProps {
  count: number;
  /** false = sem cursor (touch / reduced motion): parado ou com balanço leve */
  interactive: boolean;
  animate: boolean;
}

interface LayerProps {
  count: number;
  factor: number;
  z: number;
  size: number;
  interactive: boolean;
  animate: boolean;
  phase: number;
}

function Layer({ count, factor, z, size, interactive, animate, phase }: LayerProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const { viewport } = useThree();
  const { width, height, dpr } = viewport;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * width * 1.3;
      // as estrelas ocupam os 80% superiores, como na versão em canvas 2D
      arr[i * 3 + 1] = height / 2 - Math.random() * height * 0.8;
      arr[i * 3 + 2] = z + (Math.random() - 0.5) * 0.6;
    }
    return arr;
  }, [count, width, height, z]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    const m = material.current;
    if (!g || !m) return;
    const t = clock.elapsedTime;
    if (animate) {
      const sc = motionConfig.scroll;
      const tx = interactive ? -mouse.x : Math.sin(t * 0.2 + phase) * 0.6;
      const ty = interactive ? mouse.y : 0;
      // camadas da frente andam mais que as do fundo quando se rola: sensação de profundidade
      const scrolled = (scrollState.y / window.innerHeight) * height * factor * sc.starsShift;
      const vel = Math.abs(scrollVelocity());
      const warp = Math.min(vel * sc.starsWarp, sc.starsWarpMax);
      g.position.x = THREE.MathUtils.damp(g.position.x, tx * motionConfig.particles.parallax * factor * 3, 4, dt);
      g.position.y = THREE.MathUtils.damp(
        g.position.y,
        ty * motionConfig.particles.parallax * factor * 1.6 + scrolled,
        6,
        dt,
      );
      // estica as estrelas no sentido vertical em rolagens rápidas
      g.scale.y = THREE.MathUtils.damp(g.scale.y, 1 + warp * factor * 2, 8, dt);
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, scrollState.y * 0.00012 * (factor + 0.3), 4, dt);
      m.opacity = Math.min(1, 0.45 + Math.sin(t * (0.6 + factor) + phase) * 0.25 + warp * 0.4);
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          color="#ffffff"
          size={size * dpr}
          sizeAttenuation={false}
          transparent
          opacity={0.6}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/** Estrelas em 3 camadas de profundidade, com parallax pelo cursor. */
export function Particles({ count, interactive, animate }: ParticlesProps) {
  const { layers } = motionConfig.particles;
  const per = Math.floor(count / layers.length);
  return (
    <>
      {layers.map((factor, i) => (
        <Layer
          key={factor}
          count={per}
          factor={factor}
          z={-2 + i * 0.9}
          size={1 + i * 0.45}
          interactive={interactive}
          animate={animate}
          phase={i * 2.1}
        />
      ))}
    </>
  );
}
