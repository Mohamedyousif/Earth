# Research: Globe Rendering Engine

**Feature**: 001-globe-render
**Date**: 2026-05-08
**Status**: Complete — all unknowns resolved

---

## R-001: SSR Compatibility (react-globe.gl in Next.js 14)

**Decision**: Use `next/dynamic` with `{ ssr: false }` to import the Globe component.

**Rationale**: react-globe.gl uses Three.js internally, which requires browser APIs
(`window`, `canvas`, `WebGLRenderingContext`) that do not exist during server-side
rendering. A dynamic import with SSR disabled defers the entire WebGL initialization
to the client, preventing build-time errors and runtime failures.

**Pattern**:
```typescript
// GlobeScene.tsx — the actual react-globe.gl wrapper, marked 'use client'
// GlobeContainer.tsx — parent that does the dynamic import:
const GlobeScene = dynamic(() => import('./GlobeScene'), { ssr: false });
```

**Alternatives considered**:
- `typeof window !== 'undefined'` guards — error-prone; does not prevent SSR attempt
- Custom Webpack externals — unnecessary; `dynamic()` handles it cleanly

---

## R-002: Auto-Rotation with Pause/Resume

**Decision**: Access `globeRef.current.controls()` (Three.js OrbitControls) and
toggle `controls.autoRotate`. Pause on the `'change'` event; resume after a
5-second inactivity timeout.

**Rationale**: react-globe.gl exposes the underlying OrbitControls object via a
ref accessor. Setting `autoRotate = true/false` on OrbitControls is the canonical
Three.js pattern. The `'change'` event fires on any camera movement (drag, scroll,
programmatic), so it is the correct trigger for pausing.

**Inactivity timeout**: 5 seconds after last interaction before auto-rotation resumes.
This is long enough to not interrupt exploration, short enough to maintain the
atmospheric feel of a living globe.

**Alternatives considered**:
- DOM mouse event listeners on the canvas — miss programmatic camera moves
- Zustand-driven rotation state — overcomplicated; OrbitControls state is local to Three.js

---

## R-003: Drag Inertia

**Decision**: Rely on Three.js OrbitControls' built-in inertial damping. No custom
implementation needed.

**Rationale**: react-globe.gl enables OrbitControls with damping by default. After
drag release, OrbitControls applies a damping factor that produces natural
deceleration. The default `dampingFactor` of 0.05 produces inertia of approximately
1–2 seconds — within the spec's target of 0.5–3 seconds.

**Tuning if needed**: `controls.dampingFactor = 0.08` (slightly more inertia).

**Alternatives considered**:
- GSAP InertiaPlugin — unnecessary overhead; Three.js already provides this
- Manual velocity tracking — reinventing the wheel; introduces edge cases

---

## R-004: WebGL 2.0 Detection

**Decision**: Synchronous canvas context check: `document.createElement('canvas').getContext('webgl2') !== null`.

**Rationale**: Fast, synchronous, standard approach per MDN. Must run on the client
only (inside a `useEffect` or after dynamic import). If `null`, render the
`WebGLErrorState` component instead of attempting globe initialization.

**Alternatives considered**:
- Browser version detection — unreliable; GPU driver compatibility matters more
- Attempt render and catch errors — causes visual glitches before the error state appears

---

## R-005: Earth Textures

**Decision**: Use Solar System Scope textures (NASA Blue Marble, CC-BY 4.0) at
**4K resolution (4096×2048 JPG)** for day map. Compress to WebP where supported.

**Files**:
- `earth-day.jpg` — Blue Marble day map (~400KB at 4K WebP)
- `earth-specular.jpg` — Ocean specular highlight map
- `earth-bump.jpg` — Elevation bump/normal map for atmospheric depth

**Load target rationale**: 4K JPG at ~400KB renders credibly at globe zoom levels
and loads well under 1 second on broadband, leaving budget for other assets within
the 4-second total load target.

**Source**: [solarsystemscope.com/textures](https://www.solarsystemscope.com/textures/) — free with attribution.

**Alternatives considered**:
- 8K textures — ~3–4 MB; risks exceeding the 4-second load budget
- 2K textures — fast but pixelated at country-level zoom (max zoom per spec)
- Procedural textures — lack the photorealism required by Principle II

---

## R-006: Viewport Resize Handling

**Decision**: Attach a `ResizeObserver` to the globe's container `div` and call
`globeRef.current.width(width)` / `.height(height)` on each observation.

**Rationale**: The Three.js renderer does not resize automatically when its
container changes size. `ResizeObserver` is more reliable than `window.resize`
because it detects container-level changes (e.g., sidebar opening). The
react-globe.gl ref exposes `.width()` and `.height()` setter methods for this.

**Alternatives considered**:
- `window.addEventListener('resize')` — misses container-level resizes
- CSS width/height 100% alone — canvas stretches/distorts without explicit JS calls

---

## R-007: Loading Screen Fade-Out Pattern

**Decision**: Framer Motion `useAnimate` hook with an imperative `animate()` call
triggered by the globe's `onGlobeReady` callback. Animate opacity only (compositor
thread; no layout thrash).

**Rationale**: `AnimatePresence` with exit animations does not work reliably in
Next.js 14 App Router for imperative async triggers. `useAnimate` is the correct
Framer Motion API for "trigger this animation when X happens." Opacity-only
animations run on the GPU compositor and maintain 60 FPS.

**Pattern**: `LoadingScreen` starts at `opacity: 1`. When `onGlobeReady` fires,
`animate(scope.current, { opacity: 0 }, { duration: 0.6 })` runs, then the
component unmounts.

**Fast-load handling**: A minimum display duration of 400ms prevents a flash
if assets load immediately (SC-004: loading screen appears within 200ms; must
also not disappear instantly).

**Alternatives considered**:
- `AnimatePresence` — broken for async exit triggers in Next.js 14 App Router
- CSS Tailwind transitions — no imperative control over timing
- Suspense boundaries — designed for data fetching, not WebGL initialization events
