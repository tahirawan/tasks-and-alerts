# TESTING.md

# Mandatory Rules

- Every change must be tested
- No untested merges
- Regression tests required
- Lint before commit
- Format before commit
- Type checks required
- Build must pass

---

# Testing Layers

## Unit Tests
- Business logic
- Utilities
- Reminder calculations

## Integration Tests
- Storage layer
- Notification layer
- Shared packages

## UI Tests
- Forms
- Validation
- Scheduling

## Edge Case Tests
- Timezone handling
- Daylight savings
- Reminder offsets
- Offline mode

---

# CI Requirements

- Lint
- Format check
- Type check
- Unit tests
- Build verification
