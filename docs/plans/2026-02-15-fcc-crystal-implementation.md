# FCC Crystal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current SVG lattice with a proper 3D FCC crystal structure featuring glass-like atoms, rotation controls, and cube wireframe.

**Architecture:** Three.js scene with React Three Fiber, OrbitControls for rotation, MeshPhysicalMaterial for glass effect, Html labels from drei.

**Tech Stack:** Three.js, React Three Fiber, @react-three/drei, Framer Motion, Tailwind CSS

---

## Task 1: Create FCC Coordinate System

**Files:**
- Create: `lib/fccPositions.ts`

**Step 1: Create the coordinate calculator**

```typescript
// lib/fccPositions.ts

export interface FCCAtom {
  id: string;
  position: [number, number, number];
  type: 'corner' | 'face';
  label?: string;
  contentId?: string;
}

export interface FCCBond {
  from: string;
  to: string;
}

// Unit cube centered at origin, edge length = 2 (so corners at -1 and 1)
const HALF = 1;

// 8 corner atoms
export const cornerAtoms: FCCAtom[] = [
  { id: 'c0', position: [-HALF, -HALF, -HALF], type: 'corner' },
  { id: 'c1', position: [HALF, -HALF, -HALF], type: 'corner' },
  { id: 'c2', position: [-HALF, HALF, -HALF], type: 'corner' },
  { id: 'c3', position: [-HALF, -HALF, HALF], type: 'corner' },
  { id: 'c4', position: [HALF, HALF, -HALF], type: 'corner' },
  { id: 'c5', position: [HALF, -HALF, HALF], type: 'corner' },
  { id: 'c6', position: [-HALF, HALF, HALF], type: 'corner' },
  { id: 'c7', position: [HALF, HALF, HALF], type: 'corner' },
];

// 6 face-centered atoms (clickable, with content)
export const faceAtoms: FCCAtom[] = [
  { id: 'kelly', position: [0, 0, -HALF], type: 'face', label: 'Kelly Yang', contentId: 'kelly' },
  { id: 'contact', position: [0, 0, HALF], type: 'face', label: 'Contact', contentId: 'contact' },
  { id: 'projects', position: [0, -HALF, 0], type: 'face', label: 'Projects', contentId: 'projects' },
  { id: 'education', position: [0, HALF, 0], type: 'face', label: 'Education', contentId: 'education' },
  { id: 'research', position: [-HALF, 0, 0], type: 'face', label: 'Research', contentId: 'research' },
  { id: 'industry', position: [HALF, 0, 0], type: 'face', label: 'Industry', contentId: 'industry' },
];

export const allAtoms: FCCAtom[] = [...cornerAtoms, ...faceAtoms];

// Bonds: each face atom connects to its 4 adjacent corners
export const bonds: FCCBond[] = [
  // Front face (z = -HALF) connects to 4 front corners
  { from: 'kelly', to: 'c0' }, { from: 'kelly', to: 'c1' },
  { from: 'kelly', to: 'c2' }, { from: 'kelly', to: 'c4' },
  // Back face (z = HALF) connects to 4 back corners
  { from: 'contact', to: 'c3' }, { from: 'contact', to: 'c5' },
  { from: 'contact', to: 'c6' }, { from: 'contact', to: 'c7' },
  // Bottom face (y = -HALF) connects to 4 bottom corners
  { from: 'projects', to: 'c0' }, { from: 'projects', to: 'c1' },
  { from: 'projects', to: 'c3' }, { from: 'projects', to: 'c5' },
  // Top face (y = HALF) connects to 4 top corners
  { from: 'education', to: 'c2' }, { from: 'education', to: 'c4' },
  { from: 'education', to: 'c6' }, { from: 'education', to: 'c7' },
  // Left face (x = -HALF) connects to 4 left corners
  { from: 'research', to: 'c0' }, { from: 'research', to: 'c2' },
  { from: 'research', to: 'c3' }, { from: 'research', to: 'c6' },
  // Right face (x = HALF) connects to 4 right corners
  { from: 'industry', to: 'c1' }, { from: 'industry', to: 'c4' },
  { from: 'industry', to: 'c5' }, { from: 'industry', to: 'c7' },
];

// Cube wireframe edges (12 edges)
export const cubeEdges: [string, string][] = [
  // Bottom face edges
  ['c0', 'c1'], ['c1', 'c5'], ['c5', 'c3'], ['c3', 'c0'],
  // Top face edges
  ['c2', 'c4'], ['c4', 'c7'], ['c7', 'c6'], ['c6', 'c2'],
  // Vertical edges
  ['c0', 'c2'], ['c1', 'c4'], ['c5', 'c7'], ['c3', 'c6'],
];
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add lib/fccPositions.ts
git commit -m "feat: add FCC crystal coordinate system"
```

---

## Task 2: Create Glass Atom Component

**Files:**
- Create: `components/Crystal/Atom.tsx`

**Step 1: Create directory and component**

```bash
mkdir -p components/Crystal
```

```tsx
// components/Crystal/Atom.tsx
'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AtomProps {
  position: [number, number, number];
  type: 'corner' | 'face';
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Atom({ position, type, label, isActive, onClick }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isClickable = type === 'face';
  const baseSize = type === 'corner' ? 0.08 : 0.12;
  const color = type === 'corner' ? '#4fd1c5' : '#68d391';

  // Subtle pulse for clickable atoms
  useFrame((state) => {
    if (meshRef.current && isClickable && !isActive) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(1 + pulse);
    }
  });

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={isClickable ? onClick : undefined}
        onPointerOver={() => isClickable && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={hovered || isActive ? 0.9 : 0.7}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Glow effect for clickable */}
      {isClickable && (
        <mesh scale={1.5}>
          <sphereGeometry args={[baseSize, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 0.3 : 0.15}
          />
        </mesh>
      )}

      {/* Label on hover */}
      {isClickable && hovered && label && (
        <Html
          position={[0, baseSize + 0.15, 0]}
          center
          style={{
            color: 'white',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {label}
        </Html>
      )}
    </group>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add components/Crystal/Atom.tsx
git commit -m "feat: add glass Atom component with hover labels"
```

---

## Task 3: Create Bond Component

**Files:**
- Create: `components/Crystal/Bond.tsx`

**Step 1: Create the bond component**

```tsx
// components/Crystal/Bond.tsx
'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity?: number;
}

export default function Bond({ start, end, opacity = 0.2 }: BondProps) {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </line>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add components/Crystal/Bond.tsx
git commit -m "feat: add Bond component for atom connections"
```

---

## Task 4: Create Cube Wireframe Component

**Files:**
- Create: `components/Crystal/CubeWireframe.tsx`

**Step 1: Create the wireframe**

```tsx
// components/Crystal/CubeWireframe.tsx
'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { cornerAtoms, cubeEdges } from '@/lib/fccPositions';

export default function CubeWireframe() {
  // Create a map of corner positions
  const cornerMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    cornerAtoms.forEach((atom) => map.set(atom.id, atom.position));
    return map;
  }, []);

  // Create line segments for all edges
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

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </lineSegments>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add components/Crystal/CubeWireframe.tsx
git commit -m "feat: add CubeWireframe component"
```

---

## Task 5: Create Main Crystal Scene

**Files:**
- Create: `components/Crystal/Crystal.tsx`
- Create: `components/Crystal/index.ts`

**Step 1: Create the main Crystal component**

```tsx
// components/Crystal/Crystal.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Auto-rotate when panel is closed and not interacting
  useFrame((state, delta) => {
    if (groupRef.current && !isPanelOpen && controlsRef.current) {
      if (!controlsRef.current.enabled || controlsRef.current.autoRotate) {
        groupRef.current.rotation.y += delta * 0.2;
      }
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
        {/* Cube wireframe */}
        <CubeWireframe />

        {/* Bonds */}
        {bonds.map((bond, i) => {
          const start = atomMap.get(bond.from);
          const end = atomMap.get(bond.to);
          if (!start || !end) return null;
          return <Bond key={i} start={start} end={end} />;
        })}

        {/* Corner atoms (decorative) */}
        {cornerAtoms.map((atom) => (
          <Atom
            key={atom.id}
            position={atom.position}
            type="corner"
          />
        ))}

        {/* Face atoms (clickable) */}
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
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate={!isPanelOpen}
        autoRotateSpeed={0.5}
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
    <Canvas
      camera={{ position: [3, 2, 3], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <CrystalScene
        activeNode={activeNode}
        onNodeClick={onNodeClick}
        isPanelOpen={compressed}
      />
    </Canvas>
  );
}
```

**Step 2: Create barrel export**

```typescript
// components/Crystal/index.ts
export { default as Crystal } from './Crystal';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add components/Crystal/
git commit -m "feat: add Crystal scene with rotation controls"
```

---

## Task 6: Update Page to Use New Crystal

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update the page**

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import { Crystal } from '@/components/Crystal';
import { Panel } from '@/components/Panel';

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (activeNode === nodeId) {
      setActiveNode(null);
    } else {
      setActiveNode(nodeId);
    }
  };

  const handleClose = () => {
    setActiveNode(null);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-crystal-bg">
      {/* Crystal - compresses when panel is open */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          activeNode ? 'lg:right-[60%] sm:right-[80%]' : 'right-0'
        }`}
      >
        <Crystal
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          compressed={!!activeNode}
        />
      </div>

      {/* Panel */}
      <Panel activeNode={activeNode} onClose={handleClose} />
    </main>
  );
}
```

**Step 2: Run dev server and verify**

Run: `npm run dev`
Expected: 3D crystal visible, can rotate, click atoms opens panel

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate 3D FCC crystal with page"
```

---

## Task 7: Remove Old SVG Lattice Components

**Files:**
- Delete: `components/Lattice/` (entire directory)
- Delete: `lib/latticePositions.ts`

**Step 1: Remove old files**

```bash
rm -rf components/Lattice/
rm lib/latticePositions.ts
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old SVG lattice components"
```

---

## Task 8: Add Entry Animation

**Files:**
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Add staggered entry animation**

Update the Crystal scene to animate elements appearing:
1. Wireframe fades in first
2. Corner atoms fade in
3. Face atoms scale in with bounce
4. Bonds draw in

Use React state + useFrame to control animation timing.

**Step 2: Verify animation looks good**

Run dev server, refresh page, observe entry animation.

**Step 3: Commit**

```bash
git add components/Crystal/Crystal.tsx
git commit -m "feat: add staggered entry animation"
```

---

## Task 9: Polish Visual Details

**Files:**
- Modify: `components/Crystal/Atom.tsx`
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Refine glass material**

Adjust MeshPhysicalMaterial settings for better glass effect:
- Tweak clearcoat, roughness, metalness
- Add slight environment map reflection

**Step 2: Adjust sizes if needed**

Based on how it looks, tweak:
- Atom sizes
- Bond opacity
- Wireframe opacity

**Step 3: Ensure cursor changes**

Add `cursor: pointer` style when hovering clickable atoms.

**Step 4: Commit**

```bash
git add components/Crystal/
git commit -m "style: polish crystal visual details"
```

---

## Task 10: Final Verification

**Step 1: Run full build**

Run: `npm run build`

**Step 2: Manual testing checklist**

- [ ] 3D crystal renders with proper FCC structure
- [ ] 8 teal corner atoms visible
- [ ] 6 green face-centered atoms visible
- [ ] Cube wireframe visible (faint white edges)
- [ ] 24 bonds connecting face atoms to corners
- [ ] Auto-rotation works (slow, elegant)
- [ ] Drag to rotate works
- [ ] Hover shows labels on face atoms only
- [ ] Cursor changes to pointer on face atoms
- [ ] Click face atom → panel opens
- [ ] Rotation pauses when panel open
- [ ] Click different atom → content swaps
- [ ] Click X → panel closes, rotation resumes
- [ ] Entry animation plays on load
- [ ] Mobile bottom sheet works

**Step 3: Commit if any final fixes**

```bash
git add -A
git commit -m "feat: complete FCC crystal redesign"
```

---

## Summary

**10 Tasks Total:**
1. Create FCC coordinate system
2. Create glass Atom component
3. Create Bond component
4. Create CubeWireframe component
5. Create main Crystal scene
6. Update page to use new Crystal
7. Remove old SVG Lattice components
8. Add entry animation
9. Polish visual details
10. Final verification

**Key differences from previous implementation:**
- Three.js instead of SVG
- Proper 14-atom FCC structure
- Cube wireframe for clear geometry
- Orbit controls for rotation
- Glass material for atoms
