# Lattice Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Three.js crystal background with an SVG-based 2D isometric FCC lattice that IS the interface—click nodes to reveal content in a 60% side panel.

**Architecture:** SVG-based 2D isometric rendering with React state for active node. Framer Motion for animations. Lattice compresses when panel opens. Mobile uses bottom sheet instead of side panel.

**Tech Stack:** React, SVG, Framer Motion, Tailwind CSS, Next.js

---

## Task 1: Install Framer Motion

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `npm install framer-motion`

**Step 2: Verify installation**

Run: `npm ls framer-motion`
Expected: `framer-motion@11.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion for animations"
```

---

## Task 2: Create Lattice Position Calculator

**Files:**
- Create: `lib/latticePositions.ts`

**Step 1: Create the position calculator**

This generates FCC lattice positions projected to 2D isometric view, with 6 nodes positioned for content categories.

```typescript
// lib/latticePositions.ts

export interface LatticeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number; // Used for depth coloring (0 = front/teal, 1 = back/purple)
}

export interface LatticeBond {
  from: string;
  to: string;
}

// Isometric projection: converts 3D to 2D
// Using standard isometric angles (30 degrees)
function isoProject(x: number, y: number, z: number, scale: number = 100): { px: number; py: number } {
  const px = (x - z) * Math.cos(Math.PI / 6) * scale;
  const py = y * scale - (x + z) * Math.sin(Math.PI / 6) * scale;
  return { px, py };
}

// 6 content nodes in FCC-inspired positions
// Center node + 5 surrounding nodes at face-center-like positions
export const contentNodes: LatticeNode[] = [
  { id: 'kelly', label: 'Kelly Yang', x: 0, y: 0, z: 0.5 },
  { id: 'research', label: 'Research', x: -1, y: 0.5, z: 0 },
  { id: 'industry', label: 'Industry', x: 1, y: 0.5, z: 0 },
  { id: 'projects', label: 'Projects', x: -1, y: -0.5, z: 1 },
  { id: 'education', label: 'Education', x: 1, y: -0.5, z: 1 },
  { id: 'contact', label: 'Contact', x: 0, y: -1, z: 0.5 },
];

// Bonds connect through center node (FCC-like connectivity)
export const bonds: LatticeBond[] = [
  { from: 'kelly', to: 'research' },
  { from: 'kelly', to: 'industry' },
  { from: 'kelly', to: 'projects' },
  { from: 'kelly', to: 'education' },
  { from: 'kelly', to: 'contact' },
  // Cross connections for FCC structure
  { from: 'research', to: 'projects' },
  { from: 'industry', to: 'education' },
  { from: 'research', to: 'industry' },
  { from: 'projects', to: 'education' },
  { from: 'projects', to: 'contact' },
  { from: 'education', to: 'contact' },
];

export interface ProjectedNode extends LatticeNode {
  px: number;
  py: number;
}

export function getProjectedNodes(scale: number = 100): ProjectedNode[] {
  return contentNodes.map((node) => {
    const { px, py } = isoProject(node.x, node.y, node.z, scale);
    return { ...node, px, py };
  });
}

// Get color based on z-depth (0 = teal/front, 1 = purple/back)
export function getNodeColor(z: number): string {
  // Interpolate between teal (#4fd1c5) and purple (#b794f4)
  const t = Math.min(1, Math.max(0, z));
  // Return CSS variable reference for easier theming
  if (t < 0.4) return 'var(--crystal-atom)'; // teal
  if (t > 0.6) return 'var(--lattice-back)'; // purple
  return 'var(--lattice-mid)'; // blend
}

// Get node size based on z-depth (front = larger)
export function getNodeSize(z: number, baseSize: number = 24): number {
  const depthFactor = 1 - z * 0.3; // 0.7 to 1.0
  return baseSize * depthFactor;
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/kellyyang/kellyangweb/.worktrees/redesign && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/latticePositions.ts
git commit -m "feat: add FCC lattice position calculator"
```

---

## Task 3: Add Lattice Theme Colors

**Files:**
- Modify: `app/globals.css`

**Step 1: Add purple gradient colors**

Add to `:root` in globals.css:

```css
  --lattice-back: #b794f4;
  --lattice-mid: #8ab4dc;
```

Add to `@theme inline`:

```css
  --color-lattice-back: var(--lattice-back);
  --color-lattice-mid: var(--lattice-mid);
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add lattice depth gradient colors"
```

---

## Task 4: Create Node Component

**Files:**
- Create: `components/Lattice/Node.tsx`

**Step 1: Create directory and component**

```bash
mkdir -p components/Lattice
```

```tsx
// components/Lattice/Node.tsx
'use client';

import { motion } from 'framer-motion';
import { ProjectedNode, getNodeColor, getNodeSize } from '@/lib/latticePositions';

interface NodeProps {
  node: ProjectedNode;
  isActive: boolean;
  onClick: () => void;
  animate?: boolean;
}

export default function Node({ node, isActive, onClick, animate = true }: NodeProps) {
  const size = getNodeSize(node.z);
  const color = getNodeColor(node.z);

  return (
    <motion.g
      initial={animate ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * Math.random(), duration: 0.5 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <motion.circle
        cx={node.px}
        cy={node.py}
        r={size * 1.5}
        fill={color}
        opacity={0.2}
        initial={{ scale: 1 }}
        animate={isActive ? { scale: 1.3, opacity: 0.4 } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />

      {/* Main node */}
      <motion.circle
        cx={node.px}
        cy={node.py}
        r={size}
        fill={color}
        whileHover={{ scale: 1.15 }}
        animate={isActive ? { scale: 1.2 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Label */}
      <motion.text
        x={node.px}
        y={node.py + size + 20}
        textAnchor="middle"
        fill="var(--crystal-text)"
        fontSize="14"
        fontFamily="var(--font-sans)"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {node.label}
      </motion.text>
    </motion.g>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/Lattice/Node.tsx
git commit -m "feat: add interactive Node component"
```

---

## Task 5: Create Bond Component

**Files:**
- Create: `components/Lattice/Bond.tsx`

**Step 1: Create the bond component**

```tsx
// components/Lattice/Bond.tsx
'use client';

import { motion } from 'framer-motion';
import { ProjectedNode } from '@/lib/latticePositions';

interface BondProps {
  from: ProjectedNode;
  to: ProjectedNode;
  animate?: boolean;
}

export default function Bond({ from, to, animate = true }: BondProps) {
  const pathLength = Math.hypot(to.px - from.px, to.py - from.py);

  return (
    <motion.line
      x1={from.px}
      y1={from.py}
      x2={to.px}
      y2={to.py}
      stroke="var(--crystal-bond)"
      strokeWidth={1.5}
      initial={animate ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    />
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/Lattice/Bond.tsx
git commit -m "feat: add Bond component for lattice connections"
```

---

## Task 6: Create Lattice Container

**Files:**
- Create: `components/Lattice/Lattice.tsx`
- Create: `components/Lattice/index.ts`

**Step 1: Create the main Lattice component**

```tsx
// components/Lattice/Lattice.tsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Node from './Node';
import Bond from './Bond';
import { getProjectedNodes, bonds, ProjectedNode } from '@/lib/latticePositions';

interface LatticeProps {
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
  compressed?: boolean;
}

export default function Lattice({ activeNode, onNodeClick, compressed = false }: LatticeProps) {
  const scale = compressed ? 60 : 100;
  const nodes = useMemo(() => getProjectedNodes(scale), [scale]);

  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, ProjectedNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Calculate viewBox to center the lattice
  const padding = 100;
  const minX = Math.min(...nodes.map((n) => n.px)) - padding;
  const maxX = Math.max(...nodes.map((n) => n.px)) + padding;
  const minY = Math.min(...nodes.map((n) => n.py)) - padding;
  const maxY = Math.max(...nodes.map((n) => n.py)) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <motion.svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full h-full"
      animate={{ scale: compressed ? 0.85 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bonds first (behind nodes) */}
      {bonds.map((bond) => {
        const fromNode = nodeMap.get(bond.from);
        const toNode = nodeMap.get(bond.to);
        if (!fromNode || !toNode) return null;
        return (
          <Bond
            key={`${bond.from}-${bond.to}`}
            from={fromNode}
            to={toNode}
          />
        );
      })}

      {/* Nodes on top */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isActive={activeNode === node.id}
          onClick={() => onNodeClick(node.id)}
        />
      ))}
    </motion.svg>
  );
}
```

**Step 2: Create barrel export**

```typescript
// components/Lattice/index.ts
export { default as Lattice } from './Lattice';
export { default as Node } from './Node';
export { default as Bond } from './Bond';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add components/Lattice/
git commit -m "feat: add Lattice container with SVG rendering"
```

---

## Task 7: Create Panel Content Components

**Files:**
- Create: `components/Panel/sections/AboutContent.tsx`
- Create: `components/Panel/sections/ResearchContent.tsx`
- Create: `components/Panel/sections/IndustryContent.tsx`
- Create: `components/Panel/sections/ProjectsContent.tsx`
- Create: `components/Panel/sections/EducationContent.tsx`
- Create: `components/Panel/sections/ContactContent.tsx`

**Step 1: Create directory**

```bash
mkdir -p components/Panel/sections
```

**Step 2: Create AboutContent**

```tsx
// components/Panel/sections/AboutContent.tsx
import { about } from '@/lib/content';

export default function AboutContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-crystal-text mb-2">Kelly Yang</h2>
        <p className="text-xl text-crystal-atom">{about.degree}</p>
        <p className="text-crystal-muted">{about.school} · {about.gradYear}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-crystal-text mb-3">Research Interests</h3>
        <ul className="space-y-2">
          {about.interests.map((interest, i) => (
            <li key={i} className="text-crystal-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crystal-atom" />
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**Step 3: Create ResearchContent**

```tsx
// components/Panel/sections/ResearchContent.tsx
import { research } from '@/lib/content';
import ExperienceCard from './ExperienceCard';

export default function ResearchContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Research</h2>
      <div className="space-y-4">
        {research.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="crystal-atom" />
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Create IndustryContent**

```tsx
// components/Panel/sections/IndustryContent.tsx
import { industry, extracurricular } from '@/lib/content';
import ExperienceCard from './ExperienceCard';

export default function IndustryContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Industry</h2>
      <div className="space-y-4">
        {industry.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="crystal-accent" />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-green-400 mt-8">Extracurricular</h3>
      <div className="space-y-4">
        {extracurricular.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="green-400" />
        ))}
      </div>
    </div>
  );
}
```

**Step 5: Create ProjectsContent**

```tsx
// components/Panel/sections/ProjectsContent.tsx
import { projects } from '@/lib/content';

export default function ProjectsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border-l-2 border-lattice-back pl-4">
            <h3 className="font-semibold text-crystal-text text-lg">{project.title}</h3>
            <div className="flex flex-wrap gap-2 my-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-crystal-atom/20 text-crystal-atom"
                >
                  {tech}
                </span>
              ))}
            </div>
            <ul className="text-crystal-muted text-sm space-y-1">
              {project.description.map((item, i) => (
                <li key={i}>- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 6: Create EducationContent**

```tsx
// components/Panel/sections/EducationContent.tsx
import { education, skills, honors } from '@/lib/content';

export default function EducationContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-crystal-text mb-4">Education</h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="border-l-2 border-crystal-atom pl-4">
              <h3 className="font-semibold text-crystal-text">{edu.school}</h3>
              <p className="text-crystal-atom text-sm">{edu.degree}</p>
              <p className="text-crystal-muted text-sm">{edu.duration}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-crystal-text mb-3">Skills</h3>
        <div className="space-y-3">
          <SkillRow label="Languages" items={skills.languages} />
          <SkillRow label="Frameworks" items={skills.frameworks} />
          <SkillRow label="Databases" items={skills.databases} />
          <SkillRow label="Tools" items={skills.tools} />
          <SkillRow label="Human Languages" items={skills.humanLanguages} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-crystal-text mb-3">Honors & Awards</h3>
        <ul className="space-y-2">
          {honors.map((honor, i) => (
            <li key={i} className="text-crystal-muted text-sm flex items-start gap-2">
              <span className="text-crystal-accent mt-1">★</span>
              {honor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <span className="text-crystal-muted text-sm">{label}: </span>
      <span className="text-crystal-text text-sm">{items.join(', ')}</span>
    </div>
  );
}
```

**Step 7: Create ContactContent**

```tsx
// components/Panel/sections/ContactContent.tsx
import { contact } from '@/lib/content';

export default function ContactContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Contact</h2>
      <div className="space-y-4">
        <a
          href={`mailto:${contact.email}`}
          className="block p-4 border border-crystal-atom/30 rounded-lg hover:border-crystal-atom transition-colors"
        >
          <p className="text-crystal-muted text-sm">Email</p>
          <p className="text-crystal-atom">{contact.email}</p>
        </a>

        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-lattice-back/30 rounded-lg hover:border-lattice-back transition-colors"
        >
          <p className="text-crystal-muted text-sm">LinkedIn</p>
          <p className="text-lattice-back">Kelly Yang</p>
        </a>
      </div>
    </div>
  );
}
```

**Step 8: Create shared ExperienceCard**

```tsx
// components/Panel/sections/ExperienceCard.tsx
import { Experience } from '@/lib/content';

interface ExperienceCardProps {
  experience: Experience;
  accentColor: string;
}

export default function ExperienceCard({ experience, accentColor }: ExperienceCardProps) {
  return (
    <div className={`border-l-2 border-${accentColor} pl-4`}>
      <h4 className="font-semibold text-crystal-text">{experience.title}</h4>
      <p className={`text-${accentColor} text-sm`}>{experience.organization}</p>
      <p className="text-crystal-muted text-sm mb-2">
        {experience.location} | {experience.duration}
      </p>
      <ul className="text-crystal-muted text-sm space-y-1">
        {experience.description.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 9: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 10: Commit**

```bash
git add components/Panel/
git commit -m "feat: add panel content components"
```

---

## Task 8: Create Side Panel Component

**Files:**
- Create: `components/Panel/Panel.tsx`
- Create: `components/Panel/index.ts`

**Step 1: Create the Panel component**

```tsx
// components/Panel/Panel.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
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

export default function Panel({ activeNode, onClose }: PanelProps) {
  const Content = activeNode ? contentMap[activeNode] : null;

  return (
    <AnimatePresence>
      {activeNode && Content && (
        <>
          {/* Backdrop for closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[80%] lg:w-[60%] z-50 bg-[#12121a] border-l border-white/10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close panel"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </button>

            {/* Content */}
            <div className="h-full overflow-y-auto p-8 pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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

**Step 2: Create barrel export**

```typescript
// components/Panel/index.ts
export { default as Panel } from './Panel';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add components/Panel/
git commit -m "feat: add animated side panel component"
```

---

## Task 9: Wire Up Main Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace page with lattice interface**

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import { Lattice } from '@/components/Lattice';
import { Panel } from '@/components/Panel';

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    // If clicking the same node, close the panel
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
      {/* Lattice - compresses when panel is open */}
      <div
        className={`fixed inset-0 transition-all duration-300 flex items-center justify-center ${
          activeNode ? 'lg:right-[60%] sm:right-[80%]' : 'right-0'
        }`}
      >
        <Lattice
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
Expected: Page loads with lattice visible, clicking nodes opens panel

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up lattice interface with panel"
```

---

## Task 10: Add Entry Animation

**Files:**
- Modify: `components/Lattice/Lattice.tsx`

**Step 1: Add staggered entry animation**

Update the Lattice component to include coordinated entry animations:
- Nodes fly in from scattered positions
- Bonds draw after nodes settle
- Center node glows briefly

The Node and Bond components already have `animate` props. Update Lattice to orchestrate timing.

**Step 2: Verify animation works**

Run: `npm run dev`
Expected: On page load, nodes animate in, bonds draw, Kelly node pulses

**Step 3: Commit**

```bash
git add components/Lattice/Lattice.tsx
git commit -m "feat: add coordinated entry animation"
```

---

## Task 11: Add Ambient Pulse Animation

**Files:**
- Modify: `components/Lattice/Node.tsx`

**Step 1: Add subtle breathing animation**

Add a gentle opacity pulse to nodes for ambient life:

```tsx
// Add to Node component's glow circle
animate={{
  opacity: [0.2, 0.3, 0.2],
  scale: [1, 1.05, 1],
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

**Step 2: Verify animation**

Run: `npm run dev`
Expected: Nodes have subtle breathing effect

**Step 3: Commit**

```bash
git add components/Lattice/Node.tsx
git commit -m "feat: add ambient pulse animation to nodes"
```

---

## Task 12: Mobile Bottom Sheet

**Files:**
- Modify: `components/Panel/Panel.tsx`

**Step 1: Add mobile-specific bottom sheet behavior**

Update Panel to detect mobile and show as bottom sheet instead of side panel:

```tsx
// Use Tailwind responsive classes to change animation direction
// On mobile: slide from bottom, take ~80% height
// On desktop: slide from right, take 60% width
```

**Step 2: Test on mobile viewport**

Run: `npm run dev`
Open DevTools, toggle mobile view
Expected: Panel slides from bottom on mobile

**Step 3: Commit**

```bash
git add components/Panel/Panel.tsx
git commit -m "feat: add mobile bottom sheet support"
```

---

## Task 13: Clean Up Old Components

**Files:**
- Delete: `components/Crystal/` (entire directory)
- Delete: `components/sections/` (entire directory)
- Delete: `components/Navigation.tsx`
- Delete: `lib/crystalData.ts`
- Delete: `lib/easterEgg.ts`

**Step 1: Remove old components**

```bash
rm -rf components/Crystal/
rm -rf components/sections/
rm components/Navigation.tsx
rm lib/crystalData.ts
rm lib/easterEgg.ts
```

**Step 2: Verify build still works**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old Three.js crystal and scrolling sections"
```

---

## Task 14: Final Verification

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Manual testing checklist**

- [ ] Lattice renders centered on page
- [ ] All 6 nodes visible with labels
- [ ] Depth gradient (teal front, purple back)
- [ ] Clicking node opens panel (60% desktop, bottom sheet mobile)
- [ ] Clicking different node swaps content (no close/reopen)
- [ ] Clicking same node or X closes panel
- [ ] Lattice compresses when panel open
- [ ] Entry animation plays on load
- [ ] Hover states work on nodes
- [ ] All content sections display correctly
- [ ] Mobile responsive

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete lattice portfolio redesign"
```

---

## Summary

**14 Tasks Total:**
1. Install Framer Motion
2. Create lattice position calculator
3. Add theme colors
4. Create Node component
5. Create Bond component
6. Create Lattice container
7. Create panel content components
8. Create side Panel component
9. Wire up main page
10. Add entry animation
11. Add ambient pulse animation
12. Mobile bottom sheet
13. Clean up old components
14. Final verification

**Estimated Commits:** 13-14 atomic commits

**Dependencies:** Framer Motion for animations

**Testing Strategy:** Visual verification at each step, full build check before final commit
