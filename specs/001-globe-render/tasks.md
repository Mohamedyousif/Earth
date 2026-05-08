# Tasks: Globe Rendering Engine

**Input**: Design documents from `specs/001-globe-render/`
**Prerequisites**: plan.md âœ…, spec.md âœ…, research.md âœ…, data-model.md âœ…, contracts/ âœ…

**Tests**: Minimal Vitest + Playwright tests included in Polish phase â€” required by constitution
Testing Gate (all merges require green tests). No TDD phase per user request.

**Organization**: Tasks grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared state)
- **[Story]**: Which user story this task belongs to (US1â€“US5)
- Exact file paths included in all task descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js project and install all dependencies.

- [x] T001 Run `npx create-next-app@14 . --typescript --tailwind --app --src-dir no --import-alias "@/*"` at repo root (choose: ESLint yes, Tailwind yes, App Router yes)
- [x] T002 Run `npm install react-globe.gl zustand framer-motion` to install runtime dependencies
- [x] T003 [P] Run `npm install -D vitest @vitejs/plugin-react jsdom playwright @playwright/test` to install dev dependencies
- [x] T004 [P] Download NASA Blue Marble textures from solarsystemscope.com and place in `public/textures/`: `earth-day.jpg` (4K, â‰¤600KB), `earth-specular.jpg` (â‰¤100KB), `earth-bump.jpg` (â‰¤100KB) â€” directory created, textures need manual download (see public/textures/README.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, constants, state store, and app shell that ALL user stories depend on.

**âš ï¸ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Create `lib/types/globe.ts` â€” define `LoadingStatus = 'loading' | 'ready' | 'error'` and `GlobeConfig` interface (textures, rotation, zoom, loading sub-objects per data-model.md)
- [x] T006 [P] Create `lib/constants/globe.ts` â€” export `GLOBE_CONFIG: GlobeConfig` with values: textures pointing to `/textures/earth-*.jpg`, `idleSpeed: 0.5`, `inactivityTimeoutMs: 5000`, `dampingFactor: 0.08`, `minDistance: 101`, `maxDistance: 500`, `minDisplayMs: 400`, `fadeOutDurationMs: 600`
- [x] T007 Create `lib/hooks/useGlobeState.ts` â€” Zustand store with `status: LoadingStatus` (initial `'loading'`), `setReady()` (sets status to `'ready'`), `setError()` (sets status to `'error'`)
- [x] T008 Update `app/layout.tsx` â€” set `<html>` background to black (`bg-black`), `<body>` to `h-screen w-screen overflow-hidden`, add metadata: title "Wonder Earth", description matching product vision
- [x] T009 [P] Update `app/globals.css` â€” add Tailwind base/components/utilities directives; add CSS custom properties: `--earth-glow: rgba(100, 160, 255, 0.15)`, `--star-bg: #000005`; set `body { background: var(--star-bg); }`
- [x] T010 [P] Create `vitest.config.ts` at repo root â€” configure `@vitejs/plugin-react`, test environment `jsdom`, include pattern `**/*.test.ts`
- [x] T011 [P] Create `playwright.config.ts` at repo root â€” set `baseURL: 'http://localhost:3000'`, browser: `chromium`, test directory `tests/e2e/`

**Checkpoint**: `npm run dev` starts without errors. Root page renders a black screen.

---

## Phase 3: User Story 1 â€” Arrive and See Earth (Priority: P1) ðŸŽ¯ MVP

**Goal**: A 3D Earth sphere is visible on load, atmospherically lit, with a starfield
background and slow idle rotation.

**Independent Test**: Open localhost:3000 in Chrome. Verify a textured 3D globe is
visible and rotating. No interaction required.

- [x] T012 [P] [US1] Create `components/Globe/GlobeScene.tsx` â€” `'use client'` component wrapping `react-globe.gl`. Props: `{ onReady: () => void; onError: () => void }`. Set: `globeImageUrl={GLOBE_CONFIG.textures.day}`, `bumpImageUrl={GLOBE_CONFIG.textures.bump}`, `specularImageUrl={GLOBE_CONFIG.textures.specular}`, `showAtmosphere={true}`, `showGraticules={false}`, `backgroundColor="rgba(0,0,0,0)"`. Wire `onGlobeReady` prop to call `onReady`. Wrap mount in try/catch â†’ call `onError` on failure.
- [x] T013 [P] [US1] Create `components/Globe/useGlobeControls.ts` â€” custom hook with params `{ globeRef, containerRef }`. On mount: access `globeRef.current.controls()` and set `controls.autoRotate = true`, `controls.autoRotateSpeed = GLOBE_CONFIG.rotation.idleSpeed`, `controls.dampingFactor = GLOBE_CONFIG.rotation.dampingFactor`, `controls.enableDamping = true`. Attach `ResizeObserver` to `containerRef` â†’ call `globeRef.current.width(w)` and `.height(h)` on each observation. Return cleanup function removing observer.
- [x] T014 [US1] Create `components/Globe/GlobeContainer.tsx` â€” `'use client'` component. Dynamically import `GlobeScene` using `next/dynamic({ ssr: false })`. Read `status`, `setReady`, `setError` from `useGlobeState`. Render: a full-screen `div` containing `<GlobeScene onReady={setReady} onError={setError} />`. Render `null` for error state for now (US5 will wire this). Add `containerRef` on the wrapper div and pass to `GlobeScene` for resize handling.
- [x] T015 [US1] Update `app/page.tsx` â€” replace default content with `<GlobeContainer />` stretched to full viewport (`w-full h-full`). Remove all Next.js default page content.

**Checkpoint**: localhost:3000 shows a textured, atmospherically lit, rotating 3D Earth on a black background. Drag rotates it. âœ… User Story 1 independently complete.

---

## Phase 4: User Story 2 â€” Spin and Explore the Globe (Priority: P1)

**Goal**: Drag-to-rotate feels natural with inertia. Idle rotation pauses during
interaction and resumes 5 seconds after the last interaction.

**Independent Test**: Drag the globe quickly, release. Verify the globe coasts with
natural deceleration. Wait 5 seconds â€” verify idle rotation resumes.

- [x] T016 [US2] Extend `components/Globe/useGlobeControls.ts` â€” add pause/resume logic after the auto-rotate setup block. Declare `let inactivityTimer: ReturnType<typeof setTimeout>`. Add `controls.addEventListener('change', pauseHandler)` where `pauseHandler`: sets `controls.autoRotate = false`, clears then resets a `setTimeout(() => { controls.autoRotate = true; }, GLOBE_CONFIG.rotation.inactivityTimeoutMs)`. Ensure `removeEventListener` and `clearTimeout` in cleanup.

**Checkpoint**: Drag globe fast â†’ release â†’ globe decelerates naturally (0.5â€“3s). Wait 5s â†’ idle rotation resumes. âœ… User Story 2 independently complete.

---

## Phase 5: User Story 3 â€” Zoom In and Out (Priority: P2)

**Goal**: Scroll wheel zooms within hard limits: minimum is full-globe view, maximum
is approximately country-level detail.

**Independent Test**: Scroll down to zoom in. Scroll up to zoom out. Verify hard
limits are enforced at both ends.

- [x] T017 [US3] Extend `components/Globe/useGlobeControls.ts` â€” after OrbitControls setup, add: `controls.minDistance = GLOBE_CONFIG.zoom.minDistance` and `controls.maxDistance = GLOBE_CONFIG.zoom.maxDistance`. Ensure these are set before the controls first render.

**Checkpoint**: Scroll wheel zooms in/out. Cannot zoom past minimum (full globe) or maximum (country level). âœ… User Story 3 independently complete.

---

## Phase 6: User Story 4 â€” Loading Screen (Priority: P2)

**Goal**: An atmospheric full-screen loading screen appears immediately on page open
and fades out smoothly when the globe is ready. Fast loads (< 400ms) are handled
without a flash.

**Independent Test**: Throttle network to "Slow 3G" in Chrome DevTools. Refresh.
Verify loading screen appears before the globe, then fades out when the globe loads.

- [x] T018 [P] [US4] Create `components/UI/LoadingScreen.tsx` â€” `'use client'` component. Props: `{ show: boolean; onHidden: () => void }`. Use Framer Motion `useAnimate`. On `show` changing to `false`: wait until `Date.now() >= mountTime + GLOBE_CONFIG.loading.minDisplayMs`, then call `animate(scope.current, { opacity: 0 }, { duration: GLOBE_CONFIG.loading.fadeOutDurationMs / 1000 })`, then call `onHidden()`. Render: `<motion.div ref={scope} className="fixed inset-0 z-50 flex items-center justify-center bg-black">` with a centered atmospheric label ("Discovering Earthâ€¦" in a dim, elegant typeface via Tailwind).
- [x] T019 [US4] Update `components/Globe/GlobeContainer.tsx` â€” import `LoadingScreen`. Add local `showLoader` state (initial `true`). Render `<LoadingScreen show={status === 'loading'} onHidden={() => setShowLoader(false)} />` conditionally when `showLoader` is true, stacked above the globe scene. Globe scene mounts immediately (behind the loading screen) so react-globe.gl initializes during the loading screen â€” this is intentional.

**Checkpoint**: On page open, dark loading screen with "Discovering Earthâ€¦" is visible. Globe initializes behind it. When `onGlobeReady` fires, loading screen fades out in 600ms. Fast reload: loading screen is not a flash. âœ… User Story 4 independently complete.

---

## Phase 7: User Story 5 â€” Error State for Unsupported Browsers (Priority: P3)

**Goal**: Browsers without WebGL 2.0 see an on-brand dark error message instead of
a blank screen or JavaScript error.

**Independent Test**: Temporarily patch `hasWebGL2()` to return `false`. Refresh.
Verify a styled dark error screen appears with browser guidance. Restore the patch.

- [x] T020 [P] [US5] Create `lib/utils/webgl.ts` â€” export `hasWebGL2(): boolean`. Implementation: guard with `typeof document === 'undefined'` (returns `true` for SSR safety), then `return document.createElement('canvas').getContext('webgl2') !== null`.
- [x] T021 [P] [US5] Create `components/UI/WebGLErrorState.tsx` â€” `'use client'` component, no props. Full-screen dark overlay (`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center`). Content: a dim atmospheric icon (e.g., a simple SVG globe outline), heading "Your browser cannot render Wonder Earth", paragraph "This experience requires WebGL 2.0. Try opening it in Chrome, Firefox, or Edge.", all text in muted white (`text-white/70`). No bright colors, no generic error styling.
- [x] T022 [US5] Update `components/Globe/GlobeContainer.tsx` â€” import `hasWebGL2` and `WebGLErrorState`. In a `useEffect` (runs once on mount), call `if (!hasWebGL2()) { setError(); }`. In the render: when `status === 'error'`, render `<WebGLErrorState />` and return early (skip GlobeScene mount). Also handle the `setError` callback from `GlobeScene.onError` (already wired in T014 â€” verify it renders `<WebGLErrorState />` in this state).

**Checkpoint**: Patch `hasWebGL2()` â†’ `return false`. Refresh. Dark on-brand error screen appears. No blank page, no console error crash. Unpatch â†’ globe renders normally. âœ… User Story 5 independently complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Resilience, constitution compliance verification, and required test coverage.

- [x] T023 Add texture load fallback in `components/Globe/GlobeScene.tsx` â€” if `globeImageUrl` fails to load (use `onError` on an `<img>` pre-check or catch in the globe init), remove the texture prop to fall back to react-globe.gl's default solid sphere rather than crashing
- [x] T024 [P] Verify ResizeObserver behavior in `components/Globe/useGlobeControls.ts` â€” resize the browser window while the globe is visible; confirm globe redraws to fill the new container dimensions without distortion
- [x] T025 [P] Create `lib/hooks/useGlobeState.test.ts` â€” Vitest unit tests: (1) initial status is `'loading'`, (2) `setReady()` transitions status to `'ready'`, (3) `setError()` transitions status to `'error'`, (4) subsequent `setReady()` after `setError()` does not change status (terminal state)
- [x] T026 [P] Create `lib/utils/webgl.test.ts` â€” Vitest unit test: mock `document.createElement('canvas').getContext` to return `null`; verify `hasWebGL2()` returns `false`
- [x] T027 [P] Create `tests/e2e/globe-render.spec.ts` â€” Playwright test: navigate to `/`; wait for `canvas` element to be visible; assert page title is "Wonder Earth"
- [x] T028 Run `npm run test` (Vitest) â†’ verify all unit tests pass; run `npx playwright test` â†’ verify E2E test passes; run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies â€” start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (Phase 1) â€” BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational â€” no dependency on US2â€“US5
- **US2 (Phase 4)**: Depends on US1 (extends useGlobeControls.ts created in T013)
- **US3 (Phase 5)**: Depends on US1 (extends useGlobeControls.ts); independent of US2 but shares the same file â€” run sequentially after US2 to avoid merge conflict
- **US4 (Phase 6)**: Depends on US1 (extends GlobeContainer.tsx); independent of US2â€“US3
- **US5 (Phase 7)**: Depends on US1 (extends GlobeContainer.tsx); independent of US2â€“US4
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational â€” no dependency on other stories
- **US2 (P1)**: Starts after US1 â€” extends T013 (useGlobeControls)
- **US3 (P2)**: Starts after US2 â€” extends same file (T013); run after US2 to prevent file conflict
- **US4 (P2)**: Can start after US1 â€” extends T014 (GlobeContainer); independent of US2/US3
- **US5 (P3)**: Can start after US1 â€” extends T014 (GlobeContainer); independent of US2/US3/US4

### Within Each User Story

- [P] tasks within a story can run in parallel (different files)
- Non-[P] tasks within a story are sequential

---

## Parallel Opportunities

### Phase 1 (Setup)

```
T001 (sequential - scaffolds project first)
    â”‚
    â”œâ”€â”€ T002 npm install runtime deps
    â”œâ”€â”€ T003 [P] Download textures
    â””â”€â”€ T004 [P] npm install dev deps
```

### Phase 2 (Foundational) â€” after T001â€“T004

```
T005 (types â€” needed by T006, T007)
    â”‚
    â”œâ”€â”€ T006 [P] Create constants
    â”œâ”€â”€ T007 Create Zustand store
    â”œâ”€â”€ T008 Update layout.tsx
    â”œâ”€â”€ T009 [P] Update globals.css
    â”œâ”€â”€ T010 [P] Configure Vitest
    â””â”€â”€ T011 [P] Configure Playwright
```

### Phase 3 (US1) â€” after T005â€“T011

```
T012 [P] Create GlobeScene.tsx
T013 [P] Create useGlobeControls.ts (basic)
    â”‚                    â”‚
    â””â”€â”€â”€â”€â”€â”€â”€ both done â”€â”€â”˜
                 â”‚
              T014 Create GlobeContainer.tsx
                 â”‚
              T015 Update page.tsx
```

### Phase 6 (US4) â€” can start after T014 (US1 checkpoint)

```
T018 [P] Create LoadingScreen.tsx
T019 Update GlobeContainer.tsx (depends on T018)
```

### Phase 7 (US5) â€” can start after T014 (US1 checkpoint)

```
T020 [P] Create webgl.ts utility
T021 [P] Create WebGLErrorState.tsx
T022 Update GlobeContainer.tsx (depends on T020, T021)
```

### Phase 8 (Polish) â€” after all stories

```
T023 Texture fallback
T024 [P] Verify resize behavior
T025 [P] Vitest: useGlobeState tests
T026 [P] Vitest: webgl utility tests
T027 [P] Playwright: globe-render E2E
T028 Run all tests (sequential last)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL â€” blocks all stories**)
3. Complete Phase 3: User Story 1 (T012â€“T015)
4. **STOP and VALIDATE**: Open localhost:3000 â€” globe must be visible, textured, rotating
5. Demo the MVP globe if ready

### Incremental Delivery

1. Setup + Foundational â†’ Black page, server running
2. US1 â†’ Globe visible, basic interaction (**MVP!**)
3. US2 â†’ Drag inertia + pause/resume (still P1)
4. US3 â†’ Zoom bounds
5. US4 â†’ Loading screen
6. US5 â†’ Error state
7. Polish â†’ Tests + resilience

### Parallel Team Strategy

With two developers after Foundational:
- **Dev A**: US1 â†’ US2 â†’ US3 (sequential, same files)
- **Dev B**: US4 and US5 in parallel (both extend GlobeContainer after US1 checkpoint; coordinate the merge)

---

## Notes

- [P] tasks = different files, no shared state â€” safe to run in parallel
- US2 and US3 both modify `useGlobeControls.ts` â€” run sequentially (US2 then US3)
- US4 and US5 both modify `GlobeContainer.tsx` â€” coordinate merge if run in parallel
- `GlobeScene` mounts behind the loading screen â€” this is intentional (initializes WebGL while loader is visible)
- The `hasWebGL2()` utility must guard against SSR (`typeof document === 'undefined'`)
- Minimum loading screen display time (400ms) prevents a flash on fast connections
- Always verify 60 FPS with Chrome DevTools Performance panel after US1 is complete
