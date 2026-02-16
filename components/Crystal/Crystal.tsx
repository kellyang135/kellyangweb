'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Atom from './Atom';
import Bond from './Bond';
import CubeWireframe from './CubeWireframe';
import { allAtoms, bonds, faceAtoms, cornerAtoms } from '@/lib/fccPositions';

interface CrystalSceneProps {
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
  isPanelOpen: boolean;
}

function CrystalScene({ activeNode, onNodeClick, isPanelOpen }: CrystalSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate when panel is closed
  useFrame((state, delta) => {
    if (groupRef.current && !isPanelOpen) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Create atom position map for bonds
  const atomMap = new Map<string, [number, number, number]>();
  allAtoms.forEach((atom) => atomMap.set(atom.id, atom.position));

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <group ref={groupRef}>
        <CubeWireframe />

        {bonds.map((bond, i) => {
          const start = atomMap.get(bond.from);
          const end = atomMap.get(bond.to);
          if (!start || !end) return null;
          return <Bond key={i} start={start} end={end} />;
        })}

        {cornerAtoms.map((atom) => (
          <Atom key={atom.id} position={atom.position} type="corner" />
        ))}

        {faceAtoms.map((atom) => (
          <Atom
            key={atom.id}
            position={atom.position}
            type="face"
            label={atom.label}
            isActive={activeNode === atom.contentId}
            onClick={() => atom.contentId && onNodeClick(atom.contentId)}
          />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.05}
        enabled={!isPanelOpen}
      />
    </>
  );
}

interface CrystalProps {
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
  compressed?: boolean;
}

export default function Crystal({ activeNode, onNodeClick, compressed = false }: CrystalProps) {
  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 50 }} style={{ background: 'transparent' }}>
      <CrystalScene activeNode={activeNode} onNodeClick={onNodeClick} isPanelOpen={compressed} />
    </Canvas>
  );
}
