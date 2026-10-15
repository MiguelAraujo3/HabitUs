# Implementation Plan: Core Individual Habits

**Branch**: `001-core-individual-habits` | **Date**: 2026-10-15 | **Spec**: specs/001-core-individual-habits/spec.md

**Input**: Feature specification from `/specs/001-core-individual-habits/spec.md`

## Summary

Build the core individual habits foundation for HabitUs: account creation, login/logout, profile management, habit CRUD with three frequency types (daily, chosen weekdays, times per week), streak tracking, and daily progress display. Delivery 1 uses vanilla JavaScript (ES modules), Vite, and local JSON storage via an isolated data layer. No backend, no React, no external libraries beyond Vite. The data layer contract must remain stable for Delivery 2 migration to Supabase.

## Technical Context

**Language/Version**: JavaScript (ES2022 modules), Node.js 18+ for Vite dev server

**Primary Dependencies**: Vite (dev server, build), no runtime dependencies

**Storage**: Local JSON files via isolated data layer (file-based persistence in `data/` directory)

**Testing**: Native `assert` module + custom minimal test runner (no Jest, Vitest, etc.)

**Target Platform**: Modern browsers (ES modules support), responsive 320px–1920px

**Project Type**: Single-page application (SPA), client-only, no backend

**Performance Goals**: Mark/unmark habit < 500ms perceived latency; page load < 2s; streak calculation for 30 days < 100ms

**Constraints**: 
- Delivery 1: vanilla JS only, no React, no Supabase, no extra libraries
- Data layer must be fully isolated (separate module, stable interface)
- No password recovery (intentional)
- Week starts Sunday, ends Saturday (fixed)
- PBKDF2-SHA256 (100k+ iterations) via Web Crypto API for password hashing
- Session persists in localStorage until explicit logout

**Scale/Scope**: Single user per browser (local-first), ~10-50 habits, ~365 completion records per habit/year

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Vanilla JS, no frameworks, minimal patterns |
| II. Technology by Delivery | PASS | Only JS, JSON, Vite for Delivery 1 |
| III. Data Isolation | PASS | Dedicated `data/` layer with stable contract |
| IV. Layered Delivery | PASS | Core slice only (login, profile, habits) |
| V. Explicit Business Rules | PASS | Streak logic in pure functions in `rules/` |
| VI. Readable Code | PASS | Small modules, consistent naming, comments |
| VII. Small Verifiable Changes | PASS | Plan breaks into atomic tasks |

No violations. All principles satisfied by design.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-individual-habits/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (data layer interface)
└── tasks.md             # Phase 2 output (later)
```

### Source Code (repository root)

```text
src/
├── main.js                 # App entry point, routing, bootstrap
├── styles/
│   └── main.css            # Global styles, responsive layout
├── pages/
│   ├── login.html          # Login/registration page
│   ├── login.js            # Login/registration logic
│   ├── habits.html         # Habits dashboard (list, progress, marking)
│   ├── habits.js           # Habits dashboard logic
│   ├── habit-form.html     # Create/edit habit modal/page
│   ├── habit-form.js       # Habit form logic
│   ├── profile.html        # Profile view/edit
│   └── profile.js          # Profile logic
├── components/
│   ├── header.js           # Top nav with user menu, logout
│   ├── habit-card.js       # Habit display component
│   ├── streak-badge.js     # Streak display component
│   └── progress-bar.js     # Daily progress indicator
├── data/
│   ├── index.js            # Data layer public API (stable contract)
│   ├── storage.js          # JSON file read/write (localStorage fallback)
│   ├── users.js            # User CRUD, auth, password hashing
│   ├── habits.js           # Habit CRUD, queries
│   └── completions.js      # HabitCompletion CRUD, queries
├── rules/
│   ├── streak.js           # Pure streak calculation functions
│   ├── frequency.js        # Frequency helpers (isDueToday, weekBounds)
│   └── validation.js       # Input validation pure functions
└── utils/
    ├── date.js             # Date helpers (local midnight, week bounds)
    ├── crypto.js           # PBKDF2 password hashing wrapper
    └── dom.js              # Small DOM utilities

public/
├── index.html              # Vite entry HTML
└── data/                   # JSON storage (gitignored)
    ├── users.json
    ├── habits.json
    └── completions.json

tests/
├── unit/
│   ├── rules.streak.test.js
│   ├── rules.frequency.test.js
│   ├── rules.validation.test.js
│   ├── utils.crypto.test.js
│   └── utils.date.test.js
├── integration/
│   ├── data.users.test.js
│   ├── data.habits.test.js
│   └── data.completions.test.js
└── test-runner.js          # Minimal test harness
```

**Structure Decision**: Single-project SPA with vanilla ES modules. Pages are HTML+JS pairs loaded via dynamic import. Data layer (`src/data/`) is fully isolated with a stable public API in `src/data/index.js`. Business rules (`src/rules/`) are pure functions with no side effects. Components (`src/components/`) are reusable UI modules. This structure supports the Constitution's data isolation, explicit business rules, and simplicity principles.

## Complexity Tracking

No violations requiring justification. All constitutional principles are satisfied by the chosen structure.

## Phase 0: Research

All technical context items are resolved per constitution and spec clarifications. No NEEDS CLARIFICATION remains.

### Research Tasks (for `research.md`)

1. **Vite SPA configuration for vanilla JS** - Multi-page entry points, dynamic imports, dev server proxy not needed
2. **Web Crypto API PBKDF2 implementation** - SubtleCrypto.deriveBits with PBKDF2, salt generation, iteration count
3. **localStorage session pattern** - Store user ID + token, restore on load, clear on logout
4. **JSON file persistence in Vite** - Write to `public/data/` via fetch+FileSystem Access API or localStorage fallback; read via fetch
5. **Date handling for local midnight/week bounds** - Intl.DateTimeFormat, getTimezoneOffset, Sunday-Saturday week
6. **Minimal test runner pattern** - Node `assert` + browser-compatible runner, async support

## Phase 1: Design & Contracts

### Data Model (`data-model.md`)

Entities from spec:
- **User**: id, name, username, email, passwordHash (PBKDF2), salt, iterations, profileDescription, createdAt
- **Habit**: id, userId, name, category, description, frequencyType (daily|weekdays|times_per_week), frequencyConfig (weekdays[]|targetCount), createdAt, currentStreak, longestStreak, streakUnit (days|week_equivalents)
- **HabitCompletion**: id, habitId, userId, completionDate (YYYY-MM-DD), createdAt
- **Category**: Fixed enum (11 values)

Relationships: User 1:N Habits, Habit 1:N Completions, User 1:N Completions

Validation rules from FRs: unique username/email, required name/category, frequency config per type

### Contracts (`contracts/data-layer.md`)

Stable data layer interface (to be preserved for Delivery 2 Supabase migration):

```typescript
// User operations
createUser(data: {name, username, email, password}) => Promise<User>
getUserById(id) => Promise<User|null>
getUserByEmailOrUsername(identifier) => Promise<User|null>
updateUser(id, data: {name?, username?, profileDescription?}) => Promise<User>
verifyPassword(user, password) => Promise<boolean>

// Habit operations
createHabit(data: {userId, name, category, description?, frequencyType, frequencyConfig}) => Promise<Habit>
getHabitsByUser(userId) => Promise<Habit[]>
getHabitById(id) => Promise<Habit|null>
updateHabit(id, data) => Promise<Habit>
deleteHabit(id) => Promise<void>

// Completion operations
createCompletion(data: {habitId, userId, completionDate}) => Promise<HabitCompletion>
getCompletionsByHabit(habitId) => Promise<HabitCompletion[]>
getCompletionsByUserAndDate(userId, date) => Promise<HabitCompletion[]>
deleteCompletion(habitId, date) => Promise<void>

// Query operations
getTodaysHabits(userId) => Promise<Habit[]>  // filtered by frequency + today
getHabitStreak(habitId) => Promise<{current, longest, unit}>
```

### Quickstart (`quickstart.md`)

Validation scenarios:
1. `npm install && npm run dev` → Vite dev server starts
2. Open `http://localhost:5173` → Login page loads
3. Register new user → Redirected to habits dashboard
4. Create habit (each frequency type) → Appears in list
5. Mark habit complete → Streak updates, progress increments
6. Unmark habit → Streak decrements, progress decrements
7. Edit profile → Changes persist after reload
8. Logout → Returns to login, session cleared
9. Close/reopen browser → Still logged in (localStorage)
10. Run tests: `node tests/test-runner.js` → All pass