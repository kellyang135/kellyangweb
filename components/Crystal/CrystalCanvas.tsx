"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Atom from "./Atom";
import Bond from "./Bond";

export default function CrystalCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Central atom */}
        <Atom position={[0, 0, 0]} size={0.5} pulseSpeed={0.8} />

        {/* Test surrounding atoms */}
        <Atom position={[2, 0, 0]} size={0.3} />
        <Atom position={[-2, 0, 0]} size={0.3} />
        <Atom position={[0, 2, 0]} size={0.3} />

        {/* Test bonds */}
        <Bond start={[0, 0, 0]} end={[2, 0, 0]} />
        <Bond start={[0, 0, 0]} end={[-2, 0, 0]} />
        <Bond start={[0, 0, 0]} end={[0, 2, 0]} />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
