# TASKS.md

## Completed — Phase 1 (Foundation Setup)

- [x] Setup monorepo structure (npm workspaces)
- [x] Setup shared packages (shared-types, shared-utils, shared-core, shared-ui stub)
- [x] Setup ESLint (flat config, ESLint 9 + typescript-eslint)
- [x] Setup Prettier (with tailwindcss plugin)
- [x] Setup TypeScript strict mode (base tsconfig inherited by all packages)
- [x] Setup testing framework (Vitest 3, isolated fake-indexeddb per test)
- [x] Setup React + Vite + Tailwind + PWA in apps/web
- [x] Setup Zustand state management
- [x] Setup Dexie.js IndexedDB storage
- [x] Implement domain layer (Entry entity, ReminderRule, enums)
- [x] Implement reminder calculator (pure, timezone-safe)
- [x] Implement entry validation
- [x] Implement use-cases (createEntry, updateEntry, deleteEntry, listEntries)
- [x] Implement IEntryRepository and INotificationService interfaces
- [x] Implement LocalEntryRepository (Dexie/IndexedDB)
- [x] Implement BrowserNotificationService
- [x] Implement entry list UI (EntryListPage, EntryCard)
- [x] Implement create entry UI (CreateEntryPage, EntryForm)
- [x] 39 tests passing (unit + integration)
- [x] Production build passing
- [x] PWA service worker generated

## Pending — Phase 2

- [ ] Android app via Capacitor
- [ ] Shared notification bridge (Capacitor + web)
- [ ] Android build pipeline
- [ ] Notification permission flow on mobile

## Pending — Phase 3

- [ ] Laravel backend
- [ ] Authentication (Sanctum)
- [ ] ApiEntryRepository implementation
- [ ] Cloud sync engine
- [ ] Push notifications (FCM)
- [ ] Email notifications
- [ ] SMS notifications

## Pending — Phase 4

- [ ] iOS support via Capacitor
- [ ] Multi-device sync
- [ ] Import/export UI
- [ ] Filtering and sorting UI
- [ ] Entry detail/edit page
- [ ] PWA install prompt

## Pending — Phase 5

- [ ] AI-assisted reminders
- [ ] Smart categorisation
- [ ] Calendar integration

## Technical Debt

- [ ] Add CI pipeline (GitHub Actions: lint, type-check, test, build)
- [ ] Add Husky + lint-staged git hooks
- [ ] Add E2E tests (Playwright)
- [ ] Add component tests for EntryForm and EntryCard
- [ ] Consider pnpm migration for better hoisting control
