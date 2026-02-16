'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity?: number;
}

export default function Bond({ start, end, opacity = 0.2 }: BondProps) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity });
  }, [opacity]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />;
}
