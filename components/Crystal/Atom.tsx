'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

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

  const isClickable = type === 'face';
  const baseSize = type === 'corner' ? 0.08 : 0.12;
  const color = type === 'corner' ? '#4fd1c5' : '#68d391';

  // Calculate animation values
  // Face atoms scale in with bounce, corner atoms fade in
  const isFace = type === 'face';
  const animatedScale = isFace ? easeOutBack(Math.min(animationProgress, 1)) : animationProgress;
  const animatedOpacity = animationProgress;

  // Subtle pulse for clickable atoms + animation
  useFrame((state) => {
    if (meshRef.current) {
      if (isClickable && !isActive && animationProgress >= 1) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02;
        meshRef.current.scale.setScalar(animatedScale * (1 + pulse));
      } else {
        meshRef.current.scale.setScalar(animatedScale);
      }
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(animatedScale * 1.5);
    }
  });

  return (
    <group position={position}>
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
          opacity={(hovered || isActive ? 0.9 : 0.7) * animatedOpacity}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {isClickable && (
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[baseSize, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={(isActive ? 0.3 : 0.15) * animatedOpacity} />
        </mesh>
      )}

      {isClickable && hovered && label && (
        <Html position={[0, baseSize + 0.15, 0]} center style={{ color: 'white', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {label}
        </Html>
      )}
    </group>
  );
}
