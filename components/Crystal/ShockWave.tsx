// components/Crystal/ShockWave.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';

export default function ShockWave() {
  const ringRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const burstTimestamp = useAnimationStore((s) => s.burstTimestamp);
  const activeAtomPosition = useAnimationStore((s) => s.activeAtomPosition);
  const startPosition = useRef<THREE.Vector3 | null>(null);

  // Trigger on burst
  useEffect(() => {
    if (burstTimestamp > 0 && activeAtomPosition) {
      startPosition.current = activeAtomPosition.clone();
      setActive(true);
      setProgress(0);
    }
  }, [burstTimestamp, activeAtomPosition]);

  useFrame((state, delta) => {
    if (!active || !ringRef.current || !startPosition.current) return;

    // Animate expansion
    const newProgress = progress + delta * 2.5; // ~400ms total
    setProgress(newProgress);

    if (newProgress >= 1) {
      setActive(false);
      return;
    }

    // Expand ring
    const scale = 0.1 + newProgress * 2.5;
    ringRef.current.scale.setScalar(scale);

    // Fade out
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - newProgress) * 0.6;

    // Position at burst origin
    ringRef.current.position.copy(startPosition.current);
  });

  if (!active) return null;

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial
        color="#81e6d9"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
