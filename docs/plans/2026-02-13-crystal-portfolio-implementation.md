# Crystal Lattice Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a scroll-driven portfolio website where a crystal lattice assembles as visitors explore Kelly's materials science career.

**Architecture:** Next.js app with Three.js for 3D crystal rendering, GSAP ScrollTrigger for scroll-based animations, and Tailwind CSS for styling. The crystal is rendered in a full-screen canvas that responds to scroll position, with content overlaid in glassmorphic panels.

**Tech Stack:** Next.js 14, TypeScript, Three.js, React Three Fiber, GSAP + ScrollTrigger, Tailwind CSS

**Design Reference:** See `docs/plans/2026-02-13-crystal-portfolio-design.md` for full design specs.

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

**Step 1: Create Next.js app with TypeScript and Tailwind**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
When prompted, accept defaults.

**Step 2: Verify installation**

Run: `npm run dev`
Expected: App runs at http://localhost:3000

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Install 3D and Animation Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Three.js ecosystem**

Run:
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

**Step 2: Install GSAP with ScrollTrigger**

Run:
```bash
npm install gsap @gsap/react
```

**Step 3: Verify dependencies**

Run: `npm run dev`
Expected: No errors, app still runs

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Three.js, React Three Fiber, and GSAP dependencies"
```

---

### Task 3: Set Up Global Styles and Theme

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Update Tailwind config with custom colors**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crystal: {
          bg: "#0a0a14",
          atom: "#4fd1c5",
          atomGlow: "#81e6d9",
          bond: "#ffffff20",
          accent: "#f6ad55",
          text: "#f7fafc",
          muted: "#a0aec0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Update global styles**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --crystal-bg: #0a0a14;
  --crystal-atom: #4fd1c5;
  --crystal-atom-glow: #81e6d9;
  --crystal-bond: rgba(255, 255, 255, 0.125);
  --crystal-accent: #f6ad55;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--crystal-bg);
  color: #f7fafc;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Glassmorphism panel */
.glass-panel {
  background: rgba(10, 10, 20, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Hide scrollbar but allow scrolling */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
```

**Step 3: Verify styles load**

Run: `npm run dev`
Expected: Dark background visible at localhost:3000

**Step 4: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "style: add crystal theme colors and glassmorphism styles"
```

---

## Phase 2: Crystal Foundation

### Task 4: Create Basic Three.js Canvas

**Files:**
- Create: `components/Crystal/CrystalCanvas.tsx`
- Modify: `app/page.tsx`

**Step 1: Create CrystalCanvas component**

Create `components/Crystal/CrystalCanvas.tsx`:
```typescript
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
```

**Step 2: Add canvas to page**

Replace `app/page.tsx`:
```typescript
import CrystalCanvas from "@/components/Crystal/CrystalCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CrystalCanvas />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-crystal-text">Kelly Yang</h1>
      </div>
    </main>
  );
}
```

**Step 3: Verify 3D renders**

Run: `npm run dev`
Expected: Teal glowing sphere visible with "Kelly Yang" text overlaid

**Step 4: Commit**

```bash
git add components/Crystal/CrystalCanvas.tsx app/page.tsx
git commit -m "feat: add basic Three.js canvas with test sphere"
```

---

### Task 5: Create Atom Component

**Files:**
- Create: `components/Crystal/Atom.tsx`
- Modify: `components/Crystal/CrystalCanvas.tsx`

**Step 1: Create Atom component with glow effect**

Create `components/Crystal/Atom.tsx`:
```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtomProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  glowIntensity?: number;
  pulseSpeed?: number;
}

export default function Atom({
  position,
  size = 0.3,
  color = "#4fd1c5",
  glowIntensity = 0.5,
  pulseSpeed = 1,
}: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 0.85;
      materialRef.current.emissiveIntensity = glowIntensity * pulse;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={glowIntensity}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}
```

**Step 2: Update CrystalCanvas to use Atom**

Replace `components/Crystal/CrystalCanvas.tsx`:
```typescript
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Atom from "./Atom";

export default function CrystalCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Atom position={[0, 0, 0]} size={0.5} pulseSpeed={0.8} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
```

**Step 3: Verify atom pulses**

Run: `npm run dev`
Expected: Single glowing, pulsing teal atom in center

**Step 4: Commit**

```bash
git add components/Crystal/Atom.tsx components/Crystal/CrystalCanvas.tsx
git commit -m "feat: add Atom component with pulsing glow effect"
```

---

### Task 6: Create Bond Component

**Files:**
- Create: `components/Crystal/Bond.tsx`
- Modify: `components/Crystal/CrystalCanvas.tsx`

**Step 1: Create Bond component (line between atoms)**

Create `components/Crystal/Bond.tsx`:
```typescript
"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}

export default function Bond({
  start,
  end,
  color = "#ffffff",
  opacity = 0.2,
}: BondProps) {
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}
```

**Step 2: Test bonds in CrystalCanvas**

Replace `components/Crystal/CrystalCanvas.tsx`:
```typescript
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
```

**Step 3: Verify bonds render**

Run: `npm run dev`
Expected: Central atom with 3 smaller atoms connected by faint white lines

**Step 4: Commit**

```bash
git add components/Crystal/Bond.tsx components/Crystal/CrystalCanvas.tsx
git commit -m "feat: add Bond component connecting atoms"
```

---

### Task 7: Create Crystal Lattice Data Structure

**Files:**
- Create: `lib/crystalData.ts`
- Create: `components/Crystal/Lattice.tsx`

**Step 1: Define crystal structure data**

Create `lib/crystalData.ts`:
```typescript
export interface AtomData {
  id: string;
  position: [number, number, number];
  size: number;
  label: string;
  category: "core" | "research" | "industry" | "project" | "education";
  section: "hero" | "about" | "experience" | "projects" | "education" | "contact";
  featured?: boolean;
}

export interface BondData {
  from: string;
  to: string;
}

// FCC-inspired lattice positions (will grow with scroll)
export const atoms: AtomData[] = [
  // Hero - Central atom (Kelly)
  { id: "kelly", position: [0, 0, 0], size: 0.6, label: "Kelly Yang", category: "core", section: "hero" },

  // About - First shell
  { id: "mse", position: [1.5, 1, 0], size: 0.35, label: "Materials Science", category: "core", section: "about" },
  { id: "eecs", position: [-1.5, 1, 0], size: 0.35, label: "EECS", category: "core", section: "about" },
  { id: "berkeley", position: [0, 1.8, 0], size: 0.4, label: "UC Berkeley", category: "education", section: "about" },

  // Experience - Research
  { id: "khan-lab", position: [2.5, 0, 1], size: 0.45, label: "Khan Lab", category: "research", section: "experience", featured: true },
  { id: "xiao-lab", position: [-2.5, 0, 1], size: 0.45, label: "Xiao Lab", category: "research", section: "experience", featured: true },
  { id: "lee-lab", position: [0, -2, 1], size: 0.45, label: "Lee Lab", category: "research", section: "experience", featured: true },
  { id: "northeastern", position: [1.5, -1.5, 0.5], size: 0.35, label: "Northeastern BCI", category: "research", section: "experience" },

  // Experience - Industry
  { id: "kelvin", position: [-1.5, -1.5, 0.5], size: 0.35, label: "Kelvin Thermal", category: "industry", section: "experience" },
  { id: "bvsd", position: [3, 1.5, 0], size: 0.3, label: "BVSD IT", category: "industry", section: "experience" },
  { id: "calhacks", position: [-3, 1.5, 0], size: 0.35, label: "Cal Hacks", category: "industry", section: "experience" },

  // Projects
  { id: "matexplorer", position: [0, 3, 1], size: 0.45, label: "MatExplorer", category: "project", section: "projects", featured: true },
  { id: "eeg", position: [2, 2.5, 0.5], size: 0.4, label: "EEG Classification", category: "project", section: "projects", featured: true },
  { id: "eskin", position: [-2, 2.5, 0.5], size: 0.4, label: "Electronic Skin", category: "project", section: "projects", featured: true },
  { id: "thermal", position: [0, -3, 0.5], size: 0.4, label: "Thermal Ground Planes", category: "project", section: "projects", featured: true },

  // Education
  { id: "cu-boulder", position: [3, -1, 0], size: 0.35, label: "CU Boulder", category: "education", section: "education" },
  { id: "fairview", position: [-3, -1, 0], size: 0.3, label: "Fairview HS", category: "education", section: "education" },
];

export const bonds: BondData[] = [
  // Core connections
  { from: "kelly", to: "mse" },
  { from: "kelly", to: "eecs" },
  { from: "kelly", to: "berkeley" },
  { from: "mse", to: "eecs" },

  // Research connections
  { from: "kelly", to: "khan-lab" },
  { from: "kelly", to: "xiao-lab" },
  { from: "kelly", to: "lee-lab" },
  { from: "mse", to: "xiao-lab" },
  { from: "mse", to: "lee-lab" },
  { from: "eecs", to: "khan-lab" },
  { from: "northeastern", to: "eecs" },

  // Industry connections
  { from: "lee-lab", to: "kelvin" },
  { from: "kelvin", to: "thermal" },
  { from: "eecs", to: "bvsd" },
  { from: "berkeley", to: "calhacks" },

  // Project connections
  { from: "mse", to: "matexplorer" },
  { from: "northeastern", to: "eeg" },
  { from: "xiao-lab", to: "eskin" },
  { from: "lee-lab", to: "thermal" },

  // Education connections
  { from: "berkeley", to: "cu-boulder" },
  { from: "cu-boulder", to: "fairview" },
  { from: "cu-boulder", to: "xiao-lab" },
  { from: "cu-boulder", to: "lee-lab" },
];

// Get atoms visible at each section
export function getAtomsForSection(section: AtomData["section"]): AtomData[] {
  const sectionOrder = ["hero", "about", "experience", "projects", "education", "contact"];
  const sectionIndex = sectionOrder.indexOf(section);
  return atoms.filter((atom) => {
    const atomIndex = sectionOrder.indexOf(atom.section);
    return atomIndex <= sectionIndex;
  });
}

// Get bonds for visible atoms
export function getBondsForAtoms(visibleAtomIds: string[]): BondData[] {
  return bonds.filter(
    (bond) => visibleAtomIds.includes(bond.from) && visibleAtomIds.includes(bond.to)
  );
}
```

**Step 2: Create Lattice component**

Create `components/Crystal/Lattice.tsx`:
```typescript
"use client";

import { useMemo } from "react";
import Atom from "./Atom";
import Bond from "./Bond";
import { atoms, bonds, AtomData } from "@/lib/crystalData";

interface LatticeProps {
  visibleAtomIds: string[];
}

const categoryColors: Record<AtomData["category"], string> = {
  core: "#4fd1c5",
  research: "#63b3ed",
  industry: "#f6ad55",
  project: "#68d391",
  education: "#b794f4",
};

export default function Lattice({ visibleAtomIds }: LatticeProps) {
  const visibleAtoms = useMemo(
    () => atoms.filter((atom) => visibleAtomIds.includes(atom.id)),
    [visibleAtomIds]
  );

  const visibleBonds = useMemo(
    () =>
      bonds.filter(
        (bond) =>
          visibleAtomIds.includes(bond.from) && visibleAtomIds.includes(bond.to)
      ),
    [visibleAtomIds]
  );

  const atomPositions = useMemo(() => {
    const map: Record<string, [number, number, number]> = {};
    atoms.forEach((atom) => {
      map[atom.id] = atom.position;
    });
    return map;
  }, []);

  return (
    <group>
      {visibleBonds.map((bond, i) => (
        <Bond
          key={`bond-${i}`}
          start={atomPositions[bond.from]}
          end={atomPositions[bond.to]}
          opacity={0.15}
        />
      ))}
      {visibleAtoms.map((atom) => (
        <Atom
          key={atom.id}
          position={atom.position}
          size={atom.size}
          color={categoryColors[atom.category]}
          glowIntensity={atom.featured ? 0.7 : 0.4}
          pulseSpeed={atom.id === "kelly" ? 0.6 : 1.2}
        />
      ))}
    </group>
  );
}
```

**Step 3: Update CrystalCanvas to use Lattice**

Replace `components/Crystal/CrystalCanvas.tsx`:
```typescript
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
```

**Step 4: Verify full lattice renders**

Run: `npm run dev`
Expected: Full crystal lattice with colored atoms and connecting bonds, slowly rotating

**Step 5: Commit**

```bash
git add lib/crystalData.ts components/Crystal/Lattice.tsx components/Crystal/CrystalCanvas.tsx
git commit -m "feat: add crystal lattice data structure and Lattice component"
```

---

## Phase 3: Scroll-Driven Animation

### Task 8: Set Up Scroll Context

**Files:**
- Create: `contexts/ScrollContext.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create scroll context**

Create `contexts/ScrollContext.tsx`:
```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ScrollContextType {
  scrollProgress: number; // 0 to 1
  currentSection: string;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  currentSection: "hero",
});

export function useScroll() {
  return useContext(ScrollContext);
}

const sections = ["hero", "about", "experience", "projects", "education", "contact"];

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / scrollHeight, 1);
      setScrollProgress(progress);

      // Determine current section based on progress
      const sectionIndex = Math.min(
        Math.floor(progress * sections.length),
        sections.length - 1
      );
      setCurrentSection(sections[sectionIndex]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollProgress, currentSection }}>
      {children}
    </ScrollContext.Provider>
  );
}
```

**Step 2: Wrap app with ScrollProvider**

Replace `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { ScrollProvider } from "@/contexts/ScrollContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelly Yang | Materials Science & EECS",
  description: "Portfolio of Kelly Yang - UC Berkeley MSE/EECS student",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
```

**Step 3: Verify no errors**

Run: `npm run dev`
Expected: App still runs, no errors

**Step 4: Commit**

```bash
git add contexts/ScrollContext.tsx app/layout.tsx
git commit -m "feat: add scroll context for tracking scroll progress"
```

---

### Task 9: Connect Scroll to Crystal Growth

**Files:**
- Modify: `components/Crystal/CrystalCanvas.tsx`
- Modify: `app/page.tsx`

**Step 1: Update CrystalCanvas to use scroll progress**

Replace `components/Crystal/CrystalCanvas.tsx`:
```typescript
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import Lattice from "./Lattice";
import { atoms, getAtomsForSection, AtomData } from "@/lib/crystalData";
import { useScroll } from "@/contexts/ScrollContext";

const sectionOrder: AtomData["section"][] = ["hero", "about", "experience", "projects", "education", "contact"];

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
```

**Step 2: Update page with scroll sections**

Replace `app/page.tsx`:
```typescript
import CrystalCanvas from "@/components/Crystal/CrystalCanvas";

export default function Home() {
  return (
    <main className="relative">
      <CrystalCanvas />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-crystal-text mb-4">Kelly Yang</h1>
          <p className="text-xl text-crystal-muted">Materials Science & EECS @ UC Berkeley</p>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Experience</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Education Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Contact</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>
    </main>
  );
}
```

**Step 3: Verify scroll-driven growth**

Run: `npm run dev`
Expected: Crystal grows as you scroll through sections. Starts with just "Kelly" atom, more appear as you scroll.

**Step 4: Commit**

```bash
git add components/Crystal/CrystalCanvas.tsx app/page.tsx
git commit -m "feat: connect scroll progress to crystal lattice growth"
```

---

## Phase 4: Content Sections

### Task 10: Create Content Data File

**Files:**
- Create: `lib/content.ts`

**Step 1: Create content data**

Create `lib/content.ts`:
```typescript
export interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  description: string[];
  atomId?: string; // Links to crystal atom
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tech: string[];
  description: string[];
  atomId?: string;
  featured?: boolean;
}

export const about = {
  degree: "Joint B.S. in Materials Science & Engineering / EECS",
  school: "UC Berkeley",
  gradYear: "May 2028",
  interests: ["Topological quantum materials", "Electronic skin sensors", "Thermal management", "Brain-computer interfaces"],
};

export const research: Experience[] = [
  {
    id: "khan-lab",
    title: "Research Intern",
    organization: "UC Berkeley EECS — Khan Lab",
    location: "Berkeley, CA",
    duration: "January 2026 – Present",
    description: ["Researching topological quantum materials for nanoelectronics"],
    atomId: "khan-lab",
    featured: true,
  },
  {
    id: "northeastern",
    title: "Research Assistant",
    organization: "Northeastern University",
    location: "Boston, MA",
    duration: "February – March 2025",
    description: ["Developed machine learning models for brain-computer interfaces"],
    atomId: "northeastern",
  },
  {
    id: "xiao-lab",
    title: "Design Engineer",
    organization: "CU Boulder — Xiao Lab",
    location: "Boulder, CO",
    duration: "October 2022 – August 2024",
    description: [
      "2021-2022: Under Pressure — Piezoresistive pressure sensors for electronic skin",
      "2022-2023: Skin PT — Pressure and temperature sensors for electronic skin",
      "Engineered polymer-based piezoresistive sensors by optimizing material composition and microstructure",
      "Improved signal sensitivity for prosthetics users",
    ],
    atomId: "xiao-lab",
    featured: true,
  },
  {
    id: "lee-lab",
    title: "Design Engineer",
    organization: "CU Boulder — Lee Lab",
    location: "Boulder, CO",
    duration: "2023 – 2024",
    description: [
      "Enhancing Dry Cooling in Power Plants — Novel application of high-conductivity thermal ground planes",
      "Designed dry-cooling system for thermoelectric plants to reduce fuel consumption and CO2 emissions in drought regions",
      "Analyzed thermal performance data (NumPy/Pandas) across multiple cooling configurations",
    ],
    atomId: "lee-lab",
    featured: true,
  },
];

export const industry: Experience[] = [
  {
    id: "kelvin",
    title: "Thermal Ground Plane Engineering & Manufacturing Intern",
    organization: "Kelvin Thermal Technologies",
    location: "Longmont, CO",
    duration: "June – August 2024",
    description: [
      "Manufactured thermal ground planes (TGPs) for satellite and VR cooling applications",
      "Produced 100+ units for clients",
      "Automated thermal performance analysis using Python, reducing data processing time by 60%",
    ],
    atomId: "kelvin",
  },
  {
    id: "bvsd",
    title: "Information Technology Intern",
    organization: "Boulder Valley School District",
    location: "Boulder, CO",
    duration: "June – August 2024",
    description: [
      "Conducted IT system upgrades and database migrations for 30,000+ students and staff",
      "Automated system maintenance tasks using Python, reducing manual workload",
    ],
    atomId: "bvsd",
  },
  {
    id: "build-a-better-book",
    title: "Engineering & Design Intern",
    organization: "CU Science Discovery / Build a Better Book",
    location: "Boulder, CO",
    duration: "June 2022 – March 2025",
    description: [
      "Summer 2022 intern, Spring 2025 extension program intern",
      "CVI Storytelling System (Apr–Jun 2025): Developed an interactive storytelling system for a child with cortical visual impairment (CVI)",
      "Programmed Arduino-driven sensor, audio, and lighting interactions to enhance engagement",
    ],
  },
];

export const extracurricular: Experience[] = [
  {
    id: "calhacks",
    title: "Tech Director",
    organization: "Cal Hacks",
    location: "Berkeley, CA",
    duration: "September 2025 – Present",
    description: [
      "Developed live event website using TypeScript and Effect",
      "Supporting world's largest collegiate hackathon with 3,300+ hackers",
    ],
    atomId: "calhacks",
  },
  {
    id: "bohua",
    title: "Elementary School Math Olympiad Teacher",
    organization: "Bohua Chinese School",
    location: "Boulder, CO",
    duration: "August 2020 – February 2025",
    description: [
      "Taught math olympiad preparation to elementary school students for 4+ years",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "matexplorer",
    title: "MatExplorer",
    tech: ["React", "Three.js", "FastAPI", "PostgreSQL", "Redis", "pymatgen"],
    description: [
      "Built web platform for exploring computational materials with 3D crystal structure visualization",
      "Implemented similarity search using PostgreSQL/pgvector",
      "Integrated Materials Project API data with pymatgen analysis and ML property predictions",
    ],
    atomId: "matexplorer",
    featured: true,
  },
  {
    id: "eeg",
    title: "EEG Motor Imagery Classification",
    tech: ["PyTorch", "MNE", "scikit-learn", "NumPy/SciPy"],
    description: [
      "Developed deep learning models for motor imagery classification from EEG signals",
      "Implemented preprocessing pipeline (MNE) for artifact removal and feature extraction",
      "Trained on BCI Competition IV dataset (22 channels, 4 classes)",
    ],
    atomId: "eeg",
    featured: true,
  },
  {
    id: "eskin",
    title: "Electronic Skin Sensors (Xiao Lab)",
    tech: ["Materials Science", "Polymer Engineering"],
    description: [
      "Piezoresistive pressure sensors (Under Pressure)",
      "Pressure and temperature sensors (Skin PT)",
      "Optimized polymer material composition and microstructure for prosthetics applications",
    ],
    atomId: "eskin",
    featured: true,
  },
  {
    id: "thermal",
    title: "Thermal Ground Planes for Power Plants (Lee Lab)",
    tech: ["CAD", "NumPy/Pandas", "Thermal Analysis"],
    description: [
      "Designed dry-cooling system using high-conductivity thermal ground planes",
      "Goal: reduce fuel usage and CO2 emissions in drought-affected regions",
      "Analyzed thermal performance data across multiple cooling configurations",
    ],
    atomId: "thermal",
    featured: true,
  },
  {
    id: "quantum",
    title: "Topological Quantum Materials (Khan Lab)",
    tech: ["Current Research", "Nanoelectronics"],
    description: [
      "Investigating topological quantum materials for nanoelectronics applications",
    ],
    atomId: "khan-lab",
    featured: true,
  },
];

export const education = [
  {
    school: "UC Berkeley College of Engineering",
    degree: "Joint B.S. in Materials Science & Engineering / EECS",
    duration: "Expected May 2028",
  },
  {
    school: "University of Colorado Boulder",
    degree: "Concurrent Enrollment",
    duration: "May 2022 – May 2023",
  },
  {
    school: "Fairview High School",
    degree: "High School Diploma / IB Diploma",
    duration: "Graduated",
  },
];

export const skills = {
  languages: ["Python", "TypeScript", "SQL", "C++"],
  frameworks: ["React", "React Native", "Node.js", "FastAPI", "PyTorch", "scikit-learn", "Three.js", "NumPy/Pandas", "MNE", "pymatgen"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "REST APIs", "pgvector"],
  tools: ["Arduino", "CAD Software", "Git", "Linux", "Jupyter"],
  humanLanguages: ["Chinese (Native)", "English (Native)", "Spanish (Limited Working)"],
};

export const contact = {
  email: "kellyang2006@gmail.com",
  linkedin: "https://www.linkedin.com/in/kelly-yang06/",
};

export const honors = [
  "Carnegie Hall Performer — American Protégé International Piano and Strings Competition",
  "Broadcom MASTERS Top 300 — National STEM competition semifinalist",
  "Colorado Science and Engineering Fair Finalist",
  "AMC Maryam Mirzakhani Certificate Winner — American Mathematics Competition",
  "Royal Conservatory of Music Level 10 — Practical Exam",
];
```

**Step 2: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add portfolio content data"
```

---

### Task 11: Create Section Components

**Files:**
- Create: `components/sections/HeroSection.tsx`
- Create: `components/sections/AboutSection.tsx`
- Create: `components/sections/ExperienceSection.tsx`
- Create: `components/sections/ProjectsSection.tsx`
- Create: `components/sections/EducationSection.tsx`
- Create: `components/sections/ContactSection.tsx`

**Step 1: Create HeroSection**

Create `components/sections/HeroSection.tsx`:
```typescript
export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-crystal-text mb-4 tracking-tight">
          Kelly Yang
        </h1>
        <p className="text-xl text-crystal-muted font-light">
          Materials Science & EECS @ UC Berkeley
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Create AboutSection**

Create `components/sections/AboutSection.tsx`:
```typescript
import { about } from "@/lib/content";

export default function AboutSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel p-8 max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6">About</h2>

        <p className="text-xl text-crystal-text mb-2">{about.degree}</p>
        <p className="text-lg text-crystal-accent mb-8">{about.school}</p>

        <p className="text-sm text-crystal-muted uppercase tracking-wider mb-3">Research Interests</p>
        <div className="flex flex-wrap justify-center gap-2">
          {about.interests.map((interest) => (
            <span
              key={interest}
              className="px-4 py-2 text-sm bg-crystal-atom/20 text-crystal-atom rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create ExperienceSection**

Create `components/sections/ExperienceSection.tsx`:
```typescript
import { research, industry, extracurricular } from "@/lib/content";

interface ExperienceCardProps {
  title: string;
  organization: string;
  location: string;
  duration: string;
  description: string[];
  featured?: boolean;
}

function ExperienceCard({ title, organization, location, duration, description, featured }: ExperienceCardProps) {
  return (
    <div className={`border-l-2 ${featured ? 'border-crystal-atom' : 'border-crystal-atom/30'} pl-4 mb-6`}>
      <h4 className="font-semibold text-crystal-text">{title}</h4>
      <p className="text-crystal-atom text-sm">{organization}</p>
      <p className="text-crystal-muted text-sm mb-2">
        {location} • {duration}
      </p>
      <ul className="text-crystal-muted text-sm space-y-1">
        {description.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-panel p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>

        <h3 className="text-xl font-semibold text-crystal-atom mb-4">Research</h3>
        {research.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}

        <h3 className="text-xl font-semibold text-crystal-accent mb-4 mt-8">Industry</h3>
        {industry.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}

        <h3 className="text-xl font-semibold text-green-400 mb-4 mt-8">Extracurricular</h3>
        {extracurricular.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}
      </div>
    </section>
  );
}
```

**Step 4: Create ProjectsSection**

Create `components/sections/ProjectsSection.tsx`:
```typescript
import { projects } from "@/lib/content";

interface ProjectCardProps {
  title: string;
  tech: string[];
  description: string[];
}

function ProjectCard({ title, tech, description }: ProjectCardProps) {
  return (
    <div className="glass-panel p-6 mb-4">
      <h4 className="font-semibold text-crystal-text text-lg mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2 mb-3">
        {tech.map((t) => (
          <span key={t} className="px-2 py-0.5 text-xs bg-crystal-accent/20 text-crystal-accent rounded">
            {t}
          </span>
        ))}
      </div>
      <ul className="text-crystal-muted text-sm space-y-1">
        {description.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Create EducationSection**

Create `components/sections/EducationSection.tsx`:
```typescript
import { education, skills, honors } from "@/lib/content";

export default function EducationSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-panel p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="mb-4 border-l-2 border-purple-400/30 pl-4">
            <h4 className="font-semibold text-crystal-text">{edu.school}</h4>
            <p className="text-crystal-muted text-sm">{edu.degree}</p>
            <p className="text-crystal-muted text-sm">{edu.duration}</p>
          </div>
        ))}

        <h3 className="text-xl font-semibold mt-8 mb-4">Technical Skills</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-crystal-atom">Languages:</span> <span className="text-crystal-muted">{skills.languages.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Frameworks & Libraries:</span> <span className="text-crystal-muted">{skills.frameworks.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Databases & Infrastructure:</span> <span className="text-crystal-muted">{skills.databases.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Hardware & Tools:</span> <span className="text-crystal-muted">{skills.tools.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Languages (Human):</span> <span className="text-crystal-muted">{skills.humanLanguages.join(", ")}</span></p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Honors & Awards</h3>
        <ul className="text-crystal-muted text-sm space-y-1">
          {honors.map((honor, i) => (
            <li key={i}>• {honor}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Step 6: Create ContactSection**

Create `components/sections/ContactSection.tsx`:
```typescript
import { contact } from "@/lib/content";

export default function ContactSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
        <p className="text-crystal-muted mb-8">
          Interested in collaborating or have questions about my work? I'd love to hear from you.
        </p>
        <div className="space-y-4">
          <a
            href={`mailto:${contact.email}`}
            className="block w-full py-3 px-6 bg-crystal-atom text-crystal-bg font-semibold rounded-lg hover:bg-crystal-atomGlow transition-colors"
          >
            {contact.email}
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 border border-crystal-atom text-crystal-atom rounded-lg hover:bg-crystal-atom/10 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Step 7: Commit**

```bash
git add components/sections/
git commit -m "feat: add all content section components"
```

---

### Task 12: Integrate Sections into Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update page with section components**

Replace `app/page.tsx`:
```typescript
import CrystalCanvas from "@/components/Crystal/CrystalCanvas";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="relative">
      <CrystalCanvas />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
```

**Step 2: Verify all sections render**

Run: `npm run dev`
Expected: Full scrollable portfolio with crystal growing and all content sections

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate all sections into main page"
```

---

## Phase 5: Polish & Easter Egg

### Task 13: Add Atom Entry Animation

**Files:**
- Modify: `components/Crystal/Atom.tsx`

**Step 1: Add scale-in animation for atoms**

Replace `components/Crystal/Atom.tsx`:
```typescript
"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtomProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  glowIntensity?: number;
  pulseSpeed?: number;
}

export default function Atom({
  position,
  size = 0.3,
  color = "#4fd1c5",
  glowIntensity = 0.5,
  pulseSpeed = 1,
}: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [scale, setScale] = useState(0);

  // Animate in on mount
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setScale(eased);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 0.85;
      materialRef.current.emissiveIntensity = glowIntensity * pulse;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position} scale={scale}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={glowIntensity}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}
```

**Step 2: Verify atoms animate in**

Run: `npm run dev`
Expected: Atoms scale up smoothly when they appear

**Step 3: Commit**

```bash
git add components/Crystal/Atom.tsx
git commit -m "feat: add scale-in animation for atoms"
```

---

### Task 14: Add Easter Egg (FCC ↔ BCC Transformation)

**Files:**
- Create: `lib/easterEgg.ts`
- Modify: `components/Crystal/CrystalCanvas.tsx`
- Modify: `components/Crystal/Lattice.tsx`

**Step 1: Create easter egg position data**

Create `lib/easterEgg.ts`:
```typescript
// BCC (Body-Centered Cubic) positions - alternative crystal structure
export const bccPositions: Record<string, [number, number, number]> = {
  kelly: [0, 0, 0],
  mse: [1, 1, 1],
  eecs: [-1, -1, 1],
  berkeley: [-1, 1, -1],
  "khan-lab": [1, -1, -1],
  "xiao-lab": [2, 0, 0],
  "lee-lab": [-2, 0, 0],
  northeastern: [0, 2, 0],
  kelvin: [0, -2, 0],
  bvsd: [0, 0, 2],
  calhacks: [0, 0, -2],
  matexplorer: [1.5, 1.5, 0],
  eeg: [-1.5, 1.5, 0],
  eskin: [1.5, -1.5, 0],
  thermal: [-1.5, -1.5, 0],
  "cu-boulder": [1.5, 0, 1.5],
  fairview: [-1.5, 0, 1.5],
};

export const easterEggMessage = "You found it! This is BCC (Body-Centered Cubic) — click again for FCC.";
```

**Step 2: Update Lattice to support position switching**

Replace `components/Crystal/Lattice.tsx`:
```typescript
"use client";

import { useMemo } from "react";
import Atom from "./Atom";
import Bond from "./Bond";
import { atoms, bonds, AtomData } from "@/lib/crystalData";
import { bccPositions } from "@/lib/easterEgg";

interface LatticeProps {
  visibleAtomIds: string[];
  useBCC?: boolean;
}

const categoryColors: Record<AtomData["category"], string> = {
  core: "#4fd1c5",
  research: "#63b3ed",
  industry: "#f6ad55",
  project: "#68d391",
  education: "#b794f4",
};

export default function Lattice({ visibleAtomIds, useBCC = false }: LatticeProps) {
  const visibleAtoms = useMemo(
    () => atoms.filter((atom) => visibleAtomIds.includes(atom.id)),
    [visibleAtomIds]
  );

  const visibleBonds = useMemo(
    () =>
      bonds.filter(
        (bond) =>
          visibleAtomIds.includes(bond.from) && visibleAtomIds.includes(bond.to)
      ),
    [visibleAtomIds]
  );

  const atomPositions = useMemo(() => {
    const map: Record<string, [number, number, number]> = {};
    atoms.forEach((atom) => {
      map[atom.id] = useBCC && bccPositions[atom.id] ? bccPositions[atom.id] : atom.position;
    });
    return map;
  }, [useBCC]);

  return (
    <group>
      {visibleBonds.map((bond, i) => (
        <Bond
          key={`bond-${i}-${useBCC}`}
          start={atomPositions[bond.from]}
          end={atomPositions[bond.to]}
          opacity={0.15}
        />
      ))}
      {visibleAtoms.map((atom) => (
        <Atom
          key={`${atom.id}-${useBCC}`}
          position={atomPositions[atom.id]}
          size={atom.size}
          color={categoryColors[atom.category]}
          glowIntensity={atom.featured ? 0.7 : 0.4}
          pulseSpeed={atom.id === "kelly" ? 0.6 : 1.2}
        />
      ))}
    </group>
  );
}
```

**Step 3: Update CrystalCanvas with easter egg trigger**

Replace `components/Crystal/CrystalCanvas.tsx`:
```typescript
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo, useState, useCallback } from "react";
import Lattice from "./Lattice";
import { atoms, getAtomsForSection, AtomData } from "@/lib/crystalData";
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
```

**Step 4: Verify easter egg works**

Run: `npm run dev`
Expected: Clicking the center atom transforms crystal structure and shows message

**Step 5: Commit**

```bash
git add lib/easterEgg.ts components/Crystal/Lattice.tsx components/Crystal/CrystalCanvas.tsx
git commit -m "feat: add easter egg FCC/BCC crystal transformation"
```

---

### Task 15: Add Navigation Dots

**Files:**
- Create: `components/Navigation.tsx`
- Modify: `app/page.tsx`

**Step 1: Create Navigation component**

Create `components/Navigation.tsx`:
```typescript
"use client";

import { useScroll } from "@/contexts/ScrollContext";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navigation() {
  const { currentSection } = useScroll();

  const scrollToSection = (index: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / (sections.length - 1)) * scrollHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <ul className="space-y-4">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(index)}
              className="group flex items-center gap-3"
              aria-label={section.label}
            >
              <span
                className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                  currentSection === section.id ? "text-crystal-atom" : "text-crystal-muted"
                }`}
              >
                {section.label}
              </span>
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSection === section.id
                    ? "bg-crystal-atom scale-150"
                    : "bg-crystal-muted/50 group-hover:bg-crystal-muted"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Step 2: Add Navigation to page**

Replace `app/page.tsx`:
```typescript
import CrystalCanvas from "@/components/Crystal/CrystalCanvas";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="relative">
      <CrystalCanvas />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
```

**Step 3: Verify navigation works**

Run: `npm run dev`
Expected: Floating nav dots on right side, clicking scrolls to section

**Step 4: Commit**

```bash
git add components/Navigation.tsx app/page.tsx
git commit -m "feat: add floating navigation dots"
```

---

## Phase 6: Final Polish

### Task 16: Add Meta Tags and Favicon

**Files:**
- Modify: `app/layout.tsx`
- Create: `public/favicon.ico` (or use existing)

**Step 1: Update metadata**

Replace `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { ScrollProvider } from "@/contexts/ScrollContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelly Yang | Materials Science & EECS @ UC Berkeley",
  description:
    "Portfolio of Kelly Yang — UC Berkeley student researching topological quantum materials, electronic skin sensors, and brain-computer interfaces.",
  keywords: [
    "Kelly Yang",
    "UC Berkeley",
    "Materials Science",
    "EECS",
    "Quantum Materials",
    "Electronic Skin",
    "Portfolio",
  ],
  authors: [{ name: "Kelly Yang" }],
  openGraph: {
    title: "Kelly Yang | Materials Science & EECS",
    description: "UC Berkeley student researching quantum materials and electronic skin sensors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add SEO metadata"
```

---

### Task 17: Mobile Responsiveness Pass

**Files:**
- Modify: `components/sections/HeroSection.tsx`
- Modify: `app/globals.css`

**Step 1: Update HeroSection for mobile**

Replace `components/sections/HeroSection.tsx`:
```typescript
export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-crystal-text mb-4 tracking-tight">
          Kelly Yang
        </h1>
        <p className="text-lg sm:text-xl text-crystal-muted font-light">
          Materials Science & EECS @ UC Berkeley
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Add mobile glass-panel adjustments**

Add to `app/globals.css` at the end:
```css
/* Mobile adjustments */
@media (max-width: 640px) {
  .glass-panel {
    margin: 1rem;
    padding: 1.5rem;
  }
}
```

**Step 3: Verify mobile layout**

Run: `npm run dev`
Test: Use browser dev tools to check mobile viewport
Expected: Text scales down, panels have appropriate padding

**Step 4: Commit**

```bash
git add components/sections/HeroSection.tsx app/globals.css
git commit -m "style: improve mobile responsiveness"
```

---

### Task 18: Final Build and Test

**Step 1: Run production build**

Run: `npm run build`
Expected: Build completes without errors

**Step 2: Test production build locally**

Run: `npm run start`
Expected: Site runs at localhost:3000, all features work

**Step 3: Final commit**

```bash
git add .
git commit -m "chore: production ready"
```

---

## Summary

**What we built:**
- Next.js 14 app with TypeScript
- 3D crystal lattice using Three.js + React Three Fiber
- Scroll-driven crystal growth animation
- Glassmorphic content panels
- 6 content sections with your portfolio data
- FCC ↔ BCC easter egg transformation
- Floating navigation dots
- Mobile responsive design

**To deploy:**
- Vercel: `npx vercel`
- Netlify: Push to GitHub, connect repo
- Or any static host after `npm run build`

**Future enhancements (optional):**
- Add atom hover tooltips with labels
- Click atoms to expand project details
- Add particle effects on bond connections
- Integrate with a CMS for easy content updates
