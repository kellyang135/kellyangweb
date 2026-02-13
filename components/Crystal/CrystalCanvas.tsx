"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo, useState, useCallback } from "react";
import Lattice from "./Lattice";
import { getAtomsForSection, AtomData } from "@/lib/crystalData";
import { useScroll } from "@/contexts/ScrollContext";
import { easterEggMessage } from "@/lib/easterEgg";

function EasterEggTrigger({ onTrigger }: { onTrigger: () => void }) {
  return (
    <mesh position={[0, 0, 0]} onClick={onTrigger}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function CrystalCanvas() {
  const { scrollProgress, currentSection } = useScroll();
  const [useBCC, setUseBCC] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleEasterEgg = useCallback(() => {
    setUseBCC((prev) => !prev);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  }, []);

  const visibleAtomIds = useMemo(() => {
    const visible = getAtomsForSection(currentSection as AtomData["section"]);
    return visible.map((a) => a.id);
  }, [currentSection]);

  const cameraZ = 12 - scrollProgress * 2;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Lattice visibleAtomIds={visibleAtomIds} useBCC={useBCC} />
        <EasterEggTrigger onTrigger={handleEasterEgg} />
        {showMessage && (
          <Html center position={[0, -3, 0]}>
            <div className="glass-panel px-4 py-2 text-sm text-crystal-atom whitespace-nowrap">
              {useBCC ? easterEggMessage : "Back to FCC (Face-Centered Cubic)!"}
            </div>
          </Html>
        )}
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
