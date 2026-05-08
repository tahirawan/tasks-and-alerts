# CHANGELOG.md

## [0.1.0] — 2026-05-08 — Phase 1: Foundation Setup

### Added

**Monorepo**
- npm workspaces monorepo at project root
- Root `tsconfig.base.json` with strict TypeScript (strictest settings including `exactOptionalPropertyTypes`)
- ESLint 9 flat config with typescript-eslint, react, react-hooks plugins
- Prettier 3 with tailwindcss plugin
- `.gitignore`, `.nvmrc`

**packages/shared-types**
- `EntryType`, `EntryStatus`, `ReminderMode`, `ReminderOffsetUnit`, `SyncStatus`, `DataSource` enums
- `Entry`, `ReminderRule`, `CreateEntryInput`, `UpdateEntryInput` types
- `IEntryRepository` interface (listEntries, getEntry, createEntry, updateEntry, deleteEntry, exportData, importData)
- `INotificationService` interface (requestPermission, scheduleReminder, cancelReminder, rescheduleReminder, isSupported)
- `ValidationResult`, `ValidationError` types
- `EntryFilter` type

**packages/shared-utils**
- `generateId()` — crypto.randomUUID with fallback
- `nowISO()`, `toISO()`, `fromISO()`, `isValidISO()`
- `combineDateAndTime()` — local-timezone-aware date+time merge
- `todayDateString()` — local YYYY-MM-DD
- `subtractOffset()`, `offsetToMilliseconds()` — reminder offset arithmetic
- `isFuture()`, `isPast()`
- `formatDisplayDateTime()`, `formatDisplayDate()`, `formatDisplayTime()`

**packages/shared-core**
- `computeReminderDateTime()` — pure function, returns computed reminder ISO or null
- `withComputedReminder()` — enriches Entry.reminder without mutation
- `validateCreateEntryInput()` — full validation with structured errors
- `createEntry()` use-case — validates, builds Entry, saves, schedules notification
- `updateEntry()` use-case — patches, recomputes reminder, reschedules notification
- `deleteEntry()` use-case — cancels notification, removes from repository
- `listEntries()` use-case — delegates to repository with optional filter

**packages/shared-ui**
- Stub package — grows in Phase 4

**apps/web**
- React 19 + TypeScript 5.8 + Vite 6
- Tailwind CSS 3.4 with custom primary color palette and component classes
- Zustand 5 store (`useEntryStore`) wiring all use-cases
- Dexie 4 `AppDatabase` with schema version 1
- `LocalEntryRepository` implementing `IEntryRepository`
- `BrowserNotificationService` implementing `INotificationService`
- `BrowserRouter` with `/entries` list and `/entries/new` create routes
- `Layout` component with header navigation
- `EntryListPage` — lists entries, inline complete/delete
- `CreateEntryPage` — back navigation, form submission
- `EntryForm` — type selector, title, notes, today/date toggle, time, reminder mode + offset
- `EntryCard` — status toggle, reminder display, delete
- PWA via vite-plugin-pwa (Workbox, service worker, manifest)
- `favicon.svg`

### Tests
- 39 tests across 4 test files, all passing
- `shared-utils`: 13 tests (datetime arithmetic, offset math, ISO validation)
- `shared-core`: 19 tests (reminder calculator × 9, entry validation × 10)
- `apps/web`: 7 integration tests (LocalEntryRepository with isolated fake-indexeddb)

### Build
- Production build: 347 KB JS, 14 KB CSS (gzipped: 113 KB / 3.2 KB)
- PWA service worker + workbox generated
- 0 vulnerabilities in 699 packages

---

## [0.0.1] — Initial Setup
- Added governance documentation
- Added architecture planning
- Added AI coordination structure
