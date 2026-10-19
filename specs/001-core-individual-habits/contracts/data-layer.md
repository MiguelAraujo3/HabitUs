# Data Layer Contract: Core Individual Habits

**Version**: 1.0
**Date**: 2026-10-15
**Feature**: specs/001-core-individual-habits

## Purpose

This document defines the stable public interface of the data layer (`src/data/index.js`). The UI layer (pages, components) MUST ONLY interact with data through this interface. In Delivery 2, this module will be replaced with a Supabase-backed implementation while preserving the exact same function signatures and return types.

---

## Module: `src/data/index.js`

```js
// User Operations
export async function createUser(userData)
export async function getUserById(userId)
export async function getUserByEmailOrUsername(identifier)
export async function updateUser(userId, updates)
export async function verifyPassword(user, password)

// Habit Operations
export async function createHabit(habitData)
export async function getHabitsByUser(userId)
export async function getHabitById(habitId)
export async function updateHabit(habitId, updates)
export async function deleteHabit(habitId)

// Completion Operations
export async function createCompletion(completionData)
export async function getCompletionsByHabit(habitId)
export async function getCompletionsByUserAndDate(userId, date)
export async function deleteCompletion(habitId, date)

// Query Operations
export async function getTodaysHabits(userId)
export async function getHabitStreak(habitId)
```

---

## Type Definitions

### UserData (input for createUser)
```js
{
  name: string,           // required, 1-100 chars
  username: string,       // required, unique, 3-30 alphanumeric/underscore
  email: string,          // required, unique, valid email
  password: string        // required, plain text (will be hashed)
}
```

### User (return type)
```js
{
  id: string,             // UUID
  name: string,
  username: string,
  email: string,
  passwordHash: string,   // PBKDF2 hex
  salt: string,           // hex
  iterations: number,     // >= 100000
  profileDescription: string,
  createdAt: string       // ISO 8601
}
```

### UserUpdates (input for updateUser)
```js
{
  name?: string,
  username?: string,      // uniqueness validated
  profileDescription?: string
}
```

### HabitData (input for createHabit)
```js
{
  userId: string,         // UUID
  name: string,           // required, 1-100 chars
  category: string,       // required, one of 11 fixed values
  description?: string,   // optional, max 500 chars
  frequencyType: string,  // required: 'daily' | 'weekdays' | 'times_per_week'
  frequencyConfig: object // required, structure per type
}
```

### Habit (return type)
```js
{
  id: string,             // UUID
  userId: string,         // UUID
  name: string,
  category: string,
  description: string,
  frequencyType: string,  // 'daily' | 'weekdays' | 'times_per_week'
  frequencyConfig: object,
  createdAt: string,      // ISO 8601
  currentStreak: number,  // >= 0
  longestStreak: number,  // >= 0
  streakUnit: string      // 'days' | 'week_equivalents'
}
```

### HabitUpdates (input for updateHabit)
```js
{
  name?: string,
  category?: string,
  description?: string,
  frequencyType?: string,
  frequencyConfig?: object
}
```

### FrequencyConfig Structures
```js
// daily
{}

// weekdays
{ weekdays: number[] }    // 0=Sun .. 6=Sat, 1-6 items, unique

// times_per_week
{ targetCount: number }   // 1-7
```

### CompletionData (input for createCompletion)
```js
{
  habitId: string,        // UUID
  userId: string,         // UUID
  completionDate: string  // YYYY-MM-DD (local date, today only)
}
```

### HabitCompletion (return type)
```js
{
  id: string,             // UUID
  habitId: string,        // UUID
  userId: string,         // UUID
  completionDate: string, // YYYY-MM-DD
  createdAt: string       // ISO 8601
}
```

### TodaysHabit (return type for getTodaysHabits)
```js
{
  habit: Habit,           // full habit object
  isCompleted: boolean,   // true if completion exists for today
  streak: number,         // current streak value
  streakUnit: string      // 'days' | 'week_equivalents'
}
```

### HabitStreak (return type for getHabitStreak)
```js
{
  current: number,        // current streak
  longest: number,        // historical peak
  unit: string            // 'days' | 'week_equivalents'
}
```

---

## Error Contract

All functions reject with `DataError` (custom error class) on failure:

```js
class DataError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'DataError';
    this.code = code;        // string error code
    this.details = details;  // additional context
  }
}
```

### Error Codes

| Code | HTTP-like | Description |
|------|-----------|-------------|
| `NOT_FOUND` | 404 | Entity not found |
| `ALREADY_EXISTS` | 409 | Unique constraint violation (username, email, completion) |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Invalid credentials (verifyPassword) |
| `STORAGE_ERROR` | 500 | File/localStorage read/write failure |

---

## Function Specifications

### User Operations

#### `createUser(userData)`
- **Validates**: name, username (format, uniqueness), email (format, uniqueness), password (non-empty)
- **Hashes**: password via PBKDF2 (100k+ iterations, random salt)
- **Creates**: User record with generated UUID, timestamps
- **Persists**: Appends to users store
- **Returns**: Created User (without plain password)
- **Errors**: `ALREADY_EXISTS` (username/email), `VALIDATION_ERROR`

#### `getUserById(userId)`
- **Returns**: User or `null` if not found
- **Errors**: `NOT_FOUND` (optional, can return null)

#### `getUserByEmailOrUsername(identifier)`
- **Finds**: User where `email === identifier` OR `username === identifier`
- **Returns**: User or `null`
- **Used by**: Login flow

#### `updateUser(userId, updates)`
- **Validates**: username uniqueness (excluding current), name length, description length
- **Updates**: Mutable fields only (not id, email, passwordHash, salt, iterations, createdAt)
- **Persists**: Updates user store
- **Returns**: Updated User
- **Errors**: `NOT_FOUND`, `ALREADY_EXISTS` (username), `VALIDATION_ERROR`

#### `verifyPassword(user, password)`
- **Computes**: PBKDF2 hash of provided password with user's salt/iterations
- **Compares**: Timing-safe comparison with stored hash
- **Returns**: `true` if match, `false` otherwise
- **Errors**: `UNAUTHORIZED` (optional, can return false)

---

### Habit Operations

#### `createHabit(habitData)`
- **Validates**: Required fields, category enum, frequencyType enum, frequencyConfig structure per type
- **Initializes**: `currentStreak = 0`, `longestStreak = 0`, `streakUnit` per frequencyType
- **Persists**: Appends to habits store
- **Returns**: Created Habit
- **Errors**: `VALIDATION_ERROR`, `NOT_FOUND` (userId)

#### `getHabitsByUser(userId)`
- **Returns**: `Habit[]` owned by user, sorted by `createdAt` desc

#### `getHabitById(habitId)`
- **Returns**: Habit or `null`

#### `updateHabit(habitId, updates)`
- **Validates**: Same as create for provided fields
- **Handles frequency change**: Recalculates `currentStreak`, `streakUnit` from today forward using `rules/streak.js`; preserves `longestStreak`
- **Persists**: Updates habit store
- **Returns**: Updated Habit
- **Errors**: `NOT_FOUND`, `VALIDATION_ERROR`

#### `deleteHabit(habitId)`
- **Cascades**: Deletes all completions for this habit
- **Persists**: Removes from habits store, filters completions store
- **Returns**: `void`
- **Errors**: `NOT_FOUND`

---

### Completion Operations

#### `createCompletion(completionData)`
- **Validates**: `completionDate` is today (local), habit exists and belongs to user
- **Enforces**: Unique `(habitId, completionDate)` — rejects if exists
- **Persists**: Appends to completions store
- **Triggers**: Streak recalculation for habit (via `rules/streak.js`)
- **Returns**: Created HabitCompletion
- **Errors**: `ALREADY_EXISTS` (already marked today), `VALIDATION_ERROR` (past/future date), `NOT_FOUND` (habit)

#### `getCompletionsByHabit(habitId)`
- **Returns**: `HabitCompletion[]` for habit, sorted by `completionDate` desc

#### `getCompletionsByUserAndDate(userId, date)`
- **Returns**: `HabitCompletion[]` for user on specific date (YYYY-MM-DD)
- **Used by**: Daily progress calculation (FR-024)

#### `deleteCompletion(habitId, date)`
- **Deletes**: Completion matching `habitId` + `completionDate`
- **Triggers**: Streak recalculation for habit
- **Returns**: `void`
- **Errors**: `NOT_FOUND` (completion or habit)

---

### Query Operations

#### `getTodaysHabits(userId)`
- **Gets**: All habits for user
- **Filters**: Only habits due today per frequency rules:
  - `daily`: always
  - `weekdays`: today's day-of-week in `frequencyConfig.weekdays`
  - `times_per_week`: always (until weekly target met; then hidden)
- **Checks**: Completion status for today via `getCompletionsByUserAndDate`
- **Calculates**: Current streak via `getHabitStreak` (or inline)
- **Returns**: `TodaysHabit[]` sorted by category then name
- **Used by**: Habits dashboard (primary view)

#### `getHabitStreak(habitId)`
- **Gets**: All completions for habit
- **Calculates**: Streak per frequencyType using `rules/streak.js`:
  - `daily`: Consecutive days ending today/yesterday
  - `weekdays`: Consecutive selected weekdays
  - `times_per_week`: Completed weeks × targetCount (current week in progress if target not met)
- **Returns**: `HabitStreak` with `current`, `longest`, `unit`
- **Note**: `longest` comes from stored `longestStreak` field (updated on each completion change)

---

## Storage Backend Interface (Internal)

The data layer implementations (`storage.js`, `users.js`, etc.) are internal and NOT part of this contract. Only `src/data/index.js` exports are public.

### Delivery 1 Implementation
- `storage.js`: JSON file I/O (File System Access API + localStorage fallback)
- `users.js`, `habits.js`, `completions.js`: Entity-specific logic, validation, indexing
- `index.js`: Re-exports public API, composes internal modules

### Delivery 2 Migration Target
- Replace `storage.js` with Supabase client
- Replace `users.js` with Supabase Auth + `profiles` table
- Replace `habits.js`/`completions.js` with Supabase queries + RLS
- `index.js` signatures unchanged
- `rules/streak.js` reused unchanged (pure functions)

---

## Testing Contract

Each function must have integration tests in `tests/integration/data.*.test.js` covering:
- Happy path (valid input → expected output)
- Validation errors (invalid input → `VALIDATION_ERROR`)
- Not found errors (missing entity → `NOT_FOUND`)
- Unique constraint errors (duplicate username/email/completion → `ALREADY_EXISTS`)
- Cascade deletes (user→habits, habit→completions)
- Frequency change streak recalculation
- Completion toggle streak updates

Run: `node tests/test-runner.js` (includes integration tests)