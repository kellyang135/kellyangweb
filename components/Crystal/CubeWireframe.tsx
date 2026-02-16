'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { cornerAtoms, cubeEdges } from '@/lib/fccPositions';

export default function CubeWireframe() {
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
    return new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.15 });
  }, []);

  const lineSegments = useMemo(() => {
    return new THREE.LineSegments(geometry, material);
  }, [geometry, material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={lineSegments} />;
}
