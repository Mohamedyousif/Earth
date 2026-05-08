# Quickstart: Globe Rendering Engine

**Feature**: 001-globe-render
**Branch**: `001-globe-render`

---

## Prerequisites

- Node.js 20+
- npm 10+
- A supported browser: Chrome 100+, Firefox 100+, Edge 100+, Safari 16+
- Earth textures downloaded to `/public/textures/` (see step 3)

---

## Setup

### 1. Initialize the Next.js project

From `D:\WorkSpace\Earth`:

```bash
npx create-next-app@14 . --typescript --tailwind --app --src-dir no --import-alias "@/*"
```

Answer prompts:
- ESLint: Yes
- Tailwind CSS: Yes (pre-selected)
- `src/` directory: No
- App Router: Yes
- Import alias: `@/*`

### 2. Install feature dependencies

```bash
npm install react-globe.gl zustand framer-motion
npm install --save-dev @types/three vitest @vitejs/plugin-react playwright
```

### 3. Download Earth textures

Download and place in `/public/textures/`:

- **earth-day.jpg** — 4K Blue Marble from [solarsystemscope.com/textures](https://www.solarsystemscope.com/textures/)
- **earth-specular.jpg** — Specular map (same source)
- **earth-bump.jpg** — Bump map (same source)

Verify:
```
public/
└── textures/
    ├── earth-day.jpg
    ├── earth-specular.jpg
    └── earth-bump.jpg
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verification Checklist

After `npm run dev`, verify each user story:

**US1 — Globe renders:**
- [ ] 3D Earth sphere visible within 4 seconds of page open
- [ ] Realistic surface textures (not a solid color sphere)
- [ ] Atmospheric glow visible around the globe edge
- [ ] Starfield visible behind the globe
- [ ] Globe rotates slowly when idle

**US2 — Globe responds to drag:**
- [ ] Click and drag rotates the globe in the drag direction
- [ ] No perceptible lag between drag and globe movement
- [ ] Releasing the drag leaves the globe decelerating naturally (not snapping)
- [ ] Idle rotation pauses while dragging, resumes ~5 seconds after release

**US3 — Zoom works:**
- [ ] Scroll wheel zooms in/out smoothly
- [ ] Cannot zoom further out than full-globe view
- [ ] Cannot zoom further in than country-level detail

**US4 — Loading screen:**
- [ ] Opening the page shows a loading screen before the globe appears
- [ ] Loading screen fades out smoothly when the globe is ready
- [ ] Throttle network to "Slow 3G" in DevTools — loading screen remains visible

**US5 — Error state (simulate):**
- Temporarily patch `hasWebGL2()` to return `false` in `GlobeContainer.tsx`
- [ ] Error message shown instead of globe
- [ ] Error message is dark-themed (not a white error page)
- [ ] Error message names a supported browser

---

## Performance Check

Open Chrome DevTools → Performance tab:

- [ ] FPS counter shows ≥ 60 FPS during globe rotation
- [ ] Lighthouse → Performance → LCP under 4 seconds on simulated 4G

---

## Common Issues

**Globe is blank / white sphere**: Textures not in `/public/textures/` or wrong filename.

**"Module not found" on react-globe.gl**: Run `npm install` again; confirm package is in `package.json`.

**Globe flickers on initial load**: Ensure `GlobeScene` is dynamically imported with `{ ssr: false }`.

**Auto-rotation doesn't pause on drag**: Confirm `useGlobeControls` is wired to the correct ref.
