# AGENTS.md - HabitUs Development Guide

## Project Overview
**HabitUs** — Social habit tracker, academic web programming project with two deliveries.
- **Delivery 1 (Current)**: Vanilla JavaScript (ES modules), Vite, JSON file storage. No backend, no React, no extra libraries.
- **Delivery 2 (Planned)**: Add React + Supabase (PostgreSQL, Auth, Realtime). Replace JSON data layer only.

## Constitution (Non-Negotiable Principles)
See `.specify/memory/constitution.md` for full text. Key constraints:
1. **Simplicity First** — No patterns a 2nd-semester student can't explain
2. **Technology by Delivery** — Delivery 1: JS + JSON + Vite ONLY
3. **Data Isolation** — All data access in `src/data/` layer with stable contract for Delivery 2 migration
4. **Layered Delivery** — Core (login, profile, habits) → Groups → Feed
5. **Explicit Business Rules** — Streak logic in pure functions (`src/rules/`)
6. **Readable Code** — Small functions, consistent naming, comments on non-obvious parts
7. **Small Verifiable Changes** — Atomic commits, test each step

## Spec-Driven Workflow
```
1. /speckit.specify   → Write feature spec (specs/###-name/spec.md)
2. /speckit.clarify   → Resolve ambiguities (max 3 questions)
3. /speckit.plan      → Generate plan.md, research.md, data-model.md, contracts/, quickstart.md
4. /speckit.tasks     → Generate tasks.md from plan
5. Implement          → Follow tasks, verify each step
```

## Current State (as of 2026-10-15)
- ✅ Constitution established
- ✅ Feature spec: `specs/001-core-individual-habits/spec.md` (core: login, profile, habits)
- ✅ Clarifications resolved: session persistence, streak units, PBKDF2 hashing
- ✅ Plan + design artifacts generated
- ⏳ Awaiting `/speckit.tasks` to generate implementation tasks
- ⏳ No source code yet (no package.json, no src/)

## Planned Project Structure (from plan.md)
```
src/
├── main.js                 # Entry point, routing, bootstrap
├── styles/main.css         # Global styles, responsive 320px-1920px
├── pages/                  # HTML+JS pairs (login, habits, profile, habit-form)
├── components/             # Reusable UI modules (header, habit-card, streak-badge, progress-bar)
├── data/                   # ISOLATED DATA LAYER (stable contract for Delivery 2)
│   ├── index.js            # Public API (createUser, getHabitsByUser, createCompletion, etc.)
│   ├── storage.js          # JSON file I/O (File System Access API + localStorage fallback)
│   ├── users.js            # User CRUD, auth, PBKDF2 password hashing
│   ├── habits.js           # Habit CRUD, queries
│   └── completions.js      # HabitCompletion CRUD, queries
├── rules/                  # PURE BUSINESS LOGIC (no side effects)
│   ├── streak.js           # Streak calculations per frequency type
│   ├── frequency.js        # isDueToday, weekBounds (Sun-Sat)
│   └── validation.js       # Input validation
└── utils/
    ├── date.js             # Local midnight, week bounds, YYYY-MM-DD formatting
    ├── crypto.js           # PBKDF2 wrapper (Web Crypto API, 100k iterations)
    └── dom.js              # Small DOM utilities

public/
├── index.html              # Vite entry
└── data/                   # JSON storage (gitignored): users.json, habits.json, completions.json

tests/
├── unit/                   # Pure function tests (Node assert)
├── integration/            # Data layer tests (in-memory storage mock)
└── test-runner.js          # Custom runner (no Jest/Vitest)
```

## Key Technical Decisions (from research.md)
| Area | Decision |
|------|----------|
| Routing | Vite MPA mode (5 HTML entry points), no client-side router |
| Auth | PBKDF2-SHA256 via Web Crypto API, 100k iterations, per-user salt |
| Session | localStorage `habitus_auth` {userId, username, token}, persists until explicit logout |
| Storage | Dev: File System Access API → `public/data/*.json`; Prod: localStorage fallback |
| Dates | Local midnight via `Intl`; Week: Sunday-Saturday fixed (not locale-dependent) |
| Testing | Native `assert` + custom runner, runs in Node |

## Data Layer Contract (Critical for Delivery 2)
**Stable interface**: `src/data/index.js` exports 23 functions. UI must ONLY use this.
- User: `createUser`, `getUserById`, `getUserByEmailOrUsername`, `updateUser`, `verifyPassword`
- Habit: `createHabit`, `getHabitsByUser`, `getHabitById`, `updateHabit`, `deleteHabit`
- Completion: `createCompletion`, `getCompletionsByHabit`, `getCompletionsByUserAndDate`, `deleteCompletion`
- Queries: `getTodaysHabits`, `getHabitStreak`

Delivery 2 replaces internal implementation (`storage.js`, `users.js`, etc.) with Supabase client. **Function signatures must not change.**

## Streak Rules (Explicit Business Logic)
- **Daily**: Consecutive calendar days
- **Weekdays**: Consecutive selected weekdays (miss = reset)
- **Times/week**: Target N completions/week (Sun-Sat). Meet target → streak += N, habit hides rest of week. Miss target → streak = 0.
- **Profile "longest streak"**: Max across all habits in native units (days or week_equivalents) with unit label

## Commands to Run (Once Implemented)
```bash
npm install          # Install Vite only
npm run dev          # Start Vite dev server (port 5173)
node tests/test-runner.js  # Run all tests
```

## Common Pitfalls to Avoid
- ❌ Adding any library beyond Vite in Delivery 1
- ❌ Putting business logic in UI components (use `src/rules/`)
- ❌ Accessing JSON files directly from pages (use `src/data/index.js`)
- ❌ Using `Date` without local midnight handling (use `utils/date.js`)
- ❌ Storing plain passwords (always PBKDF2 hash)
- ❌ Changing `src/data/index.js` signatures without updating plan

## RESTRIÇÕES DA ENTREGA 1
- **Stack**: JavaScript (ESM), HTML, CSS e JSON, com Vite.
- **Persistência**: **Apenas LocalStorage** (sem File System Access API, sem JSON files no `public/data/`).
- **PROIBIDO**: React, Supabase, TypeScript e jQuery.
- **TAILWIND**: já instalado via npm, mantido por enquanto; **NÃO adicionar outras bibliotecas**. Se o professor não aceitar o Tailwind, ele será removido depois, então prefira classes simples e evite `@apply` complexo.
- **BASE DO VITE**: o site publica em `/habit-tracker/` (GitHub Pages). **Nunca** escrever caminhos absolutos como `/habit-tracker/...` ou `/`; usar `import.meta.env.BASE_URL`.
- **BRANCH BASE**: `develop`. Todo push na `develop` publica o site; `npm run build` tem que passar sempre.

## References
- Constitution: `.specify/memory/constitution.md`
- Feature spec: `specs/001-core-individual-habits/spec.md`
- Plan: `specs/001-core-individual-habits/plan.md`
- Data model: `specs/001-core-individual-habits/data-model.md`
- Data layer contract: `specs/001-core-individual-habits/contracts/data-layer.md`
- Quickstart validation: `specs/001-core-individual-habits/quickstart.md`