# DECISIONS.md

## ADR-001
Decision: Use React + TypeScript + Vite for web/PWA.

Reason:
- Excellent tooling
- Shared TypeScript ecosystem
- Strong PWA support
- Cross-platform readiness
- Shared model compatibility

Consequences:
- Easier Android/iOS bridging via Capacitor
- Shared package reuse
- Strong typing across platforms

---

## ADR-002
Decision: Use local-first architecture.

Reason:
- Offline support
- Faster MVP
- Easier deployment
- Better UX

Consequences:
- Future sync engine required
- Conflict resolution planning required

---

## ADR-003
Decision: Use npm workspaces for monorepo management.

Reason:
- No additional tooling required (npm 10 native support)
- Shared packages consumed by all apps with `*` version references
- Clean workspace isolation per package

Consequences:
- Packages are symlinked into root node_modules
- CI must run `npm install` at root before building any workspace
- Consider migrating to pnpm for better hoisting control if workspace count grows

---

## ADR-004
Decision: IEntryRepository.createEntry accepts a fully-constructed Entry, not CreateEntryInput.

Reason:
- ID generation and timestamp assignment belong in the application layer (createEntry use-case)
- Repository is a persistence adapter — it should not assign domain identity
- Keeps repository implementations simple and interchangeable

Consequences:
- The application layer (createEntry.ts) is always responsible for ID/timestamp construction
- ApiEntryRepository will follow the same contract — the server response replaces the local entity

---

## ADR-005
Decision: Use exactOptionalPropertyTypes: true in TypeScript config.

Reason:
- Prevents silent undefined assignment to optional fields
- Forces explicit conditional spreads which are more readable
- Catches bugs where missing optional fields are accidentally set to undefined

Consequences:
- All optional properties must use conditional spreads (`...(val ? { key: val } : {})`)
- Slightly more verbose in a few places, but eliminates a class of runtime bugs

---

## ADR-006
Decision: Use Dexie.js v4 with IDBFactory injection for test isolation.

Reason:
- Dexie accepts a custom IndexedDB implementation in its constructor
- Each test creates a `new IDBFactory()` from fake-indexeddb — fully isolated, no state leak
- No need for global fake-indexeddb setup or database teardown between tests

Consequences:
- AppDatabase constructor accepts optional Dexie options parameter
- Production code passes no options (uses real browser IndexedDB)
- Test code passes `{ indexedDB: new IDBFactory(), IDBKeyRange }` for isolation

---

## ADR-007
Decision: Use Vitest 3 as the test runner across all packages.

Reason:
- Vite-native: same transform pipeline, instant startup
- Jest-compatible API: familiar assertions, describe/it/expect
- Pure Node environment for shared packages (no browser needed)
- jsdom environment for apps/web (React component testing)
- Coverage via @vitest/coverage-v8

Consequences:
- All packages define their own vitest.config.ts
- Test files follow `*.test.ts` / `*.spec.ts` convention
- CI runs `npm run test --workspaces --if-present`
