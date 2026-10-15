# HabitUs Constitution

## Core Principles

### I. Simplicity First
Prefer the most direct solution; avoid libraries and complex patterns that a second-semester student cannot explain. Every architectural choice must be justifiable in plain language. Complexity must be explicitly justified, not assumed.

### II. Technology by Delivery
- **Delivery 1**: Only JavaScript, JSON, and Vite. No backend and no libraries beyond those required by Vite.
- **Delivery 2**: Supabase and React will be added. Do not anticipate these technologies in Delivery 1.
- No technology outside this list may be added without explicit approval.

### III. Data Isolation
All data access (read, save, query) must reside in a separate layer from the rest of the code, so that in Delivery 2 the JSON storage can be replaced with Supabase without rewriting the interface. The data layer exposes a stable contract; the UI depends only on that contract.

### IV. Layered Delivery
Build in vertical slices that work independently:
1. Core: login, profile, individual habits
2. Groups and ranking
3. Feed
Each layer must be fully functional before the next begins. No partial features spanning layers.

### V. Explicit Business Rules
Rules such as "an activity counts once per day per user" must live in dedicated, pure functions that are easy to test and read. Business logic is not scattered across event handlers or UI components.

### VI. Readable Code
Consistent naming, comments on non-obvious parts, small functions. Code should be understandable by a peer without extensive onboarding. Favor clarity over cleverness.

### VII. Small Verifiable Changes
Implement in short steps, testing each before proceeding. Each commit should represent a single logical change that can be verified independently. No "big bang" integrations.

## Technology Stack

### Delivery 1 (Current)
- Language: JavaScript (ES modules)
- Build/Dev: Vite
- Storage: Local JSON files via data layer
- Testing: Native `assert` or minimal test runner (no heavy frameworks)

### Delivery 2 (Planned)
- Adds: React, Supabase (PostgreSQL, Auth, Realtime)
- Migration: Replace JSON data layer with Supabase client; UI unchanged

## Development Workflow

1. **Specify** → Write/accept a short spec for the next slice
2. **Implement** → Add code in small commits following the principles above
3. **Verify** → Run tests, lint, and manual check for the slice
4. **Integrate** → Ensure the new slice works with previous layers
5. **Document** → Update any affected docs or architecture notes

All changes must pass lint and typecheck (if configured) before merge. No direct pushes to main without review.

## Governance

This constitution supersedes all other practices. Amendments require:
- Documentation of the change and rationale
- Approval by project leads (or instructor for academic context)
- Migration plan if existing code is affected

All PRs and reviews must verify compliance with these principles. Complexity must be justified in the PR description. Use `AGENTS.md` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15