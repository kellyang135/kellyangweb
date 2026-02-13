"use client";

import { useRef, useState, useEffect } from "react";
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
  const [scale, setScale] = useState(0);

  // Animate in on mount
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setScale(eased);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 0.85;
      materialRef.current.emissiveIntensity = glowIntensity * pulse;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position} scale={scale}>
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
