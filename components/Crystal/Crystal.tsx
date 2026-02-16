'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Atom from './Atom';
import Bond from './Bond';
import CubeWireframe from './CubeWireframe';
import { allAtoms, bonds, faceAtoms, cornerAtoms } from '@/lib/fccPositions';

// Animation phases with timing (in seconds)
const ANIMATION_TIMING = {
  wireframe: { start: 0, duration: 0.5 },
  corners: { start: 0.3, duration: 0.3 },
  faces: { start: 0.5, duration: 0.4 },
  bonds: { start: 0.7, duration: 0.3 },
};

interface AnimationState {
  wireframe: number; // 0 to 1
  corners: number;
  faces: number;
  bonds: number;
}

interface CrystalSceneProps {
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
  isPanelOpen: boolean;
}

function CrystalScene({ activeNode, onNodeClick, isPanelOpen }: CrystalSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animState, setAnimState] = useState<AnimationState>({
    wireframe: 0,
    corners: 0,
    faces: 0,
    bonds: 0,
  });
  const startTimeRef = useRef<number | null>(null);

  // Entry animation using useFrame
  useFrame((state) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;

    // Calculate progress for each phase
    const calcProgress = (phase: { start: number; duration: number }) => {
      if (elapsed < phase.start) return 0;
      if (elapsed > phase.start + phase.duration) return 1;
      return (elapsed - phase.start) / phase.duration;
    };

    const newState = {
      wireframe: calcProgress(ANIMATION_TIMING.wireframe),
      corners: calcProgress(ANIMATION_TIMING.corners),
      faces: calcProgress(ANIMATION_TIMING.faces),
      bonds: calcProgress(ANIMATION_TIMING.bonds),
    };

    // Only update if values changed
    if (
      newState.wireframe !== animState.wireframe ||
      newState.corners !== animState.corners ||
      newState.faces !== animState.faces ||
      newState.bonds !== animState.bonds
    ) {
      setAnimState(newState);
    }
  });

  // Auto-rotate when panel is closed (very slow, elegant)
  useFrame((state, delta) => {
    if (groupRef.current && !isPanelOpen) {
      groupRef.current.rotation.y += delta * 0.03;
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
        <CubeWireframe animationProgress={animState.wireframe} />

        {bonds.map((bond, i) => {
          const start = atomMap.get(bond.from);
          const end = atomMap.get(bond.to);
          if (!start || !end) return null;
          return <Bond key={i} start={start} end={end} animationProgress={animState.bonds} />;
        })}

        {cornerAtoms.map((atom) => (
          <Atom key={atom.id} position={atom.position} type="corner" animationProgress={animState.corners} />
        ))}

        {faceAtoms.map((atom) => (
          <Atom
            key={atom.id}
            position={atom.position}
            type="face"
            label={atom.label}
            isActive={activeNode === atom.contentId}
            onClick={() => atom.contentId && onNodeClick(atom.contentId)}
            animationProgress={animState.faces}
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
