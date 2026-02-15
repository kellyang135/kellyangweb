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
