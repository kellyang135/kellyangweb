"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function TestSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4fd1c5" emissive="#4fd1c5" emissiveIntensity={0.3} />
    </mesh>
  );
}

export default function CrystalCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <TestSphere />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
