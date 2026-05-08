# Software Requirements Specification (SRS)
## Wonder Earth — Interactive Mystical 3D Earth Discovery Platform

**Version:** 2.0  
**Status:** Updated  
**Previous version:** Wonder Earth SRS V1.docx  

---

## 1. Introduction

### 1.1 Purpose

This document defines the Software Requirements Specification (SRS) for **Wonder Earth**, an interactive 3D Earth exploration platform focused on mystery, discovery, and immersive storytelling.

The purpose of this document is to:

- Serve as the primary technical and product reference
- Align human developers and AI agents
- Define architecture and system boundaries
- Establish implementation requirements
- Provide long-term scalability guidance

This document is intended for:

- Software engineers
- AI coding agents
- Technical architects
- Product managers
- Designers

### 1.2 Product Overview

Wonder Earth is a **desktop-first web application** that presents Earth as an interactive 3D globe where users can:

- Rotate and explore Earth naturally
- Hover over hidden geographic regions
- Click countries and objects
- Discover mysterious and unusual information
- Explore time-aware discoveries
- Experience Earth as an atmospheric exploration engine

**Wonder Earth is NOT:**
- a GIS platform
- a navigation tool
- a political map viewer

**Wonder Earth IS:**
- a discovery experience
- a mystical exploration product
- an atmospheric interactive atlas

### 1.3 Product Vision

To transform Earth exploration into a mysterious and immersive discovery experience. The product should make users feel:

- curiosity
- wonder
- mystery
- exploration
- hidden knowledge

---

## 2. System Scope

### 2.1 MVP Scope

The MVP includes:

**Globe Engine**
- 3D Earth rendering
- Cinematic lighting
- Earth rotation
- User drag rotation
- Zoom controls

**Interaction**
- Hover detection
- Click detection
- Hidden country borders
- Country highlight on hover

**Discovery Engine**
- Discovery panel
- Discovery datasets
- Random mystery feature

**Data Sources**
- GeoJSON (Natural Earth 1:110m — see Section 9)
- Wikipedia
- Wikidata
- NASA/NOAA datasets

### 2.2 Out of Scope (MVP)

The following are explicitly excluded from MVP:

- Mobile optimization
- Multiplayer features
- Authentication
- User accounts
- Real-time Earth simulation
- Surface-level zoom
- Procedural terrain generation
- Voice interactions
- Live API fetching (all discovery data is static JSON for MVP — see Section 9.2)

---

## 3. System Architecture

### 3.1 Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 |
| Language | TypeScript |
| UI Library | React |
| 3D Rendering | Three.js |
| React 3D Bindings | React Three Fiber (`@react-three/fiber`) |
| 3D Helpers | Drei (`@react-three/drei`) |
| Globe Library | `react-globe.gl` (React wrapper for `globe.gl`) |
| State Management | Zustand |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Data Fetching | TanStack Query (React Query) |
| Data Formats | GeoJSON, TopoJSON, JSON |

> **Note on globe library:** `react-three-globe` (listed in V1) does not exist as a verified, maintained package. The replacement is `react-globe.gl`, which wraps the battle-tested `globe.gl` library. For teams preferring full Three.js control, an alternative is a custom sphere built with `@react-three/drei` + D3-geo polygon projection.

### 3.2 Architectural Principles

Architectural principles are governed by the **project constitution**. See `.specify/memory/constitution.md` for the authoritative list.

Summary of key principles:

| ID | Principle | Description |
|---|---|---|
| AP-1 | Discovery First | Every feature must increase exploration or wonder |
| AP-2 | Natural Earth | Earth should appear natural and unlabeled by default |
| AP-3 | Atmosphere Over Utility | Immersion is prioritized over map utility |
| AP-4 | Extensibility | All Earth entities must share one unified model |
| AP-5 | Performance First | Rendering performance is more important than realism |
| AP-6 | Proven Abstractions | Use stable libraries before custom engineering |

> For the complete list of 10 principles and their governance rules, see the project constitution.

---

## 4. Functional Requirements

### 4.1 Globe Rendering

**FR-1 — Render Earth Globe**  
The system shall render a realistic 3D Earth sphere.  
*Acceptance Criteria:* Earth visible on load. Smooth rendering. Stable frame rate.

**FR-2 — Automatic Rotation**  
The Earth shall rotate slowly while idle.  
*Acceptance Criteria:* Smooth motion. Non-distracting speed. Stops during user interaction.

**FR-3 — Manual Rotation**  
Users shall rotate Earth using mouse drag interaction.  
*Acceptance Criteria:* Smooth drag. Natural inertia. No camera glitches.

**FR-4 — Zoom Controls**  
Users shall zoom in/out within predefined limits.  
*Constraints:* Minimum: full globe view. Maximum: country-level zoom.

**FR-5 — Cinematic Loading Screen**  
The system shall display a loading screen consistent with the mystical visual identity while globe assets, textures, and GeoJSON initialize.  
*Acceptance Criteria:* Loading screen visible before globe appears. Loading screen fades out smoothly on completion. Loading screen does not break if assets load faster than 500ms.

**FR-6 — WebGL Error State**  
The system shall display a graceful error state when WebGL 2.0 is unsupported or when 3D rendering fails.  
*Acceptance Criteria:* Error message is styled consistently with the visual identity. Error message provides guidance (e.g., "Try a modern browser like Chrome or Firefox").

### 4.2 Geographic Interaction

**FR-7 — Country Loading**  
The system shall load country polygons from GeoJSON datasets.

**FR-8 — Hidden Borders**  
Country borders shall remain invisible until interaction.

**FR-9 — Hover Detection**  
Hovering a country shall reveal its boundary.  
*Acceptance Criteria:* Low latency. Smooth highlight transition. Accurate polygon selection.

**FR-10 — Click Detection**  
Users shall click countries to open discovery information.

**FR-11 — Keyboard Navigation**  
Users shall navigate the globe using keyboard controls.  
*Controls:* Arrow keys → rotate globe. `+` / `-` → zoom. `Enter` → select currently hovered country. `Escape` → close discovery panel.  
*Acceptance Criteria:* All keyboard controls functional on desktop. Focus state visible.

**FR-12 — URL State (Deep Linking)**  
The application shall reflect the selected country in the browser URL to support sharing and browser history.  
*Format:* `/?country=EGY` (ISO 3166-1 alpha-3 code).  
*Acceptance Criteria:* Opening the URL directly opens the globe at that country's discovery panel. Browser back/forward navigation works correctly.

### 4.3 Discovery System

**FR-13 — Discovery Panel**  
The system shall display discovery information for selected objects.  
*Discovery Panel Includes:* Object name. Basic information. Discoveries. Discovery categories.

**FR-14 — Discovery Data Fallback**  
The system shall display a graceful fallback state in the discovery panel when discovery data is unavailable for a country.  
*Acceptance Criteria:* Fallback message is atmospheric and on-brand. No raw errors or blank panels.

**FR-15 — Random Discovery**  
The system shall support random discovery exploration.  
*Behavior:* Select random discovery → rotate globe to location → open discovery panel.

**FR-16 — Discovery Categories**  
The system shall support discovery classification.  
*Categories:* Mystery. Geological. Historical. Anomaly.

### 4.4 Timeline Support

**FR-17 — Time-Aware Discoveries**  
All discoveries shall support temporal metadata.  
*Fields:* `eraStart`, `eraEnd`, `period`.

**FR-18 — Future Timeline Support**  
Architecture shall support future timeline filtering.

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1 — Frame Rate**  
Target: 60 FPS desktop minimum.

**NFR-2 — Load Time**  
Initial load target: under 4 seconds on broadband.

**NFR-3 — Interaction Latency**  
Hover/click response: under 100ms perceived latency.

### 5.2 Browser Compatibility

**NFR-4 — Supported Browsers**  
The application targets:

| Browser | Minimum Version |
|---|---|
| Chrome | 100+ |
| Firefox | 100+ |
| Edge | 100+ |
| Safari | 16+ |

**NFR-5 — WebGL Requirement**  
The application requires WebGL 2.0 support. Browsers without WebGL 2.0 shall receive the FR-6 error state.

**NFR-6 — Minimum Viewport**  
The application targets a minimum viewport of **1280×720px**. Behavior below this resolution is undefined for MVP.

### 5.3 Scalability

**NFR-7 — Extensible Object System**  
Architecture must support future Earth object types without redesign:

- oceans
- rivers
- volcanoes
- deserts
- anomalies

### 5.4 Data & API

**NFR-8 — Discovery Data Caching**  
For MVP, all discovery data shall be curated static JSON files bundled with the application. No runtime API calls to Wikipedia or Wikidata. Live API integration is deferred to Phase 2.  
*Rationale:* Eliminates API rate limiting, latency, and data inconsistency risks for MVP.

### 5.5 Maintainability

**NFR-9 — Modular Architecture**  
All systems must remain modular and independently replaceable.

**NFR-10 — AI-Agent Readability**  
Codebase and specifications must be understandable by AI agents.

### 5.6 Reliability

**NFR-11 — Stable Rendering**  
The application shall avoid rendering crashes and camera instability.

---

## 6. Data Model

### 6.1 EarthObject

```typescript
type EarthObject = {
  id: string
  type: EarthObjectType
  name: string
  geometry: GeoJSON
  discoveries: Discovery[]
}
```

### 6.2 Discovery

```typescript
type Discovery = {
  id: string
  title: string
  category: DiscoveryCategory
  period: string
  eraStart?: number
  eraEnd?: number
  rarity?: number
  content: string
  coordinates?: Coordinates
  sources: Source[]
}
```

### 6.3 Discovery Categories

```typescript
enum DiscoveryCategory {
  Mystery,
  Geological,
  Historical,
  Anomaly,
}
```

---

## 7. User Experience Requirements

### 7.1 Visual Identity

The system must maintain:

- dark atmosphere
- cinematic lighting
- mystical visual tone
- elegant motion

### 7.2 Interaction Feel

The globe interaction must feel:

- smooth
- responsive
- immersive
- tactile

### 7.3 Discovery Feel

The user should feel:

- exploration
- hidden knowledge
- curiosity
- mystery

---

## 8. UI Requirements

### 8.1 Globe Requirements

- Realistic Earth textures
- Atmospheric glow
- Starfield background
- Hidden borders

### 8.2 Hover State Requirements

- Subtle outline glow
- Smooth transition
- Non-intrusive visual feedback

### 8.3 Discovery Panel Requirements

- Side panel layout
- Smooth animations
- Readable typography
- Atmospheric visual style
- Graceful fallback state for missing data (see FR-14)

### 8.4 Loading Screen Requirements

- Full-screen atmospheric design consistent with the mystical visual identity
- Progress indicator or animation
- Smooth fade-out transition to globe on completion

---

## 9. Data Sources

### 9.1 Geographic Data

- **Source:** Natural Earth (naturalearthdata.com)
- **Resolution for MVP:** 1:110m (smallest file size, adequate for country-level interaction)
- **Resolution for Phase 2:** Upgrade to 1:50m for improved polygon fidelity
- **Format:** GeoJSON country boundaries

### 9.2 Discovery Content

- **MVP approach:** Curated static JSON files stored in the repository (`/lib/data/discoveries/`)
- **Content creation:** Manually authored for the 5 initial countries (see Section 14)
- **Phase 2:** Live integration with Wikidata SPARQL API and Wikipedia REST API

### 9.3 Other Data Sources

- NASA / NOAA datasets (geological and atmospheric data)

---

## 10. Risks and Constraints

### 10.1 Polygon Projection Complexity

**Risk:** Country interaction on sphere geometry is complex.  
**Mitigation:** Use `react-globe.gl` polygon abstractions.

### 10.2 Performance Constraints

**Risk:** Heavy polygon rendering can reduce FPS.  
**Mitigation:** Geo simplification. Memoization. Efficient rendering. Use 1:110m GeoJSON for MVP.

### 10.3 Data Quality

**Risk:** Wikipedia/Wikidata data inconsistency.  
**Mitigation:** Use curated static discovery datasets for MVP. Live API integration deferred to Phase 2.

### 10.4 WebGL Support

**Risk:** Some corporate/enterprise browsers may block or disable WebGL.  
**Mitigation:** FR-6 error state informs users and guides them to a supported browser.

---

## 11. Testing Strategy

### 11.1 Unit Tests

- Framework: **Vitest**
- Scope: Data models, discovery logic, utility functions, Zustand store reducers

### 11.2 End-to-End Tests

- Framework: **Playwright**
- Scope: Globe render on load, hover interaction, click-to-panel, keyboard navigation, URL state

### 11.3 Performance Benchmarks

- Tools: **Lighthouse**, Chrome DevTools Performance panel
- Targets: NFR-1 (60 FPS), NFR-2 (<4s load), NFR-3 (<100ms latency)

---

## 12. Deployment Requirements

- **Hosting:** Vercel (optimal for Next.js)
- **Node.js:** Version 20+
- **Build output:** SSR (server-side rendering via Next.js App Router)
- **Environment variables:** `.env.local` for API keys and configuration (Phase 2 onwards)
- **CI/CD:** GitHub Actions → Vercel preview deployments on PR, production on merge to `main`

---

## 13. Development Methodology

### 13.1 AI Agent Workflow

Three agents collaborate on every feature:

| Agent | Model | Responsibilities |
|---|---|---|
| Builder | Claude Sonnet | Implementation, coding, refactoring |
| Reviewer | Claude Opus | Architecture review, performance review, code quality |
| Red Team | Claude Opus (Adversarial) | Challenge assumptions, identify scaling risks, identify architectural weaknesses |

**Feature cycle:**

1. Builder implements the feature following the spec and tasks
2. Reviewer reviews the implementation for architecture and performance compliance
3. Red Team adversarially challenges assumptions and surfaces risks
4. All three agents must approve before merge to `main`

---

## 14. Future Roadmap

**Phase 2**
- Mobile optimization
- Discovery mechanics
- Unlockable discoveries
- Timeline UI
- Live Wikidata/Wikipedia API integration (replaces static JSON)
- Natural Earth 1:50m polygon upgrade

**Phase 3**
- Historical Earth states
- Ancient civilizations
- Geological timeline

**Phase 4**
- Search engine
- AI-generated discovery recommendations
- Personalized exploration

---

## 15. Success Criteria

Wonder Earth MVP is successful when:

- Earth interaction feels magical
- Hover/click interactions feel natural
- Users experience curiosity and discovery
- The product feels atmospheric and unique
- The architecture supports future expansion

---

## 16. Appendix

### 16.1 Recommended Initial Dataset

The following 5 countries provide strong discovery diversity for MVP validation:

| Country | Why |
|---|---|
| Egypt | Ancient history, mythology, mystery |
| Peru | Inca civilization, Nazca lines, anomalies |
| Iceland | Geological extremes, volcanism, aurora |
| Japan | Cultural depth, geological activity, islands |
| Antarctica | Remoteness, scientific anomaly, mystery |

### 16.2 Changelog

| Version | Date | Summary |
|---|---|---|
| V1 | 2026-04 | Initial SRS |
| V2 | 2026-05-08 | Added: Tailwind CSS, TanStack Query, browser compatibility matrix, minimum viewport, loading screen (FR-5), WebGL error state (FR-6), keyboard navigation (FR-11), URL deep-linking (FR-12), discovery fallback (FR-14), testing strategy, deployment requirements, GeoJSON source specificity, static discovery data approach, API caching (NFR-8), AI agent workflow detail. Replaced unverified `react-three-globe` with `react-globe.gl`. Deduplicated architectural principles (reference constitution). |
