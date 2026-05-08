# Component Interfaces: Globe Rendering Engine

**Feature**: 001-globe-render
**Date**: 2026-05-08

These are the public TypeScript interfaces for each component in this feature.
They define what each component accepts and what it guarantees to callers.

---

## GlobeContainer

Entry point rendered by `app/page.tsx`. Owns WebGL detection, loading state
orchestration, and conditional rendering of the three possible states.

```typescript
// components/Globe/GlobeContainer.tsx
// Props: none — self-contained; reads from GlobeState store
interface GlobeContainerProps {}

// Renders one of:
//   <LoadingScreen />  (while status === 'loading')
//   <GlobeScene />     (once status === 'ready'; overlaid while loading screen fades)
//   <WebGLErrorState /> (if status === 'error')
```

---

## GlobeScene

The react-globe.gl wrapper. Dynamically imported (no SSR). Receives callbacks
from `GlobeContainer` to signal lifecycle events.

```typescript
// components/Globe/GlobeScene.tsx
interface GlobeSceneProps {
  onReady: () => void;   // Called when react-globe.gl fires onGlobeReady
  onError: () => void;   // Called if Three.js initialization fails
}
```

---

## LoadingScreen

Full-screen atmospheric loading screen. Fades out when `show` becomes false.
Calls `onHidden` after the fade-out animation completes so the parent can
unmount it.

```typescript
// components/UI/LoadingScreen.tsx
interface LoadingScreenProps {
  show: boolean;          // Controls visibility; triggers fade-out when false
  onHidden: () => void;   // Called after fade-out animation completes
}
```

---

## WebGLErrorState

On-brand full-screen error message for unsupported browsers. No props — the
message and content are fixed.

```typescript
// components/UI/WebGLErrorState.tsx
interface WebGLErrorStateProps {}
```

---

## useGlobeControls (custom hook)

Encapsulates OrbitControls wiring: auto-rotation, pause/resume, resize observer.
Called inside `GlobeScene` after mount.

```typescript
// components/Globe/useGlobeControls.ts
interface UseGlobeControlsOptions {
  globeRef: React.RefObject<GlobeInstance>;     // react-globe.gl ref
  containerRef: React.RefObject<HTMLDivElement>; // Parent container ref
}

// Returns: void — all effects are side-effects on globeRef.current.controls()
function useGlobeControls(options: UseGlobeControlsOptions): void;
```

---

## GlobeState store (Zustand)

```typescript
// lib/hooks/useGlobeState.ts
interface GlobeState {
  status: 'loading' | 'ready' | 'error';
  setReady: () => void;
  setError: () => void;
}

// Usage:
const { status, setReady, setError } = useGlobeState();
```

---

## Environment Requirements

| Requirement | Value |
|---|---|
| Node.js | 20+ |
| Browser | Chrome 100+, Firefox 100+, Edge 100+, Safari 16+ |
| WebGL | 2.0 required |
| Minimum viewport | 1280×720px |
| Texture assets | Must exist in `/public/textures/` before `npm run dev` |
