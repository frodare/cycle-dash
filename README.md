# Cycle Dash

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run lint         # Run ts-standard linter
npm run type-check   # TypeScript type check (no emit)
npm run test         # Run Jest tests
npm run test:dev     # Run Jest in watch mode
npm run deploy       # Build + deploy to GitHub Pages
```

## Architecture

CycleDash is a browser-based GPS cycling tracker. It uses **Canvas API** for all rendering (no React/Vue) with **Redux Toolkit** for state management.

### Key Concepts

- **No DOM components**: All UI is drawn imperatively on a `<canvas>` element. `ui/index.ts` is the root renderer.
- **Render loop**: Store changes trigger a debounced render (max 40fps, 25ms debounce). See `main.ts`.
- **Coordinate system**: Geographic LngLat ↔ screen pixels via Spherical Mercator. `projection.ts` exports `toPoint` and `toLngLat`.
- **State shape**:
  - `screen`: viewport (center, scale, width, height) — controls map pan/zoom
  - `track`: GPS track points, current location, loaded trails (historical tracks)

### Important Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Entry point; wires canvas, store, interaction, location tracking |
| `src/store.ts` | Redux store combining `screen` and `track` slices |
| `src/projection.ts` | Geographic ↔ pixel coordinate conversion |
| `src/interaction.ts` | Pointer/wheel events → pan/zoom dispatch; long-press detection |
| `src/db.ts` | IndexedDB persistence via `idb` |
| `src/setupLocationTracking.ts` | GPS input (or demo mode) → `updateLocation` dispatch |
| `src/features/track/` | Track slice: `updateLocation` action, distance filtering, selectors |
| `src/features/screen/` | Screen slice: `setCenter`, `setScale`, `setSize` |
| `src/ui/index.ts` | Root canvas renderer; calls map and telemetry component renderers |
| `src/ui/map/` | Map rendering: trails, current track, location marker |

### Data Flow

1. GPS → `setupLocationTracking.ts` → `updateLocation` action
2. `updateLocation` filters points by min distance (0.02 km) and appends to track
3. Store change → debounced `render()` call
4. `ui/index.ts` clears canvas and draws: time, telemetry, location coords, map
5. Auto-save to IndexedDB every 60 seconds; loads prior tracks as "trails" on start

### Tech Stack

- **TypeScript** + **Vite** (build)
- **Redux Toolkit** (state)
- **Canvas 2D API** + **RoughJS** (rendering — hand-drawn aesthetic)
- **@mapbox/sphericalmercator** (projection)
- **@turf/turf** (distance, bearing calculations)
- **idb** (IndexedDB wrapper)
- **ts-standard** (linter — StandardJS style for TypeScript)
- **Jest** + **ts-jest** + **jsdom** (tests)

### Linting

This project uses `ts-standard` (StandardJS variant for TypeScript). No semicolons, 2-space indent, single quotes. Run `npm run lint` to check.
