# Crystal Lattice Portfolio — Design Document

**Author:** Kelly Yang
**Date:** February 13, 2026
**Status:** Ready for implementation

---

## Overview

A personal portfolio website where a crystal lattice assembles as visitors scroll, visualizing Kelly's career in materials science and EECS. The crystal is the centerpiece — prominent, animated, and interactive — while content remains clean and readable.

---

## Core Concept

### The Metaphor

The portfolio is a crystal lattice that grows as visitors scroll. Each atom (node) represents a piece of Kelly's story — a role, a project, a milestone. Bonds between atoms show how experiences connect. By the end, visitors see a complete, interconnected structure representing Kelly's career.

### Visual Language

**Color Palette:**
- Background: Deep navy/black (electron microscope aesthetic)
- Atoms: Soft glowing blues and teals (electron orbital feel)
- Accent: Warm gold/amber for highlights and CTAs
- Bonds: Subtle white or light blue connecting lines

**Typography:**
- Primary: Clean, modern sans-serif (Inter, Space Grotesk, or IBM Plex)
- Name: Slightly geometric/technical font
- Body: 16-18px minimum, line-height 1.5-1.6
- High contrast white/light gray on dark background

**Overall Vibe:**
Scientific but approachable. Research paper meets high-end tech company. The glowing atoms add warmth and life.

---

## The Scroll Experience

### Hero Section

- Dark screen with a single glowing atom pulsing gently in the center
- Kelly's name fades in beside it
- No explicit "scroll to explore" — let users discover naturally

### Scroll Progression

As the user scrolls, the lattice grows. Each section triggers a growth phase:

1. **About** — 3-4 atoms cluster around the central node, forming the first unit cell. Bio text appears in a glassmorphic panel.

2. **Experience** — Lattice expands outward. Each role is an atom that bonds in. Atom sizes vary by significance.

3. **Projects** — A distinct branch forms. Research projects get prominent nodes with visible connections.

4. **Education** — A stable base layer anchors the structure (Berkeley, CU Boulder, Fairview).

5. **Contact** — Crystal complete. Gentle rotation. Contact links appear.

### Navigation

Minimal floating dots allow jumping to sections. Clicking a dot scrolls and animates the crystal to that growth state.

---

## Content Layout

### Crystal as the Main Event

- Crystal is full-width and central — the first thing people see
- Content appears *within* the crystal space via glassmorphic (frosted glass) panels
- When reaching a section, the crystal shifts to accommodate content
- Text floats over/beside the crystal — visible through panels but always crisp

### "Oomph" Moments

1. **Hero:** First atom appears with pulse/glow effect, faint particle trail
2. **Growth transitions:** Atoms fly in and bond with a satisfying snap, soft glow on connection
3. **Complete crystal:** Slow, elegant rotation — the "wow" moment
4. **Node interaction:** Clicking an atom zooms/focuses with the rest fading slightly

---

## Project Showcase

### Featured Projects (Large Atoms)

Three hero-status projects with larger, more luminous nodes:

1. **Topological Quantum Materials** — Khan Lab, UC Berkeley (current)
2. **Electronic Skin Sensors** — Xiao Lab, CU Boulder (piezoresistive pressure + temperature)
3. **Thermal Ground Planes** — Lee Lab, CU Boulder (power plant dry cooling)

### Project Expansion

Clicking a featured project atom:
- Crystal zooms in on that node
- Panel slides in with:
  - Project title + lab affiliation
  - Problem being solved
  - Kelly's contribution
  - Key outcomes/results
  - Optional: image, diagram, publication link
- Surrounding atoms fade but remain visible for context

### Connection Bonds

Bonds between atoms show relationships:
- Electronic Skin → Thermal Ground Planes (materials/sensing)
- Quantum Materials → EECS connection
- Visual cue: different colors/thicknesses for connection types

### Secondary Experience

Non-research roles (Kelvin Thermal, IT internship, teaching) appear as smaller nodes — part of the lattice, clickable, but visually secondary.

---

## Mobile Experience

### Scaled, Not Stripped

- **Vertical lattice:** Crystal builds downward, fitting portrait orientation
- **Smaller atoms:** ~60% of desktop size, fewer visible at once
- **Tap to expand:** Tapping a node opens content as a bottom sheet
- **Performance:** Reduced particles/effects to keep it smooth

---

## Contact Section

When visitors reach the bottom:
- Full crystal assembled, doing slow rotation
- Contact info in a floating panel:
  - Email: kellyang2006@gmail.com
  - LinkedIn
  - Optional: GitHub, resume PDF download
- CTA: "Let's connect"

---

## Easter Egg

Clicking the central "Kelly" atom triggers the crystal to briefly rearrange into a different structure (FCC ↔ BCC) with a playful message. A small, memorable moment.

---

## Content Inventory

### About
- Short bio
- Current status: UC Berkeley Joint B.S. in MSE/EECS student (May 2028)
- Research interests: topological quantum materials, electronic skin, thermal management, brain-computer interfaces

---

## Research Experience

**UC Berkeley EECS — Khan Lab** | Research Intern
*January 2026 – Present | Berkeley, CA*
- Researching topological quantum materials for nanoelectronics
- [FEATURED PROJECT — large atom node]

**Northeastern University** | Research Assistant
*February 2025 – March 2025 | Boston, MA*
- Developed machine learning models for brain-computer interfaces
- [Connects to EEG Motor Imagery Classification project]

**University of Colorado Boulder — Xiao Lab** | Design Engineer
*October 2022 – August 2024 | Boulder, CO*
- **2021-2022: Under Pressure** — Piezoresistive pressure sensors for electronic skin
- **2022-2023: Skin PT** — Pressure and temperature sensors for electronic skin
- Engineered polymer-based piezoresistive sensors by optimizing material composition and microstructure
- Improved signal sensitivity for prosthetics users
- [FEATURED PROJECT — large atom node]

**University of Colorado Boulder — Lee Lab** | Design Engineer
*2023 – 2024 | Boulder, CO*
- **Enhancing Dry Cooling in Power Plants** — Novel application of high-conductivity thermal ground planes
- Designed dry-cooling system for thermoelectric plants to reduce fuel consumption and CO2 emissions in drought regions
- Analyzed thermal performance data (NumPy/Pandas) across multiple cooling configurations
- [FEATURED PROJECT — large atom node]

---

## Industry Experience

**Kelvin Thermal Technologies** | Thermal Ground Plane Engineering & Manufacturing Intern
*June 2024 – August 2024 | Longmont, CO*
- Manufactured thermal ground planes (TGPs) for satellite and VR cooling applications
- Produced 100+ units for clients
- Automated thermal performance analysis using Python, reducing data processing time by 60%
- [Connects to Lee Lab thermal research]

**Boulder Valley School District** | Information Technology Intern
*June 2024 – August 2024 | Boulder, CO*
- Conducted IT system upgrades and database migrations for 30,000+ students and staff
- Automated system maintenance tasks using Python, reducing manual workload

**City of Boulder** | Youth Opportunities Intern
*June 2023 – July 2023 | Boulder, CO*
- [NEEDS DESCRIPTION — what did you do here?]

---

## Design & Engineering Experience

**CU Science Discovery / Build a Better Book** | Engineering & Design Intern
*June 2022 – March 2025 | Boulder, CO*
- Summer 2022 intern
- Spring 2025 extension program intern
- **CVI Storytelling System (Apr–Jun 2025):** Developed an interactive storytelling system for a child with cortical visual impairment (CVI)
- Programmed Arduino-driven sensor, audio, and lighting interactions to enhance engagement

---

## Teaching

**Bohua Chinese School** | Elementary School Math Olympiad Teacher
*August 2020 – February 2025 | Boulder, CO*
- Taught math olympiad preparation to elementary school students for 4+ years
- [NEEDS DESCRIPTION — class size? age range? any standout moments?]

---

## Projects

### Featured Projects (Large Atom Nodes)

**MatExplorer** | React, Three.js, FastAPI, PostgreSQL, Redis, pymatgen
- Built web platform for exploring computational materials with 3D crystal structure visualization
- Implemented similarity search using PostgreSQL/pgvector
- Integrated Materials Project API data with pymatgen analysis and ML property predictions
- *Note: This project is thematically perfect for your portfolio — you literally built a crystal visualizer!*

**EEG Motor Imagery Classification** | PyTorch, MNE, scikit-learn, NumPy/SciPy
- Developed deep learning models for motor imagery classification from EEG signals
- Implemented preprocessing pipeline (MNE) for artifact removal and feature extraction
- Trained on BCI Competition IV dataset (22 channels, 4 classes)
- [Connects to Northeastern BCI research]

**Electronic Skin Sensors (Xiao Lab)** | Materials Science
- Piezoresistive pressure sensors (Under Pressure)
- Pressure and temperature sensors (Skin PT)
- Optimized polymer material composition and microstructure for prosthetics applications

**Thermal Ground Planes for Power Plants (Lee Lab)** | CAD, NumPy/Pandas
- Designed dry-cooling system using high-conductivity thermal ground planes
- Goal: reduce fuel usage and CO2 emissions in drought-affected regions
- Analyzed thermal performance data across multiple cooling configurations

**Topological Quantum Materials (Khan Lab)** | Current Research
- Investigating topological quantum materials for nanoelectronics applications
- [Add more detail as research progresses]

---

## Extracurricular

**Cal Hacks** | Tech Director
*September 2025 – Present | Berkeley, CA*
- Developed live event website using TypeScript and Effect
- Supporting world's largest collegiate hackathon with 3,300+ hackers

---

## Education

| School | Program | Timeline |
|--------|---------|----------|
| UC Berkeley College of Engineering | Joint B.S. in Materials Science & Engineering / EECS | Expected May 2028 |
| University of Colorado Boulder | Concurrent Enrollment | May 2022 – May 2023 |
| Fairview High School | High School Diploma / IB Diploma | Graduated |

---

## Technical Skills

**Languages:** Python, TypeScript, SQL, C++

**Frameworks & Libraries:** React, React Native, Node.js, FastAPI, PyTorch, scikit-learn, Three.js, NumPy/Pandas, MNE, pymatgen

**Databases & Infrastructure:** PostgreSQL, MongoDB, Redis, REST APIs, pgvector

**Hardware & Tools:** Arduino, CAD Software, Git, Linux, Jupyter

**Languages (Human):** Chinese (Native), English (Native), Spanish (Limited Working)

---

## Honors & Awards

- **Carnegie Hall Performer** — American Protégé International Piano and Strings Competition
- **Broadcom MASTERS Top 300** — National STEM competition semifinalist
- **Colorado Science and Engineering Fair Finalist**
- **AMC Maryam Mirzakhani Certificate Winner** — American Mathematics Competition
- **Royal Conservatory of Music Level 10** — Practical Exam

---

## Items Needing More Detail

The following need descriptions from you:

1. **City of Boulder Youth Opportunities Intern** — What did you work on?
2. **Bohua Chinese School** — Any specific achievements, class size, curriculum you developed?
3. **Khan Lab (current)** — As your research progresses, add specifics

---

## Technical Notes (For Implementation)

**Recommended Technologies:**
- Three.js or React Three Fiber for 3D crystal rendering
- GSAP or Framer Motion for scroll-triggered animations
- Next.js or vanilla HTML/CSS/JS depending on preference
- Intersection Observer API for scroll detection

**Performance Considerations:**
- Lazy load 3D assets
- Reduce particle count on mobile
- Use requestAnimationFrame for smooth animations
- Consider fallback for browsers without WebGL

---

## Next Steps

1. Find a developer or learn the tech stack
2. Create wireframes/mockups for each section
3. Source or create 3D atom/bond assets
4. Build hero section first as proof of concept
5. Iterate based on performance and feel
