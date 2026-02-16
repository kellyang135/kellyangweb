'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AtomProps {
  position: [number, number, number];
  type: 'corner' | 'face';
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Atom({ position, type, label, isActive, onClick }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isClickable = type === 'face';
  const baseSize = type === 'corner' ? 0.08 : 0.12;
  const color = type === 'corner' ? '#4fd1c5' : '#68d391';

  // Subtle pulse for clickable atoms
  useFrame((state) => {
    if (meshRef.current && isClickable && !isActive) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(1 + pulse);
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
          opacity={hovered || isActive ? 0.9 : 0.7}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {isClickable && (
        <mesh scale={1.5}>
          <sphereGeometry args={[baseSize, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.3 : 0.15} />
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
