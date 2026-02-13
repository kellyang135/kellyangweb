"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtomProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  glowIntensity?: number;
  pulseSpeed?: number;
}

export default function Atom({
  position,
  size = 0.3,
  color = "#4fd1c5",
  glowIntensity = 0.5,
  pulseSpeed = 1,
}: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 0.85;
      materialRef.current.emissiveIntensity = glowIntensity * pulse;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={glowIntensity}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}
