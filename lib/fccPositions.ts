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
  { id: 'kelly', position: [0, 0, -HALF], type: 'face', label: 'About', contentId: 'kelly' },
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
