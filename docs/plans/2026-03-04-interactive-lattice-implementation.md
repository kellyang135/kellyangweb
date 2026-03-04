# Interactive Lattice Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio into a physics-reactive, immersive 3D experience with organic panel transitions.

**Architecture:** Zustand store for shared state (mouse position, animation phase). Three.js effects render in CrystalScene. Panel uses GSAP for crystal growth animation. All continuous effects in useFrame hooks with distance-based LOD.

**Tech Stack:** React Three Fiber, Zustand, GSAP, Framer Motion, Three.js instancing for particles.

---

## Task 1: Create Animation State Store

**Files:**
- Create: `lib/useAnimationStore.ts`

**Step 1: Create the Zustand store**

```typescript
// lib/useAnimationStore.ts
import { create } from 'zustand';
import * as THREE from 'three';

export type AnimationPhase = 'idle' | 'bursting' | 'transitioning' | 'open' | 'closing';

interface AnimationStore {
  // Mouse tracking
  mousePosition: THREE.Vector3;
  setMousePosition: (pos: THREE.Vector3) => void;

  // Animation phase
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;

  // Active atom info
  activeAtomPosition: THREE.Vector3 | null;
  activeAtomId: string | null;
  setActiveAtom: (id: string | null, position: THREE.Vector3 | null) => void;

  // Mobile detection
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;

  // Burst trigger (timestamp for triggering effects)
  burstTimestamp: number;
  triggerBurst: () => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  mousePosition: new THREE.Vector3(0, 0, 0),
  setMousePosition: (pos) => set({ mousePosition: pos }),

  phase: 'idle',
  setPhase: (phase) => set({ phase }),

  activeAtomPosition: null,
  activeAtomId: null,
  setActiveAtom: (id, position) => set({ activeAtomId: id, activeAtomPosition: position }),

  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),

  burstTimestamp: 0,
  triggerBurst: () => set({ burstTimestamp: Date.now() }),
}));
```

**Step 2: Verify it compiles**

Run: `cd /Users/kellyyang/kellyangweb/.worktrees/interactive-lattice && npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add lib/useAnimationStore.ts
git commit -m "feat: add Zustand animation state store"
```

---

## Task 2: Add Mouse Tracking to CrystalScene

**Files:**
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Add mouse tracking with raycasting**

Add imports at top of file:
```typescript
import { useAnimationStore } from '@/lib/useAnimationStore';
```

Add inside CrystalScene component, after existing refs:
```typescript
const raycaster = useRef(new THREE.Raycaster());
const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
const setMousePosition = useAnimationStore((s) => s.setMousePosition);

// Track mouse position in 3D space
useFrame(({ camera, pointer }) => {
  raycaster.current.setFromCamera(pointer, camera);
  const intersectPoint = new THREE.Vector3();
  raycaster.current.ray.intersectPlane(planeRef.current, intersectPoint);
  if (intersectPoint) {
    setMousePosition(intersectPoint);
  }
});
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Crystal/Crystal.tsx
git commit -m "feat: add mouse tracking to CrystalScene"
```

---

## Task 3: Create Background Particle System

**Files:**
- Create: `components/Crystal/Particles.tsx`
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Create Particles component**

```typescript
// components/Crystal/Particles.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';

const PARTICLE_COUNT = 40;
const PARTICLE_COUNT_MOBILE = 20;
const BOUNDS = 3;
const ATTRACTION_STRENGTH = 0.02;
const DRIFT_SPEED = 0.1;

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePosition = useAnimationStore((s) => s.mousePosition);
  const isMobile = useAnimationStore((s) => s.isMobile);

  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;

  // Initialize particle positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS * 2;
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * DRIFT_SPEED,
        (Math.random() - 0.5) * DRIFT_SPEED,
        (Math.random() - 0.5) * DRIFT_SPEED
      ));
    }
    return [pos, vel];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const particlePos = new THREE.Vector3(posArray[idx], posArray[idx + 1], posArray[idx + 2]);

      // Calculate distance to mouse
      const toMouse = mousePosition.clone().sub(particlePos);
      const distance = toMouse.length();

      // Attraction when close to cursor (within 2 units)
      if (distance < 2 && distance > 0.1) {
        const attraction = toMouse.normalize().multiplyScalar(ATTRACTION_STRENGTH * (1 - distance / 2));
        velocities[i].add(attraction);
      }

      // Apply velocity with damping
      velocities[i].multiplyScalar(0.98);

      // Random drift
      velocities[i].x += (Math.random() - 0.5) * 0.001;
      velocities[i].y += (Math.random() - 0.5) * 0.001;
      velocities[i].z += (Math.random() - 0.5) * 0.001;

      // Update position
      posArray[idx] += velocities[i].x;
      posArray[idx + 1] += velocities[i].y;
      posArray[idx + 2] += velocities[i].z;

      // Wrap around bounds
      for (let j = 0; j < 3; j++) {
        if (posArray[idx + j] > BOUNDS) posArray[idx + j] = -BOUNDS;
        if (posArray[idx + j] < -BOUNDS) posArray[idx + j] = BOUNDS;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4fd1c5"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

**Step 2: Add Particles to CrystalScene**

In `components/Crystal/Crystal.tsx`, add import:
```typescript
import Particles from './Particles';
```

Add `<Particles />` inside the return statement, before the `<group ref={groupRef}>`:
```typescript
<Particles />
```

**Step 3: Verify build and test visually**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add components/Crystal/Particles.tsx components/Crystal/Crystal.tsx
git commit -m "feat: add cursor-reactive particle system"
```

---

## Task 4: Add Magnetic Attraction to Atoms

**Files:**
- Modify: `components/Crystal/Atom.tsx`

**Step 1: Add cursor proximity effects**

Add import:
```typescript
import { useAnimationStore } from '@/lib/useAnimationStore';
```

Add inside Atom component, after existing state:
```typescript
const mousePosition = useAnimationStore((s) => s.mousePosition);
const groupRef = useRef<THREE.Group>(null);
const originalPosition = useRef(new THREE.Vector3(...position));
const currentOffset = useRef(new THREE.Vector3(0, 0, 0));
```

Replace the existing `useFrame` with:
```typescript
useFrame((state) => {
  if (!groupRef.current || !meshRef.current) return;

  // Calculate distance to mouse
  const atomWorldPos = originalPosition.current.clone();
  const toMouse = mousePosition.clone().sub(atomWorldPos);
  const distance = toMouse.length();

  // Magnetic attraction (subtle drift toward cursor)
  const attractionRadius = 1.5;
  if (distance < attractionRadius && distance > 0.1) {
    const strength = 0.03 * (1 - distance / attractionRadius);
    const targetOffset = toMouse.normalize().multiplyScalar(strength);
    currentOffset.current.lerp(targetOffset, 0.1);
  } else {
    currentOffset.current.lerp(new THREE.Vector3(0, 0, 0), 0.05);
  }

  // Apply offset to group position
  groupRef.current.position.set(
    position[0] + currentOffset.current.x,
    position[1] + currentOffset.current.y,
    position[2] + currentOffset.current.z
  );

  // Proximity glow (increase scale and brightness when cursor near)
  const proximityGlow = distance < attractionRadius ? (1 - distance / attractionRadius) * 0.1 : 0;

  // Pulse animation for clickable atoms
  if (isClickable && !isActive && animationProgress >= 1) {
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    meshRef.current.scale.setScalar(animatedScale * (1 + pulse + proximityGlow));
  } else {
    meshRef.current.scale.setScalar(animatedScale * (1 + proximityGlow));
  }

  if (glowRef.current) {
    glowRef.current.scale.setScalar(animatedScale * (1.5 + proximityGlow * 2));
  }
});
```

Change the root `<group position={position}>` to use the ref:
```typescript
<group ref={groupRef}>
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Crystal/Atom.tsx
git commit -m "feat: add magnetic cursor attraction to atoms"
```

---

## Task 5: Add Energy Flow to Bonds

**Files:**
- Modify: `components/Crystal/Bond.tsx`

**Step 1: Add cursor-reactive glow to bonds**

Add import:
```typescript
import { useAnimationStore } from '@/lib/useAnimationStore';
```

Add inside Bond component:
```typescript
const mousePosition = useAnimationStore((s) => s.mousePosition);
const midpoint = useMemo(() => {
  return new THREE.Vector3(
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  );
}, [start, end]);
```

Replace the existing `useFrame`:
```typescript
useFrame(() => {
  if (lineRef.current) {
    const mat = lineRef.current.material as THREE.LineBasicMaterial;

    // Calculate distance from mouse to bond midpoint
    const distance = mousePosition.distanceTo(midpoint);
    const proximityBoost = distance < 1.5 ? (1 - distance / 1.5) * 0.3 : 0;

    mat.opacity = (opacity + proximityBoost) * animationProgress;
  }
});
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Crystal/Bond.tsx
git commit -m "feat: add cursor-reactive glow to bonds"
```

---

## Task 6: Create Electron Orbitals Component

**Files:**
- Create: `components/Crystal/Orbitals.tsx`
- Modify: `components/Crystal/Atom.tsx`

**Step 1: Create Orbitals component**

```typescript
// components/Crystal/Orbitals.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalsProps {
  visible: boolean;
  intensity: number; // 0 to 1
}

export default function Orbitals({ visible, intensity }: OrbitalsProps) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const electron1Ref = useRef<THREE.Mesh>(null);
  const electron2Ref = useRef<THREE.Mesh>(null);

  const orbitRadius = 0.2;

  // Create orbital ring geometry
  const ringGeometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(64);
    return new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate orbital planes
    if (group1Ref.current) {
      group1Ref.current.rotation.z = time * 0.5;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.z = -time * 0.7;
    }

    // Move electrons along orbits
    if (electron1Ref.current) {
      electron1Ref.current.position.x = Math.cos(time * 2) * orbitRadius;
      electron1Ref.current.position.y = Math.sin(time * 2) * orbitRadius;
    }
    if (electron2Ref.current) {
      electron2Ref.current.position.x = Math.cos(time * 2.5 + Math.PI) * orbitRadius;
      electron2Ref.current.position.y = Math.sin(time * 2.5 + Math.PI) * orbitRadius;
    }
  });

  if (!visible || intensity < 0.01) return null;

  return (
    <group>
      {/* Orbital 1 - tilted */}
      <group ref={group1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <line geometry={ringGeometry}>
          <lineBasicMaterial color="#81e6d9" transparent opacity={0.4 * intensity} />
        </line>
        <mesh ref={electron1Ref}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={intensity} />
        </mesh>
      </group>

      {/* Orbital 2 - different tilt */}
      <group ref={group2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <line geometry={ringGeometry}>
          <lineBasicMaterial color="#7ee8a8" transparent opacity={0.3 * intensity} />
        </line>
        <mesh ref={electron2Ref}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={intensity} />
        </mesh>
      </group>
    </group>
  );
}
```

**Step 2: Add Orbitals to face atoms**

In `components/Crystal/Atom.tsx`, add import:
```typescript
import Orbitals from './Orbitals';
```

Add state for orbital visibility:
```typescript
const [orbitalIntensity, setOrbitalIntensity] = useState(0);
```

Inside the useFrame, after proximity calculations, add:
```typescript
// Update orbital intensity based on proximity or active state
const targetOrbitalIntensity = isActive ? 1 : (distance < 1.2 ? (1 - distance / 1.2) : 0);
setOrbitalIntensity(prev => prev + (targetOrbitalIntensity - prev) * 0.1);
```

Add Orbitals inside the group, after the glow mesh:
```typescript
{isClickable && (
  <Orbitals visible={orbitalIntensity > 0.01} intensity={orbitalIntensity} />
)}
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add components/Crystal/Orbitals.tsx components/Crystal/Atom.tsx
git commit -m "feat: add electron orbitals to face atoms"
```

---

## Task 7: Create Shockwave Effect Component

**Files:**
- Create: `components/Crystal/ShockWave.tsx`
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Create ShockWave component**

```typescript
// components/Crystal/ShockWave.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/lib/useAnimationStore';

export default function ShockWave() {
  const ringRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const burstTimestamp = useAnimationStore((s) => s.burstTimestamp);
  const activeAtomPosition = useAnimationStore((s) => s.activeAtomPosition);
  const startPosition = useRef<THREE.Vector3 | null>(null);

  // Trigger on burst
  useEffect(() => {
    if (burstTimestamp > 0 && activeAtomPosition) {
      startPosition.current = activeAtomPosition.clone();
      setActive(true);
      setProgress(0);
    }
  }, [burstTimestamp, activeAtomPosition]);

  useFrame((state, delta) => {
    if (!active || !ringRef.current || !startPosition.current) return;

    // Animate expansion
    const newProgress = progress + delta * 2.5; // ~400ms total
    setProgress(newProgress);

    if (newProgress >= 1) {
      setActive(false);
      return;
    }

    // Expand ring
    const scale = 0.1 + newProgress * 2.5;
    ringRef.current.scale.setScalar(scale);

    // Fade out
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - newProgress) * 0.6;

    // Position at burst origin
    ringRef.current.position.copy(startPosition.current);
  });

  if (!active) return null;

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial
        color="#81e6d9"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

**Step 2: Add ShockWave to CrystalScene**

In `components/Crystal/Crystal.tsx`, add import:
```typescript
import ShockWave from './ShockWave';
```

Add inside the return, after `<Particles />`:
```typescript
<ShockWave />
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add components/Crystal/ShockWave.tsx components/Crystal/Crystal.tsx
git commit -m "feat: add shockwave burst effect"
```

---

## Task 8: Wire Up Animation State on Atom Click

**Files:**
- Modify: `components/Crystal/Atom.tsx`
- Modify: `app/page.tsx`

**Step 1: Update Atom to trigger burst on click**

In `components/Crystal/Atom.tsx`, add to imports:
```typescript
const { setActiveAtom, triggerBurst, setPhase } = useAnimationStore();
```

Replace the onClick handler on the mesh:
```typescript
onClick={isClickable ? (e) => {
  e.stopPropagation();
  const worldPos = new THREE.Vector3(...position);
  setActiveAtom(label || null, worldPos);
  triggerBurst();
  setPhase('bursting');

  // Transition to 'transitioning' after burst
  setTimeout(() => setPhase('transitioning'), 400);

  // Call original onClick
  onClick?.();
} : undefined}
```

**Step 2: Update page.tsx to use animation phases**

In `app/page.tsx`, add import:
```typescript
import { useAnimationStore } from '@/lib/useAnimationStore';
```

Add inside Home component:
```typescript
const phase = useAnimationStore((s) => s.phase);
const setPhase = useAnimationStore((s) => s.setPhase);
```

Update handleClose:
```typescript
const handleClose = () => {
  setPhase('closing');
  setTimeout(() => {
    setActiveNode(null);
    setPhase('idle');
  }, 600);
};
```

Update handleNodeClick to set 'open' phase:
```typescript
const handleNodeClick = (nodeId: string) => {
  if (activeNode === nodeId) {
    handleClose();
  } else {
    setActiveNode(nodeId);
    // Phase transitions happen in Atom component
    setTimeout(() => setPhase('open'), 900);
  }
};
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add components/Crystal/Atom.tsx app/page.tsx
git commit -m "feat: wire animation state to atom clicks"
```

---

## Task 9: Add Crystal Growth Panel Animation

**Files:**
- Modify: `components/Panel/Panel.tsx`

**Step 1: Replace slide animation with crystal growth**

Replace the entire Panel component with enhanced version:

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useAnimationStore } from '@/lib/useAnimationStore';
import AboutContent from './sections/AboutContent';
import ResearchContent from './sections/ResearchContent';
import IndustryContent from './sections/IndustryContent';
import ProjectsContent from './sections/ProjectsContent';
import EducationContent from './sections/EducationContent';
import ContactContent from './sections/ContactContent';

interface PanelProps {
  activeNode: string | null;
  onClose: () => void;
}

const contentMap: Record<string, React.ComponentType> = {
  kelly: AboutContent,
  research: ResearchContent,
  industry: IndustryContent,
  projects: ProjectsContent,
  education: EducationContent,
  contact: ContactContent,
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function Panel({ activeNode, onClose }: PanelProps) {
  const Content = activeNode ? contentMap[activeNode] : null;
  const isDesktop = useIsDesktop();
  const phase = useAnimationStore((s) => s.phase);

  // Crystal growth animation - starts thin, expands to full width
  const panelVariants = {
    initial: isDesktop
      ? { scaleX: 0, opacity: 0, originX: 1 }
      : { scaleY: 0, opacity: 0, originY: 1 },
    animate: isDesktop
      ? { scaleX: 1, opacity: 1, originX: 1 }
      : { scaleY: 1, opacity: 1, originY: 1 },
    exit: isDesktop
      ? { scaleX: 0, opacity: 0, originX: 1 }
      : { scaleY: 0, opacity: 0, originY: 1 },
  };

  const showPanel = phase === 'transitioning' || phase === 'open';

  return (
    <AnimatePresence>
      {activeNode && Content && showPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Crystal growth panel */}
          <motion.div
            initial={panelVariants.initial}
            animate={panelVariants.animate}
            exit={panelVariants.exit}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1], // Custom easing for crystal feel
            }}
            className="fixed z-50 bg-[#12121a]/95 border-white/10 backdrop-blur-xl
              inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t
              lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto lg:w-[60%] lg:h-full lg:rounded-none lg:border-l lg:border-t-0"
            style={{
              boxShadow: '0 0 60px rgba(79, 209, 197, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Crystalline edge glow */}
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-teal-400/30 to-transparent lg:block hidden" />

            {/* Drag handle - mobile only */}
            <div className="lg:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Close button - hexagonal style */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:rotate-90 transition-all duration-300 z-10 border border-white/10"
              aria-label="Close panel"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            {/* Content with crystallize animation */}
            <div className="h-full overflow-y-auto p-6 pt-4 lg:p-8 lg:pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', y: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2, // Wait for panel to grow
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Content />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Panel/Panel.tsx
git commit -m "feat: add crystal growth panel animation"
```

---

## Task 10: Add Content Block Crystallization

**Files:**
- Create: `components/Panel/ContentBlock.tsx`
- Modify: `components/Panel/sections/ExperienceCard.tsx`

**Step 1: Create ContentBlock wrapper**

```typescript
// components/Panel/ContentBlock.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentBlockProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ContentBlock({ children, delay = 0, className = '' }: ContentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{
        duration: 0.3,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Update ExperienceCard with animated border**

In `components/Panel/sections/ExperienceCard.tsx`, add:

```typescript
import { motion } from 'framer-motion';
```

Wrap the card content and add animated border:

Replace the outer div with:
```typescript
<motion.div
  className={`relative pl-4 border-l-2 ${accentColor}`}
  initial={{ borderColor: 'transparent' }}
  animate={{ borderColor: undefined }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  <motion.div
    className="absolute left-0 top-0 bottom-0 w-0.5"
    style={{ backgroundColor: 'currentColor' }}
    initial={{ scaleY: 0, originY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
  />
  {/* existing content */}
</motion.div>
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add components/Panel/ContentBlock.tsx components/Panel/sections/ExperienceCard.tsx
git commit -m "feat: add content crystallization animations"
```

---

## Task 11: Add Mobile Detection

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add mobile detection on mount**

Add to imports:
```typescript
import { useEffect } from 'react';
```

Add inside Home component:
```typescript
const setIsMobile = useAnimationStore((s) => s.setIsMobile);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, [setIsMobile]);
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add mobile detection for performance scaling"
```

---

## Task 12: Smooth Cube Drift Animation

**Files:**
- Modify: `components/Crystal/Crystal.tsx`

**Step 1: Add smooth position transition when panel opens**

In CrystalScene, add state for target position:
```typescript
const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
const phase = useAnimationStore((s) => s.phase);
```

Add useFrame for smooth drift:
```typescript
useFrame(() => {
  if (!groupRef.current) return;

  // Set target based on phase
  if (phase === 'open' || phase === 'transitioning') {
    targetPosition.current.set(-0.5, 0, 0); // Drift left when panel open
  } else {
    targetPosition.current.set(0, 0, 0);
  }

  // Smooth interpolation
  currentPosition.current.lerp(targetPosition.current, 0.05);
  groupRef.current.position.copy(currentPosition.current);
});
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Crystal/Crystal.tsx
git commit -m "feat: add smooth cube drift when panel opens"
```

---

## Task 13: Final Polish and Integration Test

**Files:**
- All modified files

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run dev server and manually test**

Run: `npm run dev`

Test checklist:
- [ ] Particles drift and react to cursor
- [ ] Atoms have magnetic attraction to cursor
- [ ] Bonds glow when cursor nearby
- [ ] Orbitals appear on face atoms near cursor
- [ ] Click atom triggers shockwave burst
- [ ] Panel grows instead of sliding
- [ ] Content crystallizes in with blur effect
- [ ] Close button rotates on hover
- [ ] Panel close reverses gracefully
- [ ] Cube drifts smoothly when panel opens/closes
- [ ] Mobile: reduced particles, effects scale down

**Step 3: Commit final state**

```bash
git add -A
git commit -m "polish: complete interactive lattice upgrade"
```

---

## Summary

This plan implements:
1. **Zustand store** for animation state management
2. **Mouse tracking** via raycasting in 3D space
3. **Particle system** with cursor attraction
4. **Magnetic atoms** that drift toward cursor
5. **Reactive bonds** that glow near cursor
6. **Electron orbitals** on face atoms
7. **Shockwave burst** on atom click
8. **Crystal growth panel** instead of slide
9. **Content crystallization** with blur-to-sharp effect
10. **Smooth cube drift** when panel opens
11. **Mobile optimization** with reduced effects

Total: 13 tasks, each 2-10 minutes.
