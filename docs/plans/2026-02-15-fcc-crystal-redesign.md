# FCC Crystal Lattice Redesign

**Date:** February 15, 2026
**Status:** Approved

---

## Overview

Redesign the portfolio lattice to be a proper FCC (Face-Centered Cubic) crystal structure with 3D rotation, glass-like aesthetics, and clear visual hierarchy.

---

## Structure

### Atoms (14 total)

| Type | Count | Role | Size |
|------|-------|------|------|
| Corner atoms | 8 | Decorative | ~8% of cube edge |
| Face-centered atoms | 6 | Clickable content | ~12% of cube edge |

### Face-Centered Atom Mapping

- Front face → Kelly Yang (About)
- Back face → Contact
- Top face → Education
- Bottom face → Projects
- Left face → Research
- Right face → Industry

### Bonds

- Each corner connects to adjacent face-centers
- 24 bonds total
- Thin white/light blue lines, ~20% opacity

### Cube Wireframe

- 12 edges forming the cube outline
- White, ~15% opacity
- Always visible, makes geometry obvious

---

## Visual Style

### Colors

- **Corner atoms:** Teal (#4fd1c5), translucent, static
- **Face-centered atoms:** Soft green/cyan (#68d391), glass-like, gentle pulse
- **Cube wireframe:** White, ~15% opacity
- **Bonds:** White/light blue, ~20% opacity
- **Background:** Deep navy (#0a0a14)

### Glass Effect

- Spheres have ~0.7 opacity
- MeshPhysicalMaterial for glass-like appearance
- Subtle environment reflection for depth

### Intuitiveness

- Clickable atoms have distinct color (green vs teal)
- Clickable atoms have subtle pulse animation
- Labels appear on hover (clickable atoms only)
- Cursor changes to pointer on hover

---

## Interactions

### Rotation

- **Auto-rotate:** ~0.2 RPM (slow, elegant)
- **On mouse enter:** Auto-rotate stops
- **Drag:** OrbitControls, smooth damping
- **Panel open:** Rotation pauses

### Click

- Click face-centered atom → panel slides in (60% width)
- Cube shrinks to left (40% viewport)
- Click different atom → content crossfades
- Click X or outside → panel closes

### Hover (clickable atoms only)

- Label fades in (e.g., "Research")
- Atom brightens slightly
- Cursor → pointer

---

## Entry Animation

1. Cube wireframe draws in (~0.5s)
2. Corner atoms fade in (~0.3s)
3. Face-centered atoms scale in with bounce (~0.4s)
4. Bonds draw between atoms (~0.3s)
5. Auto-rotation begins

---

## Mobile

- Bottom sheet (85% height) instead of side panel
- Cube visible at top (~15%)
- Touch to rotate
- Tap atoms to open content

---

## Technical Approach

### Stack

- Three.js + React Three Fiber
- @react-three/drei (OrbitControls)
- Framer Motion (panel animations)
- Tailwind CSS

### Component Structure

```
components/
  Crystal/
    Crystal.tsx        # Main scene, controls, auto-rotate
    Atom.tsx           # Sphere with glass material
    Bond.tsx           # Line between atoms
    CubeWireframe.tsx  # 12-edge wireframe
    AtomLabel.tsx      # Html label on hover
  Panel/
    (existing components)
```

### FCC Coordinates

Corner atoms (8):
- (0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1)
- (1, 1, 0), (1, 0, 1), (0, 1, 1), (1, 1, 1)

Face-centered atoms (6):
- (0.5, 0.5, 0) - front
- (0.5, 0.5, 1) - back
- (0.5, 0, 0.5) - bottom
- (0.5, 1, 0.5) - top
- (0, 0.5, 0.5) - left
- (1, 0.5, 0.5) - right

---

## Summary

- Proper 14-atom FCC structure
- 3D rotatable (auto + drag)
- Glass/translucent aesthetic
- Cube wireframe for clear geometry
- 6 clickable face-centered atoms → content panel
- 8 decorative corner atoms
- Clean, cool, geometric
