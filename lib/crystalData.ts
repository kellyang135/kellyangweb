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
