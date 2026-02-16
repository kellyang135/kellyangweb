'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cornerAtoms, cubeEdges } from '@/lib/fccPositions';

interface CubeWireframeProps {
  animationProgress?: number; // 0 to 1
}

export default function CubeWireframe({ animationProgress = 1 }: CubeWireframeProps) {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const baseOpacity = 0.15;

  const cornerMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    cornerAtoms.forEach((atom) => map.set(atom.id, atom.position));
    return map;
  }, []);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    cubeEdges.forEach(([from, to]) => {
      const start = cornerMap.get(from);
      const end = cornerMap.get(to);
      if (start && end) {
        pts.push(new THREE.Vector3(...start));
        pts.push(new THREE.Vector3(...end));
      }
    });
    return pts;
  }, [cornerMap]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 });
  }, []);

  const lineSegments = useMemo(() => {
    return new THREE.LineSegments(geometry, material);
  }, [geometry, material]);

  // Animate opacity
  useFrame(() => {
    if (lineSegmentsRef.current) {
      const mat = lineSegmentsRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = baseOpacity * animationProgress;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive ref={lineSegmentsRef} object={lineSegments} />;
}
