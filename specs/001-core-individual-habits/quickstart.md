# Quickstart: Core Individual Habits

**Date**: 2026-10-15
**Feature**: specs/001-core-individual-habits

## Prerequisites

- Node.js 18+
- npm 9+
- Modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

## Setup

```bash
# Clone repo (if not already)
cd habit-tracker

# Install dependencies (Vite only)
npm install

# Start dev server
npm run dev
```

Vite serves at `http://localhost:5173`. Open in browser.

---

## Validation Scenarios

Run each scenario in order. All must pass for the feature to be considered working.

### 1. Dev Server Starts
**Command**: `npm run dev`
**Expected**: Vite dev server starts on port 5173, no errors in terminal.
**Browser**: `http://localhost:5173` loads login page (no console errors).

### 2. Account Creation
**Steps**:
1. On login page, click "Criar conta" (or navigate to register)
2. Fill: Name "João Silva", Username "joao", Email "joao@teste.com", Password "senha123"
3. Submit
**Expected**: 
- Redirected to habits dashboard (`/habits.html`)
- User logged in (header shows "João @joao")
- localStorage has `habitus_auth` with userId

### 3. Duplicate Username Rejection
**Steps**:
1. Logout (header menu → Sair)
2. Try register with same username "joao", different email
**Expected**: Error "Nome de usuário já existe"

### 4. Duplicate Email Rejection
**Steps**:
1. Try register with same email "joao@teste.com", different username
**Expected**: Error "E-mail já cadastrado"

### 5. Login with Email
**Steps**:
1. Logout if needed
2. Login with email "joao@teste.com" + password "senha123"
**Expected**: Redirected to habits dashboard, logged in

### 6. Login with Username
**Steps**:
1. Logout
2. Login with username "joao" + password "senha123"
**Expected**: Redirected to habits dashboard, logged in

### 7. Wrong Password Rejection
**Steps**:
1. Login with email "joao@teste.com" + wrong password
**Expected**: Error "Credenciais inválidas"

### 8. Create Daily Habit
**Steps**:
1. On habits dashboard, click "Novo hábito"
2. Name: "Beber água", Category: "Saúde", Frequency: "Todos os dias"
3. Save
**Expected**: 
- Habit appears in list with streak 0
- Shows as due today
- Progress bar: "0 de 1 concluídos"

### 9. Create Weekday Habit
**Steps**:
1. Create habit: "Corrida", Category: "Esportes e exercícios", Frequency: "Dias da semana", Select: Segunda, Quarta, Sexta
2. Save
**Expected**: 
- Habit appears
- Only shows on Mon/Wed/Fri (check by changing system date or wait)
- Today if today is Mon/Wed/Fri: shows as due

### 10. Create Times-Per-Week Habit
**Steps**:
1. Create habit: "Leitura", Category: "Leitura", Frequency: "Vezes por semana", Target: 3
2. Save
**Expected**: 
- Habit appears every day until 3 completions this week (Sun-Sat)
- Progress bar counts it in denominator until target met

### 11. Mark Habit Complete (Today)
**Steps**:
1. Click checkbox/mark button on "Beber água"
**Expected**: 
- Habit shows completed (visual indicator)
- Streak becomes 1
- Progress bar: "1 de X concluídos"
- Can't mark again today (button disabled)

### 12. Unmark Habit (Same Day)
**Steps**:
1. Click unmark on "Beber água" (same day)
**Expected**: 
- Habit shows incomplete
- Streak becomes 0
- Progress bar decrements

### 13. Past Date Blocked
**Steps**:
1. Try to mark completion for yesterday (via dev tools or date manipulation)
**Expected**: System prevents action (validation error or UI disabled)

### 14. Streak Increments Daily
**Steps**:
1. Mark "Beber água" today
2. Change system date to tomorrow (or wait)
3. Mark again
**Expected**: Streak = 2

### 15. Streak Resets on Miss (Daily)
**Steps**:
1. Have daily habit with streak 5
2. Skip a day (don't mark)
3. Next day, mark
**Expected**: Streak resets to 1 (not 6)

### 16. Weekday Habit Streak
**Steps**:
1. Weekday habit (Mon/Wed/Fri), mark Mon, Wed
2. Streak = 2
3. Skip Fri
**Expected**: Streak resets to 0 after Fri passes

### 17. Times-Per-Week Streak
**Steps**:
1. 3x/week habit, mark 3 times in week (any days)
2. Habit disappears for rest of week
3. Streak increments by 3 (e.g., 0 → 3)
4. Next week, habit reappears
**Expected**: Streak shows 3 (week_equivalents)

### 18. Times-Per-Week Miss Resets
**Steps**:
1. 3x/week habit, mark only 2 times in week
2. Week ends (Saturday midnight)
**Expected**: Streak resets to 0, habit reappears next week

### 19. Daily Progress Display
**Steps**:
1. Have 2 daily + 1 weekday (today) + 1 times/week (not met)
2. View habits dashboard
**Expected**: Progress shows "0 de 3 concluídos" (weekday habit counts, times/week counts until met)

### 20. Times-Per-Week Hidden After Target
**Steps**:
1. 3x/week habit, mark 3 times
2. View dashboard later same week
**Expected**: Habit not in list, not in progress denominator

### 21. Profile View
**Steps**:
1. Click profile in header/menu
**Expected**: Shows name, @username, description, summary card (active habits count, longest streak with unit), habit list with streaks

### 22. Edit Profile Description
**Steps**:
1. Edit description, save
2. Reload page
**Expected**: Description persists

### 23. Edit Profile Name
**Steps**:
1. Edit name, save
**Expected**: Name updates in header and profile

### 24. Edit Username (Unique)
**Steps**:
1. Edit username to "joao2", save
**Expected**: Username updates, shown as @joao2

### 25. Edit Username (Taken)
**Steps**:
1. Create second user "maria"
2. Logout, login as "joao"
3. Try change username to "maria"
**Expected**: Error "Nome de usuário já existe"

### 26. Edit Habit
**Steps**:
1. Edit "Beber água" → change name to "Beber 2L água", category to "Alimentação"
2. Save
**Expected**: Changes persist, visible in list and profile

### 27. Change Habit Frequency
**Steps**:
1. Edit habit, change from "daily" to "weekdays" (Mon/Wed)
2. Save
**Expected**: 
- Frequency rules apply immediately
- Streak recalculates from today with new rules
- Longest streak preserved

### 28. Delete Habit
**Steps**:
1. Delete "Leitura" habit, confirm
**Expected**: 
- Habit removed from list and profile
- Completions deleted
- Cannot recover

### 29. Logout
**Steps**:
1. Header menu → Sair
**Expected**: 
- Redirected to login page
- localStorage `habitus_auth` cleared
- Cannot access habits dashboard directly (redirects to login)

### 30. Session Persists Across Browser Close
**Steps**:
1. Login as "joao"
2. Close browser completely
3. Reopen browser, go to `http://localhost:5173`
**Expected**: 
- Directly on habits dashboard (not login page)
- User still logged in

### 31. Run Automated Tests
**Command**: `node tests/test-runner.js`
**Expected**: All unit and integration tests pass (exit code 0)

---

## Data Verification (Optional)

Check `public/data/` (dev) or localStorage (prod) for JSON files:
- `users.json` — 1+ users with hashed passwords
- `habits.json` — habits with correct frequencyConfig
- `completions.json` — completion records with YYYY-MM-DD dates

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "Module not found" | Vite cache | `rm -rf node_modules/.vite && npm run dev` |
| Login redirects to login | Auth check fails | Check localStorage `habitus_auth`, clear and re-login |
| Streak not updating | Rules not imported | Verify `rules/streak.js` exported and used in data layer |
| Progress wrong | getTodaysHabits filter | Check frequency logic in `rules/frequency.js` |
| Tests fail | Node version | Ensure Node 18+ (`node --version`) |

---

## Definition of Done

All 31 validation scenarios pass + automated tests pass + no console errors in browser during scenarios.