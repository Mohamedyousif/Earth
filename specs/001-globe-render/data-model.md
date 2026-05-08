# Data Model: Globe Rendering Engine

**Feature**: 001-globe-render
**Date**: 2026-05-08

---

## Entities

### GlobeState (Zustand store)

The single source of truth for globe lifecycle and interaction state.

```typescript
type LoadingStatus = 'loading' | 'ready' | 'error';

interface GlobeState {
  // Lifecycle
  status: LoadingStatus;

  // Actions
  setReady: () => void;
  setError: () => void;
}
```

**State transitions**:

```
loading → ready   (globe onGlobeReady callback fires)
loading → error   (WebGL 2.0 unavailable, or Three.js initialization failure)
```

`error` and `ready` are terminal states for the session. No transition back to
`loading` — a page reload is required.

---

### GlobeConfig (read-only configuration constants)

Not stored in Zustand. Defined as constants in `lib/constants/globe.ts`.

```typescript
interface GlobeConfig {
  // Texture asset paths (relative to /public)
  textures: {
    day: string;         // '/textures/earth-day.jpg'
    specular: string;    // '/textures/earth-specular.jpg'
    bump: string;        // '/textures/earth-bump.jpg'
  };

  // Rotation behaviour
  rotation: {
    idleSpeed: number;           // Degrees/frame for auto-rotation (e.g., 0.1)
    inactivityTimeoutMs: number; // ms before auto-rotation resumes (e.g., 5000)
    dampingFactor: number;       // OrbitControls damping (e.g., 0.08)
  };

  // Zoom constraints
  zoom: {
    minDistance: number;  // Camera distance at full-globe view (e.g., 250)
    maxDistance: number;  // Camera distance at country-level zoom (e.g., 500)
  };

  // Loading screen
  loading: {
    minDisplayMs: number;     // Minimum time loading screen shows (e.g., 400)
    fadeOutDurationMs: number; // Opacity fade-out duration (e.g., 600)
  };
}
```

---

### Viewport (derived, not stored)

The globe reads container dimensions at mount and on resize. Not stored in Zustand
— derived reactively from a `ResizeObserver` in `useGlobeControls`.

```typescript
interface Viewport {
  width: number;   // Container width in px
  height: number;  // Container height in px
}
```

---

## State Machine Diagram

```
Page opens
    │
    ▼
[LoadingScreen visible]
    │
    ├─ WebGL 2.0 unavailable ──────────► [WebGLErrorState]  (terminal)
    │
    ▼
[GlobeScene mounting (dynamic import)]
    │
    ▼
[react-globe.gl initializing]
    │
    ├─ onGlobeReady fires ────────────► [Globe visible, LoadingScreen fades out]  (terminal: ready)
    │
    └─ Three.js init error ───────────► [WebGLErrorState]  (terminal: error)
```

---

## Asset Inventory

| File | Path | Size target | Description |
|---|---|---|---|
| Earth day map | `/public/textures/earth-day.jpg` | ≤ 600KB | NASA Blue Marble (4K) |
| Specular map | `/public/textures/earth-specular.jpg` | ≤ 100KB | Ocean reflectivity |
| Bump map | `/public/textures/earth-bump.jpg` | ≤ 100KB | Elevation depth |

Total texture budget: ≤ 800KB (leaves room for JS bundles within 4s load target).
