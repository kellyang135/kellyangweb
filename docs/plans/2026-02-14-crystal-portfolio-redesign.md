# Crystal Lattice Portfolio — Redesign

**Author:** Kelly Yang
**Date:** February 14, 2026
**Status:** Ready for implementation

---

## Overview

A personal portfolio where an FCC crystal lattice IS the interface. Not a background decoration — the lattice is the navigation and core experience. Click nodes to reveal content in a side panel.

---

## Core Concept

### The Structure

- Single full-screen FCC (Face-Centered Cubic) crystal lattice in isometric view
- 6 main nodes representing content categories
- Dark background, constellation aesthetic, depth-based color gradient
- No scrolling on main view — click nodes to explore

### The Nodes

| Node | Content |
|------|---------|
| **Kelly Yang** (center) | Bio, research interests |
| **Research** | Khan Lab, Xiao Lab, Lee Lab, Northeastern |
| **Industry** | Kelvin Thermal, BVSD, Build a Better Book, Cal Hacks |
| **Projects** | MatExplorer, EEG Classification, Electronic Skin, Thermal Ground Planes, Quantum Materials |
| **Education** | Berkeley, CU Boulder, Fairview, Skills |
| **Contact** | Email, LinkedIn |

### Interaction Model

1. Click node → 60% side panel slides in from right
2. Lattice compresses to 40% on left, stays visible and interactive
3. Click different node → panel content swaps (no close/reopen)
4. Click X or empty space → panel closes, lattice expands back

---

## Visual Design

### Color Palette

- **Background:** Deep navy/black (#0a0a14)
- **Front nodes:** Teal (#4fd1c5)
- **Back nodes:** Purple (#b794f4)
- **Bonds:** White/light blue, low opacity (~20%)
- **Text:** White (#f7fafc) and muted gray (#a0aec0)

### Depth-Based Gradient

Nodes shift color based on their z-position in the isometric view:
- Nodes in "front" of the lattice → teal
- Nodes toward "back" → purple
- Reinforces 3D depth without complex rendering

### Node Styling

- Glowing circles with soft edges
- Front nodes slightly larger than back nodes
- Labels in clean sans-serif (Inter), positioned near nodes

### Bond Styling

- Thin lines connecting nodes through lattice structure
- Subtle, low opacity (~0.2)
- All nodes connect through central "Kelly" node

---

## Side Panel

### Layout

- **Width:** 60% of viewport
- **Background:** Slightly lighter dark (#12121a) or subtle glassmorphism
- **Close button:** X in top right
- **Header:** Category name, large
- **Content:** Scrollable area

### Content Per Section

**Kelly / About**
- Name and tagline
- Bio (research interests from design doc)

**Research**
- List of positions
- Each: role, organization, location, dates
- Bullet points for details
- Featured indicator for major labs

**Industry**
- Same format as research

**Projects**
- Project title
- Tech stack as tags
- Description bullets
- Links if applicable

**Education**
- Schools with degrees and dates
- Technical skills (languages, frameworks, tools, etc.)
- Full honors & awards list:
  - Carnegie Hall Performer — American Protégé International Piano and Strings Competition
  - Broadcom MASTERS Top 300 — National STEM competition semifinalist
  - Colorado Science and Engineering Fair Finalist
  - AMC Maryam Mirzakhani Certificate Winner — American Mathematics Competition
  - Royal Conservatory of Music Level 10 — Practical Exam

**Contact**
- Email (clickable mailto)
- LinkedIn (clickable link)

---

## Animations

### Entry Animation (~1 second)

1. Page loads with dark background
2. Nodes fly in from scattered positions
3. Nodes snap into FCC lattice positions
4. Bonds draw in after nodes settle
5. Central "Kelly" node glows briefly

### Panel Transitions

- Panel slides in from right (300ms ease-out)
- Lattice compresses simultaneously
- Node-to-node: content crossfades
- Panel close: slides out, lattice expands

### Hover States

- Node glow intensifies (150ms)
- Slight scale up (1.05x)
- Cursor → pointer

### Ambient (subtle)

- Gentle pulse on nodes (opacity breathing)
- Optional: very slow lattice rotation (~1°/sec)

---

## Mobile Experience

### Layout

- Lattice scales to fit mobile viewport
- Same isometric FCC structure, smaller
- Larger tap targets (min 44px)
- Labels hidden until tap, or smaller text

### Interaction

- Tap node → bottom sheet slides up (full height, scrollable)
- Handle at top to drag down and close
- Lattice visible at top (~30%) when sheet is open
- Tap different node → content swaps

### Adjustments

- Entry animation faster (~0.7s)
- Bonds thinner or simplified if cluttered
- No hover states (touch device)

---

## Technical Approach

### Recommended Stack

- **Framework:** Next.js (already set up)
- **Rendering:** SVG or Canvas for the lattice (simpler than Three.js for 2D isometric)
- **Animation:** Framer Motion or GSAP for smooth transitions
- **Styling:** Tailwind CSS

### Why SVG over Three.js

- 2D isometric projection doesn't need WebGL
- Better text rendering and accessibility
- Simpler hit detection for clicks
- Lighter weight, faster load
- Easier to style with CSS

### Component Structure

```
app/
  page.tsx              # Main page
components/
  Lattice/
    Lattice.tsx         # SVG lattice container
    Node.tsx            # Individual node component
    Bond.tsx            # Connection lines
    LatticeLayout.ts    # FCC position calculations
  Panel/
    Panel.tsx           # Side panel container
    PanelContent.tsx    # Content renderer
    sections/           # Content for each section
      AboutContent.tsx
      ResearchContent.tsx
      IndustryContent.tsx
      ProjectsContent.tsx
      EducationContent.tsx
      ContactContent.tsx
lib/
  content.ts            # Portfolio content data (already exists)
  latticePositions.ts   # FCC node positions for isometric view
```

---

## Summary

**What we're building:**
- Full-screen interactive FCC crystal lattice
- 6 category nodes in isometric view
- Click node → 60% scrollable side panel
- Constellation aesthetic with depth-based teal→purple gradient
- 1-second assembly animation on load
- Mobile: scaled lattice with bottom sheet

**What makes it unique:**
- The lattice IS the interface, not decoration
- Crystallographically accurate FCC structure
- Clean, minimal, professional
- Authentic to materials science background

---

## Next Steps

1. Create implementation plan
2. Set up git worktree for isolated development
3. Build lattice component (SVG-based)
4. Build side panel with content
5. Add animations
6. Mobile optimization
