# Research: Core Individual Habits

**Date**: 2026-10-15
**Feature**: specs/001-core-individual-habits

## Research Tasks & Findings

### 1. Vite SPA Configuration for Vanilla JS

**Decision**: Use Vite's multi-page application (MPA) mode with multiple HTML entry points. Each page (login, habits, profile, habit-form) is a separate HTML file with its own JS module. Shared code lives in `src/` modules imported via ES modules.

**Rationale**: 
- Simpler than SPA router for Delivery 1 (no React Router, no hash/history routing)
- Each page is independently loadable and testable
- Vite handles HMR for each entry point
- Aligns with "simplicity first" - no client-side routing library needed

**Alternatives Considered**:
- Single `index.html` with hash-based router: Rejected - adds routing complexity, harder to test individual pages
- Vite plugin for SPA fallback: Rejected - unnecessary for MPA approach

**Key Config** (`vite.config.js`):
```js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'public/index.html',
        login: 'src/pages/login.html',
        habits: 'src/pages/habits.html',
        profile: 'src/pages/profile.html',
        'habit-form': 'src/pages/habit-form.html'
      }
    }
  },
  server: { port: 5173 }
})
```

---

### 2. Web Crypto API PBKDF2 Implementation

**Decision**: Use `crypto.subtle.deriveBits` with PBKDF2 algorithm. Generate 16-byte salt per user, 100,000 iterations, SHA-256, 256-bit key length. Store salt, iterations, and derived key (hex) in user record.

**Rationale**:
- Browser-native, no dependencies (constitution: no extra libraries)
- PBKDF2 is NIST-recommended for password hashing
- 100k iterations provides adequate client-side protection
- Salt prevents rainbow tables
- Delivery 2 replaces with Supabase Auth (server-side bcrypt/scrypt)

**Implementation** (`src/utils/crypto.js`):
```js
const ITERATIONS = 100000;
const KEY_LENGTH = 256;
const ALGO = { name: 'PBKDF2', hash: 'SHA-256' };

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), ALGO, false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { ...ALGO, salt, iterations: ITERATIONS }, key, KEY_LENGTH
  );
  return {
    hash: bytesToHex(new Uint8Array(derived)),
    salt: bytesToHex(salt),
    iterations: ITERATIONS
  };
}

export async function verifyPassword(password, { hash, salt, iterations }) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), ALGO, false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { ...ALGO, salt: hexToBytes(salt), iterations }, key, KEY_LENGTH
  );
  return bytesToHex(new Uint8Array(derived)) === hash;
}
```

**Alternatives Considered**:
- bcryptjs library: Rejected - violates "no extra libraries" rule
- Simple SHA-256: Rejected - no salt, no iteration, insecure
- scrypt via Web Crypto: Rejected - not widely supported in browsers yet

---

### 3. localStorage Session Pattern

**Decision**: On login, store `{userId, username, token}` in localStorage under key `habitus_auth`. Token is a random 32-byte hex string (also stored in user record for validation). On app bootstrap, check localStorage; if valid user exists, restore session. On logout, clear localStorage and user's token.

**Rationale**:
- Simple, no cookies/server needed
- Persists across browser close/reopen (clarification Q1)
- Token allows future invalidation (e.g., password change)
- Minimal code, easy to explain

**Security Note**: localStorage accessible via XSS. Acceptable for Delivery 1 (local-only, academic). Delivery 2 uses Supabase Auth with HttpOnly cookies.

---

### 4. JSON File Persistence in Vite

**Decision**: Dual strategy:
- **Development**: Use File System Access API (modern browsers) to read/write `public/data/*.json` directly. Fallback to localStorage if API unavailable.
- **Production build**: JSON files are static assets. Writes go to localStorage (persists per browser). Data layer abstracts this.

**Rationale**:
- Vite serves `public/` as static files; cannot write to them at runtime in production
- File System Access API works in dev (localhost) for true file persistence
- localStorage fallback ensures functionality in all contexts
- Data layer interface unchanged - swap storage backend without UI impact

**Implementation** (`src/data/storage.js`):
```js
const STORAGE_KEYS = { users: 'habitus_users', habits: 'habitus_habits', completions: 'habitus_completions' };

export async function readJSON(name) {
  // Try File System Access API (dev)
  if (window.showOpenFilePicker) { /* ... */ }
  // Fallback: localStorage
  const data = localStorage.getItem(STORAGE_KEYS[name]);
  return data ? JSON.parse(data) : [];
}

export async function writeJSON(name, data) {
  // Try File System Access API (dev)
  if (window.showSaveFilePicker) { /* ... */ }
  // Fallback: localStorage
  localStorage.setItem(STORAGE_KEYS[name], JSON.stringify(data));
}
```

**Alternatives Considered**:
- IndexedDB: Rejected - overkill for small dataset, more complex API
- Only localStorage: Rejected - loses file-based persistence for dev/grading
- Backend API: Rejected - Delivery 1 has no backend

---

### 5. Date Handling for Local Midnight / Week Bounds

**Decision**: Use `Intl.DateTimeFormat` with `timeZone: 'local'` (default) for user's local midnight. Week bounds: Sunday 00:00 to Saturday 23:59:59.999 in local time.

**Rationale**:
- Spec: "O dia vira à meia-noite, no horário da pessoa" (local midnight)
- Spec: "A semana começa no domingo e termina no sábado" (fixed, not locale-dependent)
- `Intl` API handles DST transitions correctly
- No timezone library needed (simplicity)

**Implementation** (`src/utils/date.js`):
```js
export function getLocalMidnight(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekBounds(date = new Date()) {
  const d = getLocalMidnight(date);
  const day = d.getDay(); // 0=Sun, 6=Sat
  const start = new Date(d);
  start.setDate(d.getDate() - day); // Sunday
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function formatDateKey(date) { // YYYY-MM-DD
  return getLocalMidnight(date).toISOString().split('T')[0];
}

export function isToday(date) {
  return formatDateKey(date) === formatDateKey(new Date());
}
```

---

### 6. Minimal Test Runner Pattern

**Decision**: Custom test runner using Node's `assert` module (available globally in Node 18+). Runs in Node for unit tests (pure functions), with a browser-compatible shim for DOM tests if needed. Output: TAP-like format.

**Rationale**:
- No Jest/Vitest (constitution: no heavy test frameworks)
- `assert` is built-in, zero dependencies
- Pure functions in `rules/` and `utils/` are easily testable in Node
- Data layer tests can use in-memory storage mock

**Implementation** (`tests/test-runner.js`):
```js
import assert from 'assert';
import fs from 'fs';
import path from 'path';

const testFiles = fs.readdirSync('./tests/unit').filter(f => f.endsWith('.test.js'));
let passed = 0, failed = 0;

for (const file of testFiles) {
  const mod = await import(`../tests/unit/${file}`);
  for (const [name, fn] of Object.entries(mod)) {
    if (name.startsWith('test_')) {
      try { await fn(); console.log(`ok ${name}`); passed++; }
      catch (e) { console.log(`not ok ${name} - ${e.message}`); failed++; }
    }
  }
}
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

**Test Example** (`tests/unit/rules.streak.test.js`):
```js
import { calculateDailyStreak, calculateWeekdayStreak, calculateTimesPerWeekStreak } from '../../src/rules/streak.js';

export async function test_daily_streak_increments() {
  const completions = ['2026-10-10', '2026-10-11', '2026-10-12'];
  assert.strictEqual(calculateDailyStreak(completions, '2026-10-12'), 3);
}
```

---

## Summary

All technical unknowns resolved. No NEEDS CLARIFICATION remains. The research provides concrete implementation patterns for each Delivery 1 constraint, aligned with the Constitution.