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

export const easterEggMessage = "You found it! This is BCC (Body-Centered Cubic) - click again for FCC.";
