"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lattice from "./Lattice";
import { atoms } from "@/lib/crystalData";

export default function CrystalCanvas() {
  // For now, show all atoms (will be scroll-controlled later)
  const allAtomIds = atoms.map((a) => a.id);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Lattice visibleAtomIds={allAtomIds} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
