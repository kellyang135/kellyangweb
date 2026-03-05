// components/Crystal/Particles.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';

// Calmer, more ambient particle settings
const PARTICLE_COUNT = 25;
const PARTICLE_COUNT_MOBILE = 12;
const BOUNDS = 4;
const ATTRACTION_STRENGTH = 0.004; // Much gentler attraction
const DRIFT_SPEED = 0.02; // Slower drift

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePosition = useAnimationStore((s) => s.mousePosition);
  const isMobile = useAnimationStore((s) => s.isMobile);

  // Pre-allocate reusable Vector3 objects
  const tempParticlePos = useRef(new THREE.Vector3());
  const tempToMouse = useRef(new THREE.Vector3());

  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;

  // Initialize particle positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS * 2;
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * DRIFT_SPEED,
        (Math.random() - 0.5) * DRIFT_SPEED,
        (Math.random() - 0.5) * DRIFT_SPEED
      ));
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      tempParticlePos.current.set(posArray[idx], posArray[idx + 1], posArray[idx + 2]);

      // Calculate distance to mouse
      tempToMouse.current.copy(mousePosition).sub(tempParticlePos.current);
      const distance = tempToMouse.current.length();

      // Very gentle attraction when close to cursor (within 2.5 units)
      if (distance < 2.5 && distance > 0.3) {
        const attraction = tempToMouse.current.normalize().multiplyScalar(ATTRACTION_STRENGTH * (1 - distance / 2.5));
        velocities[i].add(attraction);
      }

      // Apply velocity with stronger damping for calmer motion
      velocities[i].multiplyScalar(0.96);

      // Very subtle random drift
      velocities[i].x += (Math.random() - 0.5) * 0.0003;
      velocities[i].y += (Math.random() - 0.5) * 0.0003;
      velocities[i].z += (Math.random() - 0.5) * 0.0003;

      // Update position
      posArray[idx] += velocities[i].x;
      posArray[idx + 1] += velocities[i].y;
      posArray[idx + 2] += velocities[i].z;

      // Wrap around bounds
      for (let j = 0; j < 3; j++) {
        if (posArray[idx + j] > BOUNDS) posArray[idx + j] = -BOUNDS;
        if (posArray[idx + j] < -BOUNDS) posArray[idx + j] = BOUNDS;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#4fd1c5"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
