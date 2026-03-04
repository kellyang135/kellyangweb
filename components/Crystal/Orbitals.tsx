'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitalsProps {
  visible: boolean;
  intensity: number; // 0 to 1
}

export default function Orbitals({ visible, intensity }: OrbitalsProps) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const electron1Ref = useRef<THREE.Mesh>(null);
  const electron2Ref = useRef<THREE.Mesh>(null);

  const orbitRadius = 0.2;

  // Create orbital ring points
  const ringPoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(64);
    return points.map(p => [p.x, p.y, 0] as [number, number, number]);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate orbital planes
    if (group1Ref.current) {
      group1Ref.current.rotation.z = time * 0.5;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.z = -time * 0.7;
    }

    // Move electrons along orbits
    if (electron1Ref.current) {
      electron1Ref.current.position.x = Math.cos(time * 2) * orbitRadius;
      electron1Ref.current.position.y = Math.sin(time * 2) * orbitRadius;
    }
    if (electron2Ref.current) {
      electron2Ref.current.position.x = Math.cos(time * 2.5 + Math.PI) * orbitRadius;
      electron2Ref.current.position.y = Math.sin(time * 2.5 + Math.PI) * orbitRadius;
    }
  });

  if (!visible || intensity < 0.01) return null;

  return (
    <group>
      {/* Orbital 1 - tilted */}
      <group ref={group1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <Line points={ringPoints} color="#81e6d9" transparent opacity={0.4 * intensity} lineWidth={1} />
        <mesh ref={electron1Ref}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={intensity} />
        </mesh>
      </group>

      {/* Orbital 2 - different tilt */}
      <group ref={group2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <Line points={ringPoints} color="#7ee8a8" transparent opacity={0.3 * intensity} lineWidth={1} />
        <mesh ref={electron2Ref}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={intensity} />
        </mesh>
      </group>
    </group>
  );
}
