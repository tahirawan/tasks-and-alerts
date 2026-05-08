# ARCHITECTURE.md

# Project Vision

A local-first Tasks & Alerts platform designed for:
- Web/PWA
- Android
- iOS
- Future Laravel backend
- Future cloud synchronization
- Future push/email/SMS notifications

---

# Core Principles

- Clean Architecture
- SOLID principles
- OOP best practices
- Composition over inheritance
- Shared domain layer
- Platform-independent business logic
- Dependency inversion
- Feature modularity
- Offline-first design
- Backend-ready abstractions

---

# Initial MVP Features

- Tasks
- Alerts
- Notes
- Date/time scheduling
- Relative reminder timing
- Local notifications
- Local storage
- Import/export support

---

# Shared Architecture

project-root/
├── apps/
│   ├── web/
│   ├── android/
│   └── ios/
├── packages/
│   ├── shared-core/
│   ├── shared-types/
│   ├── shared-ui/
│   └── shared-utils/
└── backend/
    └── laravel/

---

# Recommended Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind
- Zustand or Redux Toolkit
- PWA support

## Cross Platform
- Shared TypeScript packages
- Capacitor bridge

## Local Storage
- IndexedDB
- Dexie.js
- SQLite for mobile if required

## Notifications
Initial:
- Local notifications

Future:
- Firebase Cloud Messaging
- Email notifications
- SMS notifications

## Backend
Future:
- Laravel
- Sanctum authentication
- Queues/workers
- Notification services
- Event-driven architecture
