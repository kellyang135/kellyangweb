'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity?: number;
  animationProgress?: number; // 0 to 1
}

export default function Bond({ start, end, opacity = 0.2, animationProgress = 1 }: BondProps) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 });
  }, []);

  // Animate opacity
  useFrame(() => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = opacity * animationProgress;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />;
}
