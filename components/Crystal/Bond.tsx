'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity?: number;
  animationProgress?: number; // 0 to 1
}

export default function Bond({ start, end, opacity = 0.2, animationProgress = 1 }: BondProps) {
  const lineRef = useRef<THREE.Line>(null);
  const mousePosition = useAnimationStore((s) => s.mousePosition);
  const midpoint = useMemo(() => {
    return new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    );
  }, [start, end]);

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

      // Calculate distance from mouse to bond midpoint
      const distance = mousePosition.distanceTo(midpoint);
      const proximityBoost = distance < 1.5 ? (1 - distance / 1.5) * 0.3 : 0;

      mat.opacity = (opacity + proximityBoost) * animationProgress;
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
