# Interactive Lattice Upgrade Design

## Overview

Transform the portfolio website from a static 3D lattice with basic panel transitions into an immersive, physics-reactive experience that feels alive and connected.

## Goals

1. **Smoother panel transitions** - Replace jarring slide-in with organic crystal growth
2. **Physics-based interactivity** - Lattice responds to cursor presence
3. **Visual simulations** - Electron orbitals, energy flow, ambient pulses
4. **Unified visual language** - 3D world and 2D panel feel connected
5. **Balanced performance** - Effects work well on modern devices including mid-range phones

---

## Feature 1: Cursor Reactivity & Ambient Effects

### Mouse-Aware Lattice
- Track cursor position in 3D space using raycasting
- Atoms within ~1.5 units of cursor react:
  - Magnetic attraction: atoms drift subtly toward cursor
  - Glow intensifies based on proximity
  - Scale increases slightly (2-5%)
- Spring physics for smooth return to original positions

### Particle System
- 30-50 sparse floating particles in background
- Normal behavior: slow random drift
- Near cursor: attracted toward it, creating trailing "energy wisps"
- Subtle teal glow, instanced rendering for performance

### Bond Energy Flow
- Bonds near cursor subtly brighten
- Faint pulse travels along nearby bonds toward cursor
- Creates feeling that lattice is aware of user presence

### Performance
- Distance checks in `useFrame` to limit calculations
- Three.js `Points` with instancing for particles
- Reduced effects on mobile (fewer particles, smaller reaction radius)

---

## Feature 2: Panel Transition (Energy Burst → Crystal Growth)

### Phase 1: Energy Burst (0-400ms)
- Clicked atom flashes brightly (emissive intensity spike)
- Spherical shockwave emits from atom, expanding outward
- Semi-transparent ring/sphere that fades as it grows
- Other atoms jostle slightly as wave passes (subtle displacement)
- Particles scatter outward momentarily

### Phase 2: Lattice Response (200-600ms)
- Cube slowly rotates to present clicked face toward panel side
- Cube gracefully drifts to new position over ~400ms (not abrupt shift)
- Clicked atom remains highlighted with brighter glow
- Faint energy tendril extends from atom toward screen edge

### Phase 3: Panel Crystallization (400-900ms)
- Panel grows from edge (not slides in)
- Starts as thin glowing line, then expands
- Subtle crystalline/faceted appearance initially
- Sharp geometric edges soften into final rounded panel
- Glassmorphism blur fades in as panel solidifies

### Phase 4: Content Crystallize (800-1200ms)
- Content elements start blurred/fragmented
- Sharpen into focus with staggered timing (top to bottom)

---

## Feature 3: Visual Simulations

### Electron Orbitals (Face Atoms)
- 1-2 orbital rings per face atom when in hover/active proximity
- Thin glowing ellipses rotating at different angles/speeds
- 2-3 electron dots travel along paths
- Fade in on cursor approach, fade out on leave
- Active atom has persistent, prominent orbitals while panel open
- Color: Teal with subtle cyan-to-green gradient

### Energy Flow Along Bonds
- Small glowing particles travel along bond lines
- Direction: corner atoms → face atoms (energy concentration)
- Frequency increases near cursor
- Burst of particles along connected bonds when atom clicked

### Ambient Pulse Waves
- Every 8-10 seconds, subtle pulse from random face atom
- Ripples through lattice (opacity wave along bonds)
- Very subtle, just shows lattice is "alive"
- Disabled when panel is open

### Performance
- Orbitals: simple `Line` geometry with animated material
- Electron dots: small spheres, max 12 total
- Pulse waves: shader-based opacity changes

---

## Feature 4: Panel Close & Content Details

### Panel Closing (Reverse Crystal Growth)
- Content blurs/fragments first (200ms)
- Panel dissolves from inner edge outward
- Energy pulse travels back along tendril to atom
- Atom receives energy (brief flash)
- Cube rotates back to neutral, resumes auto-rotation
- Scattered particles drift back to normal

### Content Crystallization Effect
- Each content block animates independently
- Initial: `blur(4px)`, `opacity: 0.5`, Y offset +10px
- Final: `blur(0)`, `opacity: 1`, Y offset 0
- Stagger: 50-80ms between elements
- Easing: `easeOutQuint` for sharp snap into focus
- Optional shimmer effect on text

### Section-Specific Touches
- Experience cards: left border draws in top to bottom
- Skill tags: pop in with scale bounce
- Contact links: glow pulse on settle

### Close Button
- Hexagonal/crystalline shape instead of plain X
- Hover: faint glow, slight rotation

---

## Technical Architecture

### New Components

```
components/
├── Crystal/
│   ├── CrystalScene.tsx      # Add cursor tracking, pass mouse position
│   ├── Atom.tsx              # Magnetic attraction, proximity glow, orbitals
│   ├── Bond.tsx              # Energy flow particles, pulse wave support
│   ├── Particles.tsx         # NEW - Background particle system
│   ├── Orbitals.tsx          # NEW - Electron orbital rings + dots
│   ├── ShockWave.tsx         # NEW - Expanding energy burst effect
│   └── EnergyTendril.tsx     # NEW - Connection line to panel
├── Panel/
│   ├── Panel.tsx             # Replace slide with crystal growth
│   ├── CrystalPanel.tsx      # NEW - Crystal growth wrapper
│   └── ContentBlock.tsx      # NEW - Crystallize-in animation wrapper
```

### State Management
- Zustand store or React context for:
  - Mouse position (3D coordinates)
  - Animation phase: `idle` | `bursting` | `transitioning` | `open` | `closing`
  - Active atom reference
  - Mobile detection flag

### Animation Orchestration
- GSAP timeline for multi-phase panel transition
- `useFrame` for continuous animations (cursor tracking, orbitals, particles)
- Framer Motion for panel/content animations
- CSS custom properties for crystallize effect (GPU-accelerated)

### Libraries
- Three.js / React Three Fiber (existing)
- `@react-three/drei` helpers: `Trail`, `Float`, `useTexture`
- GSAP (already installed, underutilized)
- Framer Motion (existing)

### Performance Strategy
- Mobile detection to reduce:
  - Particle count (30-50 → 15-20)
  - Reaction radius
  - Orbital complexity
- Instanced rendering for particles
- Distance-based LOD for effects
- `useMemo` for geometry/materials
- Throttled raycasting (not every frame)

---

## Animation State Machine

```
┌─────────┐
│  idle   │◄────────────────────────────┐
└────┬────┘                             │
     │ click atom                       │
     ▼                                  │
┌──────────┐                            │
│ bursting │ (0-400ms)                  │
└────┬─────┘                            │
     │                                  │
     ▼                                  │
┌──────────────┐                        │
│ transitioning│ (200-900ms)            │
└──────┬───────┘                        │
       │                                │
       ▼                                │
┌──────────┐                            │
│   open   │ (panel visible)            │
└────┬─────┘                            │
     │ close                            │
     ▼                                  │
┌──────────┐                            │
│ closing  │ (0-600ms)                  │
└────┬─────┘                            │
     │                                  │
     └──────────────────────────────────┘
```

---

## Implementation Order

1. **Cursor tracking & state management** - Foundation for reactivity
2. **Particle system** - Background ambiance
3. **Atom magnetic attraction & glow** - Core interactivity
4. **Bond energy flow** - Enhanced lattice life
5. **Electron orbitals** - Visual simulation
6. **Shockwave effect** - Transition phase 1
7. **Panel crystal growth** - Transition phases 2-3
8. **Content crystallization** - Transition phase 4
9. **Panel close animation** - Reverse transition
10. **Polish & mobile optimization** - Performance tuning

---

## Success Criteria

- Panel transitions feel organic and connected to the 3D world
- Cursor interaction feels responsive and magical
- Site runs smoothly on MacBook Air M1 and iPhone 12+
- Visual effects enhance rather than distract from content
- The materials science theme is reinforced through crystal/atomic metaphors
