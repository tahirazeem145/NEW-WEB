# 3D Curved Cylindrical Portfolio Showcase

An award-winning interactive 3D WebGL portfolio experience inspired by Jesper Landberg's iconic curved cylinder gallery.

## Features

- **3D Curved Cylindrical Carousel**: High-performance WebGL cylindrical projection using Three.js with realistic concave card curvature and depth distortion.
- **Infinite Perspective Grid Floor**: Floating 3D perspective floor grid reacting dynamically to camera tilt and cylinder momentum.
- **Physics & Momentum Engine**: Smooth lerp damping, kinetic touch and pointer inertia, elastic boundaries, and slide snapping.
- **Rich Case Studies**:
  - *Griflan / Client Confessions*: Editorial board with interactive testimonial sticky notes and CTAs.
  - *Nathan Riley*: Architectural 3D render moodboard with dynamic multi-panel layouts.
  - *Casa Di Solare*: Sunlit brutalist architectural digital exhibition.
  - *Echovoid Studio*: Generative audiovisual lab.
  - *Monolith*: Luxury brand identity & editorial typography.
  - *Velox Motion*: Creative motion design & physics experimentation.
- **Interactive HUD & Overlays**:
  - Header with Profile Drawer & Bio/Awards.
  - Footer with "FEATURED / FULL" Grid toggle.
  - Newsletter interactive subscription modal.
  - Case Study deep-dive drawer.
  - Custom fluid magnetic cursor with dynamic contextual badges.
  - Web Audio API procedural sound synthesizer with mute control.

## Tech Stack

- **Three.js** - WebGL 3D scene, curved geometry, and shaders
- **GSAP** - Animation and easing utilities
- **Vite** - High-speed frontend build tool
- **Vanilla CSS** - Design tokens, typography, glassmorphism, responsive styling

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```
