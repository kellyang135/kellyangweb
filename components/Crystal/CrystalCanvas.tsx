"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import Lattice from "./Lattice";
import { getAtomsForSection, AtomData } from "@/lib/crystalData";
import { useScroll } from "@/contexts/ScrollContext";

export default function CrystalCanvas() {
  const { scrollProgress, currentSection } = useScroll();

  const visibleAtomIds = useMemo(() => {
    // Get all atoms up to current section
    const visible = getAtomsForSection(currentSection as AtomData["section"]);
    return visible.map((a) => a.id);
  }, [currentSection]);

  // Slight camera movement based on scroll
  const cameraZ = 12 - scrollProgress * 2;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Lattice visibleAtomIds={visibleAtomIds} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
