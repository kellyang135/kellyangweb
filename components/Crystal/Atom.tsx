'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';
import Orbitals from './Orbitals';

// Easing function for bounce effect
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface AtomProps {
  position: [number, number, number];
  type: 'corner' | 'face';
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  animationProgress?: number; // 0 to 1
}

export default function Atom({ position, type, label, isActive, onClick, animationProgress = 1 }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [orbitalIntensity, setOrbitalIntensity] = useState(0);
  const mousePosition = useAnimationStore((s) => s.mousePosition);
  const groupRef = useRef<THREE.Group>(null);
  const originalPosition = useRef(new THREE.Vector3(...position));
  const currentOffset = useRef(new THREE.Vector3(0, 0, 0));
  const tempVec = useRef(new THREE.Vector3());
  const zeroVec = useRef(new THREE.Vector3(0, 0, 0));

  const isClickable = type === 'face';
  const baseSize = type === 'corner' ? 0.08 : 0.12;
  // Corner atoms are dimmer, face atoms are brighter
  const color = type === 'corner' ? '#3a9d94' : '#7ee8a8';

  // Calculate animation values
  // Face atoms scale in with bounce, corner atoms fade in
  const isFace = type === 'face';
  const animatedScale = isFace ? easeOutBack(Math.min(animationProgress, 1)) : animationProgress;
  const animatedOpacity = animationProgress;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    // Calculate distance to mouse (reusing pre-allocated vectors)
    const toMouse = tempVec.current.copy(mousePosition).sub(originalPosition.current);
    const distance = toMouse.length();

    // Magnetic attraction (subtle drift toward cursor)
    const attractionRadius = 1.5;
    if (distance < attractionRadius && distance > 0.1) {
      const strength = 0.03 * (1 - distance / attractionRadius);
      const targetOffset = toMouse.normalize().multiplyScalar(strength);
      currentOffset.current.lerp(targetOffset, 0.1);
    } else {
      currentOffset.current.lerp(zeroVec.current, 0.05);
    }

    // Apply offset to group position
    groupRef.current.position.set(
      position[0] + currentOffset.current.x,
      position[1] + currentOffset.current.y,
      position[2] + currentOffset.current.z
    );

    // Proximity glow (increase scale and brightness when cursor near)
    const proximityGlow = distance < attractionRadius ? (1 - distance / attractionRadius) * 0.1 : 0;

    // Pulse animation for clickable atoms
    if (isClickable && !isActive && animationProgress >= 1) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(animatedScale * (1 + pulse + proximityGlow));
    } else {
      meshRef.current.scale.setScalar(animatedScale * (1 + proximityGlow));
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(animatedScale * (1.5 + proximityGlow * 2));
    }

    // Update orbital intensity based on proximity or active state
    const targetOrbitalIntensity = isActive ? 1 : (distance < 1.2 ? (1 - distance / 1.2) : 0);
    setOrbitalIntensity(prev => prev + (targetOrbitalIntensity - prev) * 0.1);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={isClickable ? onClick : undefined}
        onPointerOver={() => { if (isClickable) { setHovered(true); document.body.style.cursor = 'pointer'; }}}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={(hovered || isActive ? 0.95 : (isClickable ? 0.8 : 0.5)) * animatedOpacity}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={isClickable ? color : undefined}
          emissiveIntensity={isClickable ? 0.1 : 0}
        />
      </mesh>

      {isClickable && (
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[baseSize, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={(isActive ? 0.3 : 0.15) * animatedOpacity} />
        </mesh>
      )}

      {isClickable && (
        <Orbitals visible={orbitalIntensity > 0.01} intensity={orbitalIntensity} />
      )}

      {isClickable && hovered && label && (
        <Html position={[0, baseSize + 0.15, 0]} center style={{ color: 'white', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {label}
        </Html>
      )}
    </group>
  );
}
