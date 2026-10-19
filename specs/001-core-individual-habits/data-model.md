# Data Model: Core Individual Habits

**Date**: 2026-10-15
**Feature**: specs/001-core-individual-habits

## Entities

### User
Represents a person using the app.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID v4) | PK, required | Unique identifier |
| name | string | required, 1-100 chars | Display name |
| username | string | required, unique, 3-30 chars, alphanumeric + underscore | Unique handle, displayed as @username |
| email | string | required, unique, valid email format | Login identifier |
| passwordHash | string | required | PBKDF2-SHA256 derived key (hex) |
| salt | string | required, 32 hex chars | Per-user salt for PBKDF2 |
| iterations | integer | required, >= 100000 | PBKDF2 iteration count |
| profileDescription | string | optional, max 500 chars | User bio |
| createdAt | string (ISO 8601) | required | Account creation timestamp |

**Indexes**: Unique on `username`, `email`

**Validation Rules** (from FR-001, FR-002, FR-008, FR-009):
- `username`: alphanumeric + underscore, 3-30 chars, unique across users
- `email`: valid email format, unique across users
- `name`: 1-100 chars
- `profileDescription`: max 500 chars
- On update: username uniqueness checked excluding current user

---

### Habit
Represents a recurring behavior to track.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID v4) | PK, required | Unique identifier |
| userId | string (UUID) | FK → User.id, required | Owner |
| name | string | required, 1-100 chars | Habit name |
| category | string | required, enum (11 values) | Fixed category |
| description | string | optional, max 500 chars | Purpose/notes |
| frequencyType | string | required, enum: `daily`, `weekdays`, `times_per_week` | Frequency mode |
| frequencyConfig | object | required, structure per type | Frequency parameters |
| createdAt | string (ISO 8601) | required | Creation timestamp |
| currentStreak | integer | required, >= 0 | Current streak value |
| longestStreak | integer | required, >= 0 | Historical peak streak |
| streakUnit | string | required, enum: `days`, `week_equivalents` | Unit for streak values |

**frequencyConfig Structure**:
- `daily`: `{}` (empty object)
- `weekdays`: `{ weekdays: number[] }` — array of day numbers (0=Sun..6=Sat), 1-6 items
- `times_per_week`: `{ targetCount: number }` — integer 1-7

**Indexes**: By `userId` (for user's habit list)

**Validation Rules** (from FR-010, FR-011, FR-012, FR-013):
- `name`: required, 1-100 chars
- `category`: must be one of 11 fixed values
- `frequencyType`: must be one of 3 values
- `frequencyConfig`: validated per type (weekdays array non-empty, targetCount 1-7)
- On frequency change: streak recalculates from that point forward (historical preserved)

---

### HabitCompletion
Represents a single day's completion of a habit.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID v4) | PK, required | Unique identifier |
| habitId | string (UUID) | FK → Habit.id, required | Completed habit |
| userId | string (UUID) | FK → User.id, required | Owner (denormalized for queries) |
| completionDate | string | required, format YYYY-MM-DD | Local date of completion |
| createdAt | string (ISO 8601) | required | Timestamp of marking |

**Indexes**: 
- Unique composite: `(habitId, completionDate)` — enforces "once per day per habit" (FR-016)
- By `userId` + `completionDate` — for daily progress query (FR-024)

**Validation Rules** (from FR-016, FR-017, FR-018):
- `completionDate`: cannot be future date (local midnight)
- `completionDate`: cannot be past date (strictly today only for creation)
- Uniqueness per habit per date enforced at data layer

---

### Category (Fixed Enum)
Not a stored entity — constant list in code.

**Values** (11):
1. `saude` — Saúde
2. `esportes_exercicios` — Esportes e exercícios
3. `estudos` — Estudos
4. `leitura` — Leitura
5. `alimentacao` — Alimentação
6. `sono` — Sono
7. `bem_estar_mental` — Bem-estar mental
8. `financas` — Finanças
9. `organizacao_produtividade` — Organização e produtividade
10. `hobbies_criatividade` — Hobbies e criatividade
11. `outros` — Outros

**Notes**: Keys are snake_case identifiers; display labels are Portuguese. Users cannot add categories (FR-011, clarification).

---

## Relationships

```
User 1 ───< N Habit
User 1 ───< N HabitCompletion
Habit 1 ───< N HabitCompletion
```

- User → Habits: One-to-many (cascade delete habits on user delete)
- Habit → Completions: One-to-many (cascade delete completions on habit delete)
- User → Completions: One-to-many (denormalized for "today's completions" query)

---

## State Transitions

### Habit Frequency Change
When `frequencyType` or `frequencyConfig` changes:
1. `currentStreak` recalculates from today forward using new rules
2. `longestStreak` preserved (historical peak under old frequency)
3. `streakUnit` updated to match new frequency type
4. Existing `HabitCompletion` records unchanged

### Completion Toggle (Mark/Unmark Today)
- **Mark**: Create `HabitCompletion` for today → recalculate streak
- **Unmark**: Delete `HabitCompletion` for today → recalculate streak
- Both only allowed for `completionDate === today` (local)

### Day Rollover (Midnight)
- No explicit transition — queries filter by `completionDate === today`
- Streak calculation uses completion history + frequency rules
- "Times per week" weekly target resets at Sunday midnight (FR-023)

---

## JSON Storage Schema

Files in `public/data/` (dev) or localStorage (prod fallback):

**users.json**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "username": "joao",
    "email": "joao@email.com",
    "passwordHash": "a1b2c3...",
    "salt": "f0e1d2...",
    "iterations": 100000,
    "profileDescription": "Estudante de programação",
    "createdAt": "2026-10-15T10:30:00.000Z"
  }
]
```

**habits.json**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Beber água",
    "category": "saude",
    "description": "2L por dia",
    "frequencyType": "daily",
    "frequencyConfig": {},
    "createdAt": "2026-10-15T10:30:00.000Z",
    "currentStreak": 5,
    "longestStreak": 12,
    "streakUnit": "days"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Corrida",
    "category": "esportes_exercicios",
    "description": "",
    "frequencyType": "weekdays",
    "frequencyConfig": { "weekdays": [1, 3, 5] },
    "createdAt": "2026-10-15T10:30:00.000Z",
    "currentStreak": 2,
    "longestStreak": 4,
    "streakUnit": "days"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Leitura",
    "category": "leitura",
    "description": "30 min antes de dormir",
    "frequencyType": "times_per_week",
    "frequencyConfig": { "targetCount": 3 },
    "createdAt": "2026-10-15T10:30:00.000Z",
    "currentStreak": 6,
    "longestStreak": 9,
    "streakUnit": "week_equivalents"
  }
]
```

**completions.json**
```json
[
  { "id": "uuid", "habitId": "uuid", "userId": "uuid", "completionDate": "2026-10-15", "createdAt": "2026-10-15T08:00:00.000Z" },
  { "id": "uuid", "habitId": "uuid", "userId": "uuid", "completionDate": "2026-10-14", "createdAt": "2026-10-14T07:30:00.000Z" }
]
```

---

## Derived/Computed Fields (Not Stored)

| Field | Computed From | Used In |
|-------|---------------|---------|
| `isDueToday` | `frequencyType`, `frequencyConfig`, `date` | Habits dashboard filter |
| `progressToday` | `getTodaysHabits()` + completions for today | Progress bar (FR-024) |
| `longestStreakDisplay` | Max of all habits' `longestStreak` + `streakUnit` | Profile summary (FR-007) |

---

## Migration Notes for Delivery 2 (Supabase)

| JSON Field | Supabase Column | Notes |
|------------|-----------------|-------|
| `id` | `uuid` PK | Use `gen_random_uuid()` |
| `passwordHash`, `salt`, `iterations` | — | Removed; Supabase Auth handles auth |
| `userId` FK | `uuid` REFERENCES auth.users | RLS policies enforce ownership |
| `completionDate` | `date` | Use `date` type, not timestamp |
| Unique `(habitId, completionDate)` | Unique index | Same constraint |
| `streakUnit` | `text` CHECK | Keep for display continuity |