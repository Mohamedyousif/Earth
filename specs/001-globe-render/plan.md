# Implementation Plan: Globe Rendering Engine

**Branch**: `001-globe-render` | **Date**: 2026-05-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-globe-render/spec.md`

---

## Summary

Implement the 3D interactive globe rendering engine — the foundational visual
layer of Wonder Earth. This includes: a realistic Earth sphere with cinematic
lighting and starfield, idle auto-rotation, drag-to-rotate with inertia, scroll
zoom with bounded limits, an atmospheric loading screen with fade-out transition,
and a graceful on-brand error state for unsupported browsers.

This is a client-only feature. All globe rendering is deferred to the browser via
Next.js dynamic imports with SSR disabled.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Framework**: Next.js 14 (App Router)
**Primary Dependencies**:
- `react-globe.gl` — globe rendering (Three.js-backed WebGL globe)
- `zustand` — globe lifecycle state management
- `framer-motion` — loading screen fade-out animation
- `tailwindcss` — all styling

**Storage**: Static assets only (`/public/textures/` — Earth texture JPGs, ≤ 800KB total)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Desktop browsers — Chrome/Firefox/Edge 100+, Safari 16+; WebGL 2.0 required; min 1280×720px
**Project Type**: Web application (Next.js 14, SSR disabled for globe component)
**Performance Goals**: 60 FPS, <4s initial load, <100ms interaction latency
**Constraints**:
- Globe must be dynamically imported (`ssr: false`) — WebGL cannot run on server
- No mobile/touch support in this feature
- Textures must be pre-bundled; no runtime API calls

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Discovery First | ✅ Pass | The globe is the discovery substrate; nothing else exists without it |
| II. Natural Earth First | ✅ Pass | Globe renders without borders/labels by default; realistic textures required |
| III. Atmosphere Over Utility | ✅ Pass | Loading screen, starfield, atmospheric lighting all serve immersion |
| IV. Extensible Earth Object Model | ✅ Pass | Globe state is isolated; does not block or couple to entity model |
| V. Time-Aware Discoveries | ✅ N/A | No discovery data in this feature; architecture does not block temporal metadata |
| VI. Performance First | ✅ Pass | 60 FPS target; OrbitControls damping is GPU-accelerated; no heavy ops in render loop |
| VII. Use Proven Abstractions | ✅ Pass | react-globe.gl (globe.gl + Three.js), Framer Motion, Tailwind |
| VIII. Desktop-First MVP | ✅ Pass | Spec explicitly excludes mobile/touch |
| IX. Multi-Agent Validation | ⚠️ Required | Major architectural feature — multi-agent review required before merge to main |
| X. Mystical Tone Consistency | ✅ Pass | FR-013: loading screen and error state must be dark/atmospheric; verified in spec |

**Post-design re-check**: All principles satisfied. No violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-globe-render/
├── spec.md                          # Feature specification
├── plan.md                          # This file
├── research.md                      # Phase 0 — technical decisions
├── data-model.md                    # Entity definitions and state machine
├── quickstart.md                    # Setup and verification guide
├── contracts/
│   └── component-interfaces.md     # TypeScript component prop interfaces
└── checklists/
    └── requirements.md             # Spec quality checklist
```

### Source Code (repository root)

```text
app/
├── layout.tsx          # Root layout: dark background, global font, metadata
├── page.tsx            # Root page: renders <GlobeContainer />
└── globals.css         # Tailwind base + CSS custom properties

components/
├── Globe/
│   ├── GlobeContainer.tsx   # 'use client' — WebGL detection, state orchestration
│   ├── GlobeScene.tsx       # 'use client' — react-globe.gl wrapper
│   └── useGlobeControls.ts  # Custom hook — auto-rotation, pause/resume, resize
└── UI/
    ├── LoadingScreen.tsx    # Full-screen Framer Motion loading screen
    └── WebGLErrorState.tsx  # On-brand error page for unsupported browsers

lib/
├── constants/
│   └── globe.ts         # GlobeConfig constants (texture paths, zoom limits, timing)
├── hooks/
│   └── useGlobeState.ts # Zustand store: status, setReady, setError
└── types/
    └── globe.ts         # LoadingStatus type, GlobeConfig interface

public/
└── textures/
    ├── earth-day.jpg        # NASA Blue Marble 4K (≤ 600KB)
    ├── earth-specular.jpg   # Ocean specular map (≤ 100KB)
    └── earth-bump.jpg       # Elevation bump map (≤ 100KB)
```

**Structure Decision**: Single Next.js project at repo root. Globe rendering is
entirely client-side; App Router is used for routing only.

---

## Key Implementation Notes

### Dynamic Import Pattern
`GlobeScene` must be wrapped in `next/dynamic` with `{ ssr: false }` inside
`GlobeContainer`. This is the only approved pattern for WebGL in Next.js 14 App Router.
See `research.md` R-001.

### WebGL Detection
Run `document.createElement('canvas').getContext('webgl2') !== null` inside a
`useEffect` in `GlobeContainer`. If `false`, call `setError()` and render
`WebGLErrorState`. Never attempt globe mount without this check. See R-004.

### Idle Rotation + Pause/Resume
In `useGlobeControls` after mount: set `controls.autoRotate = true`, listen to
`'change'` event to pause and start a 5-second inactivity timer, resume on timer
fire. See R-002.

### Inertia
OrbitControls damping on by default. Set `controls.dampingFactor = 0.08`.
See R-003.

### Loading Screen Timing
Minimum display 400ms, fade-out 600ms via Framer Motion `useAnimate`.
`onHidden` callback unmounts the overlay after animation. See R-007.

### Zoom Constraints
`controls.minDistance = 101`, `controls.maxDistance = 500` set in `useGlobeControls`.

---

## Verification

Follow `quickstart.md` end-to-end:

1. `npm run dev` → open localhost:3000
2. Visual: globe visible, textured, starfield, atmospheric glow, idle rotation
3. Drag: rotates in drag direction, inertia after release, auto-rotation resumes
4. Zoom: scroll in/out, hard limits enforced
5. Loading screen: throttle network → loading screen visible on open
6. Error state: patch `hasWebGL2()` to return `false` → on-brand error visible
7. Performance: Chrome DevTools → ≥ 60 FPS during interaction
8. `npm run test` → Vitest unit tests pass
9. `npx playwright test` → E2E tests pass
