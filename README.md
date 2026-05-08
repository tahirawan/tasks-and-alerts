# Tasks & Alerts Platform

A local-first, cross-platform Tasks & Alerts app — Web/PWA today, Android and iOS ready, future Laravel backend.

---

## Vision

Manage tasks and alerts from any device. Offline-first, data never leaves your device until you choose to sync.

---

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | React 19 + TypeScript 5.8 + Vite 6 |
| Styling          | Tailwind CSS 3.4                   |
| State            | Zustand 5                          |
| Storage          | Dexie.js 4 (IndexedDB)             |
| PWA              | vite-plugin-pwa (Workbox)          |
| Cross-platform   | Capacitor (Phase 2)                |
| Backend (future) | Laravel + Sanctum                  |
| Testing          | Vitest 3                           |

---

## Project Structure

```
tasks-and-alerts/
├── apps/
│   ├── web/          ← React PWA (Phase 1 — active)
│   ├── android/      ← Capacitor Android (Phase 2)
│   └── ios/          ← Capacitor iOS (Phase 4)
├── packages/
│   ├── shared-types/ ← DTOs, enums, interfaces
│   ├── shared-core/  ← Domain logic, use-cases
│   ├── shared-utils/ ← Date/timezone/ID utilities
│   └── shared-ui/    ← Shared React components (Phase 4)
├── backend/
│   └── laravel/      ← Laravel API (Phase 3)
└── docs/
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 20, npm ≥ 10

```bash
# Install all workspace dependencies
npm install

# Start web dev server
npm run dev

# Run all tests
npm run test --workspaces --if-present

# Build web app
npm run build --workspace=apps/web

# Type-check all packages
npm run type-check --workspaces --if-present

# Lint
npm run lint

# Format
npm run format
```

---

## Architecture

Clean Architecture with strict layer separation:

- **Domain** (`shared-core/domain`) — pure business logic, no I/O
- **Application** (`shared-core/application`) — use-cases, orchestrates domain + interfaces
- **Infrastructure** (`apps/web/infrastructure`) — Dexie storage, Browser Notification API
- **UI** (`apps/web/ui`) — React components and pages
- **State** (`apps/web/store`) — Zustand store wiring use-cases to UI

Storage and notifications sit behind interfaces (`IEntryRepository`, `INotificationService`) — swapping to a Laravel backend in Phase 3 requires only a new implementation, not changes to any other layer.

---

## Roadmap

| Phase | Focus                                                                  |
| ----- | ---------------------------------------------------------------------- |
| 1 ✅  | Foundation: monorepo, domain, PWA, local storage, notifications, tests |
| 2     | Android via Capacitor                                                  |
| 3     | Laravel backend, auth, cloud sync, push/email/SMS notifications        |
| 4     | iOS, multi-device sync, import/export                                  |
| 5     | AI reminders, calendar integration                                     |

---

## AI Workflow

All AI assistants must follow: `AGENTS.md`, `ARCHITECTURE.md`, `TESTING.md`, `CODING_STANDARDS.md`, `DECISIONS.md`
