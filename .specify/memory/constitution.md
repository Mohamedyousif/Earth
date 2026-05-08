<!--
## Sync Impact Report

**Version Change**: 1.0.0 → 1.1.0
**Version Bump Rationale**: MINOR — Development Standards and Review & Quality Gates expanded
  with concrete technology choices, browser compatibility requirements, testing strategy,
  and deployment standards derived from SRS V2. All 10 principles remain intact and unchanged.
  No principles added, removed, or redefined.

**Modified Principles**: None — all 10 principles (I–X) are textually unchanged.

**Added/Expanded Sections**:
- Development Standards: Tailwind CSS (styling), TanStack Query (data fetching),
  react-globe.gl (globe library), Vitest + Playwright (testing), Vercel / Node.js 20+ /
  GitHub Actions (deployment), browser compatibility matrix, minimum viewport constraint,
  Natural Earth 1:110m + static JSON MVP data sourcing policy.
- Review & Quality Gates: new Testing Gate (Vitest unit + Playwright E2E required).

**Removed Sections**: None.

**Templates Requiring Updates**:
- `.specify/templates/plan-template.md` ✅ Constitution Check gate is generic; new
  technology-specific standards propagate automatically. No structural update required.
- `.specify/templates/spec-template.md` ✅ No new mandatory spec sections introduced.
  No update required.
- `.specify/templates/tasks-template.md` ✅ Polish phase already includes test tasks;
  framework names (Vitest, Playwright) should be substituted when tasks are generated.
  No structural update required.

**Deferred TODOs**: None — all placeholders resolved.
-->

# Wonder Earth Constitution

## Core Principles

### I. Discovery First

Every feature MUST enhance exploration, curiosity, or a sense of mystery.
Wonder Earth is not a data viewer. Any feature that does not serve discovery
is out of scope for the core experience.

**Rationale**: The product identity depends on a consistent tone of wonder.
Utility features that do not serve discovery dilute the experience and
undermine the product's reason for existing.

### II. Natural Earth First

Earth MUST appear realistic and unlabeled by default.
Country borders, labels, and political overlays MUST remain hidden until
the user explicitly triggers an interaction.

**Rationale**: Immersion is broken by premature labeling. Users MUST feel
they are looking at a real planet, not a traditional mapping tool.

### III. Atmosphere Over Utility

The experience MUST feel immersive and emotionally resonant at all times.
UI chrome, data panels, and utility controls MUST be visually secondary
to the globe and its atmosphere. No element may dominate the canvas
at the cost of the experiential quality.

**Rationale**: Wonder Earth competes on feeling, not feature parity.
Atmospheric quality is a first-class product requirement, not an afterthought.

### IV. Extensible Earth Object Model

All discoverable entities — countries, oceans, mountains, civilizations,
biomes, and any future entity type — MUST conform to a single unified
Earth Object Model. No entity type may bypass this model with a
bespoke representation.

**Rationale**: A unified model enables consistent discovery mechanics,
time-awareness, and future extensibility without architectural churn.
Deviation creates two-tier citizens in the discovery system.

### V. Time-Aware Discoveries

Every Earth Object MUST support temporal metadata fields:
`eraStart` and `eraEnd` (ISO 8601 dates or geological epoch strings).
Features that surface discoveries MUST respect these fields and filter
or annotate accordingly.

**Rationale**: The Earth's history spans geological and political eras.
All discoveries must be composable across time to enable historical
and future-facing exploration.

### VI. Performance First

All interactive experiences MUST target 60 FPS on desktop hardware.
Heavy computations — pathfinding, data aggregation, large dataset
parsing — MUST NOT execute in the render loop. Use web workers,
precomputation, or caching strategies instead.

**Rationale**: Immersion breaks instantly at low frame rates. Performance
is a non-negotiable quality gate, not an optimization afterthought.

### VII. Use Proven Abstractions

Globe mathematics, geospatial projections, and 3D rendering MUST use
established, well-maintained libraries (e.g., `react-globe.gl`, Three.js,
D3-geo) rather than custom implementations. See Development Standards for
the authoritative library list.

**Rationale**: Reinventing globe math introduces subtle correctness bugs,
increases maintenance burden, and delays delivery without any meaningful
product differentiation.

### VIII. Desktop-First MVP

The MVP MUST target desktop browsers exclusively.
Mobile layout, touch interaction, and responsive breakpoints are
explicitly deferred and MUST NOT block MVP delivery.

**Rationale**: The immersive globe experience requires pointer/hover
interactions and larger viewports that mobile cannot reliably deliver
at this stage. Mobile support is a post-MVP investment.

### IX. Multi-Agent Validation

All major changes — new principles, architectural decisions, and
significant feature additions — MUST be reviewed by three agents
before merging:

- **Builder** (Claude Sonnet): Implementation correctness and spec alignment.
- **Reviewer** (Claude Opus): Architectural quality and principle compliance.
- **Red Team** (Claude Opus, adversarial mode): Edge cases, failure modes,
  and experience-breaking regressions.

The review cycle is strictly ordered: Builder implements → Reviewer
reviews → Red Team challenges → all three approve before merge to `main`.

**Rationale**: A multi-perspective review catches issues that a single pass
misses, especially in an experience-driven product where subjective quality
and correctness are both first-class concerns.

### X. Mystical Tone Consistency

All UI elements, motion design, copy, and content MUST reflect three
tone pillars: **dark**, **mysterious**, **discovery-driven**.
Light themes, playful colors, and utilitarian language are prohibited
in all user-facing surfaces. Error states, loading screens, and fallback
panels are user-facing surfaces and MUST comply with this tone.

**Rationale**: Tone consistency is a product-level brand requirement.
A single jarring element — a bright button, casual copy, an off-theme
animation — breaks the immersive contract with the user.

## Development Standards

All development work on Wonder Earth MUST adhere to the following standards:

### Language & Framework

- **Language**: TypeScript-first. No untyped JavaScript in new production code.
- **Framework**: Next.js 14 (App Router). React as the UI library.

### 3D Rendering & Globe

- **Rendering**: WebGL 2.0 via `react-globe.gl` (React wrapper for `globe.gl`).
  Canvas 2D is acceptable only for lightweight UI overlays.
- **3D Bindings**: `@react-three/fiber` and `@react-three/drei` for any
  Three.js scenes outside the globe component.
- **Custom globe math is prohibited.** Use library abstractions (see Principle VII).

### Styling

- **CSS System**: Tailwind CSS. No inline style objects for layout or theming.
  Component-level CSS Modules are acceptable for highly specific overrides.

### State & Data

- **State Management**: Zustand for all shared Earth Object interaction state.
  No ad-hoc local state for entities visible across components.
- **Data Fetching**: TanStack Query (React Query) for all asynchronous data
  operations. Raw `fetch` without caching is prohibited in production code.
- **Animation**: Framer Motion for all UI transitions.

### Geographic Data

- **Source**: Natural Earth (naturalearthdata.com).
- **MVP resolution**: 1:110m GeoJSON country polygons. Adequate for
  country-level interaction; smallest file size.
- **Phase 2 resolution**: Upgrade to 1:50m for improved polygon fidelity.
- **Discovery content (MVP)**: Curated static JSON files bundled in the
  repository at `/lib/data/discoveries/`. No runtime calls to Wikipedia
  or Wikidata for MVP. Live API integration is a Phase 2 item.

### Browser Compatibility

- **Supported browsers**: Chrome 100+, Firefox 100+, Edge 100+, Safari 16+.
- **WebGL requirement**: WebGL 2.0. Browsers without WebGL 2.0 MUST receive
  a graceful, on-brand error state (see Principle X).
- **Minimum viewport**: 1280×720px. Behavior below this resolution is
  undefined for MVP.

### Testing

- **Unit tests**: Vitest. Required for all data models, discovery logic,
  utility functions, and Zustand store reducers.
- **End-to-end tests**: Playwright. Required for critical user paths: globe
  render, hover/click interaction, keyboard navigation, URL deep-linking.
- **Performance benchmarks**: Lighthouse and Chrome DevTools. Must confirm
  60 FPS (Principle VI), <4s initial load, and <100ms interaction latency.

### Deployment

- **Hosting**: Vercel (optimized for Next.js SSR).
- **Runtime**: Node.js 20+.
- **CI/CD**: GitHub Actions → Vercel preview deployments on pull requests;
  production deployment on merge to `main`.
- **Environment variables**: `.env.local` for secrets and configuration.
  No secrets committed to the repository.

### Accessibility

- Keyboard navigation MUST be supported for all interactive globe controls:
  arrow keys (rotate), `+`/`-` (zoom), `Enter` (select hovered country),
  `Escape` (close panel).
- Screen reader support is deferred post-MVP but MUST NOT be
  architecturally blocked.

## Review & Quality Gates

Before any feature is merged to `main`:

1. **Constitution Check**: Verify the change upholds all 10 principles.
   Flag and justify any violation in the PR description.
2. **Performance Gate**: Confirm the 60 FPS target is maintained on reference
   desktop hardware. Frame-rate regressions block merge. WebGL 2.0 support
   MUST remain intact across all supported browsers.
3. **Tone Review**: At least one team member MUST confirm any UI or content
   change matches the Mystical Tone (Principle X) before merge. This applies
   to error states, loading screens, and fallback panels.
4. **Testing Gate**: All new features MUST have passing Vitest unit tests
   covering data models and logic, and Playwright E2E coverage for any new
   critical user path. No merge without green tests.
5. **Multi-Agent Review** (major changes only): Execute the three-agent review
   defined in Principle IX. Include review outputs as PR comments.

## Governance

This constitution is the highest-authority document in the Wonder Earth project.
It supersedes all other practices, conventions, and individual preferences.

**Amendment Procedure**:
1. Propose the amendment in writing, referencing the affected principle(s).
2. Run the Multi-Agent Review (Principle IX) on the proposed amendment.
3. Record the rationale, version bump, and amendment date in this document.
4. Update all dependent templates and artifacts to reflect the change.

**Versioning Policy**:
- MAJOR: Removal or fundamental redefinition of an existing principle.
- MINOR: Addition of a new principle or materially expanded guidance.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

**Compliance Review**: Every sprint, at least one PR MUST include a
Constitution Check comment verifying continued alignment with all 10 principles.

**Version**: 1.1.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-05-08
