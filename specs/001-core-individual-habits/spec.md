# Feature Specification: Core Individual Habits

**Feature Branch**: `001-core-individual-habits`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "HabitUs é uma rede social de controle de hábitos. Esta funcionalidade cobre a base individual: conta, login, perfil e hábitos individuais. A interface é em português e deve se adaptar a qualquer tamanho de tela.

Conta e acesso:
- A pessoa cria a conta informando nome, nome de usuário (único, exibido como @usuário), e-mail (único) e senha.
- Para entrar, a pessoa usa e-mail ou nome de usuário, mais a senha, em um único campo de identificação. Também pode sair do sistema.
- Não existe recuperação de senha.

Perfil:
- O perfil mostra nome, @usuário e uma descrição do perfil.
- Um quadro de resumo mostra a quantidade de hábitos ativos e a maior sequência (o recorde de dias seguidos que a pessoa já alcançou).
- O perfil lista os hábitos da pessoa, cada um com a sequência atual.
- A pessoa pode editar a descrição, o nome e o nome de usuário (que continua único).

Hábitos individuais:
- A pessoa cria um hábito com nome (obrigatório), categoria (obrigatória) e descrição opcional (por exemplo, o propósito do hábito).
- A categoria vem de uma lista fixa: Saúde, Esportes e exercícios, Estudos, Leitura, Alimentação, Sono, Bem-estar mental, Finanças, Organização e produtividade, Hobbies e criatividade, Outros. A pessoa não cria categorias próprias.
- A frequência do hábito pode ser: todos os dias; dias da semana escolhidos; ou uma quantidade de vezes por semana.
- A pessoa pode editar e excluir um hábito. Não existe a opção de descontinuar.

Registro e sequência:
- A pessoa marca o hábito como cumprido apenas no dia de hoje, uma vez por dia por hábito. Dias passados não podem ser marcados. Ela pode desmarcar, no mesmo dia, um hábito marcado por engano. O dia vira à meia-noite, no horário da pessoa.
- Frequência diária: o hábito aparece todos os dias, e a sequência é a quantidade de dias seguidos cumpridos.
- Frequência por dias da semana: o hábito só aparece para marcar nos dias escolhidos. Se o dia passa sem marcação, a sequência é perdida.
- Frequência por quantidade de vezes na semana: o hábito aparece todos os dias da semana. Quando a pessoa atinge a quantidade escolhida, ele só reaparece na semana seguinte. Se a semana termina sem a meta, a sequência é perdida; se a meta é atingida, a sequência é incrementada com a quantidade de dias escolhida (por exemplo, meta de 3 vezes soma 3 por semana cumprida).
- A semana começa no domingo e termina no sábado (padrão EUA/tradicional). O ciclo semanal reinicia à meia-noite de domingo.
- A tela de hábitos mostra o progresso do dia (por exemplo, '2 de 4 concluídos'), considerando só os hábitos que aparecem hoje.
- Hábitos individuais não geram pontos para grupos.

Fora do escopo desta funcionalidade: grupos, atividades, pontos, ranking, convites, feed, postagens, comentários, curtidas, pesquisa de usuários, perfil de outras pessoas, notificações, horário e lembrete dos hábitos. No quadro de resumo do perfil, o número de grupos e as atividades concluídas serão acrescentados quando existir a funcionalidade de grupos."

## User Scenarios & Testing

### User Story 1 - Account Creation (Priority: P1)

A new user creates an account by providing their name, a unique username (displayed as @username), a unique email, and a password. The system validates uniqueness of username and email, and confirms successful account creation.

**Why this priority**: This is the entry point to the entire application. Without account creation, no other functionality is accessible.

**Independent Test**: Can be fully tested by filling the registration form with valid unique data and verifying the account is created and the user is redirected to the main app (or login page).

**Acceptance Scenarios**:

1. **Given** a registration form, **When** the user provides valid name, unique username, unique email, and password, **Then** the account is created and the user can log in.
2. **Given** a registration form, **When** the user provides a username that already exists, **Then** the system shows an error indicating the username is taken.
3. **Given** a registration form, **When** the user provides an email that already exists, **Then** the system shows an error indicating the email is already registered.
4. **Given** a registration form, **When** the user submits with missing required fields, **Then** the system shows validation errors for each missing field.

---

### User Story 2 - Login (Priority: P1)

An existing user enters their credentials using either their email or username in a single identification field, plus their password, and gains access to their account. The user can also log out.

**Why this priority**: Authentication is required for all personalized features (profile, habits). Login must work reliably for users to access their data.

**Independent Test**: Can be fully tested by using valid credentials (email or username + password) and verifying access to the authenticated area. Can also test logout returns to public state.

**Acceptance Scenarios**:

1. **Given** a login form, **When** the user enters their registered email and correct password, **Then** they are logged in and redirected to their habits dashboard.
2. **Given** a login form, **When** the user enters their registered username and correct password, **Then** they are logged in and redirected to their habits dashboard.
3. **Given** a login form, **When** the user enters incorrect password, **Then** the system shows an authentication error.
4. **Given** a logged-in user, **When** they choose to log out, **Then** their session ends and they are redirected to the login page.

---

### User Story 3 - Profile View and Edit (Priority: P1)

A logged-in user views their profile showing name, @username, description, a summary card with active habits count and longest streak, and a list of their habits with current streaks. The user can edit their description, name, and username (maintaining uniqueness).

**Why this priority**: The profile is the central place where users see their progress and identity. Editing allows personalization.

**Independent Test**: Can be fully tested by navigating to profile, verifying all sections display correctly, editing each editable field, and confirming changes persist.

**Acceptance Scenarios**:

1. **Given** a logged-in user on their profile page, **When** the page loads, **Then** it displays name, @username, description, summary card (active habits count, longest streak with unit label), and habit list with current streaks.
2. **Given** a profile page, **When** the user edits their description and saves, **Then** the new description is displayed and persists across sessions.
3. **Given** a profile page, **When** the user edits their name and saves, **Then** the new name is displayed and persists.
4. **Given** a profile page, **When** the user edits their username to a unique value and saves, **Then** the new @username is displayed and persists.
5. **Given** a profile page, **When** the user edits their username to a value already taken, **Then** the system shows an error and the username is not changed.

---

### User Story 4 - Habit Creation (Priority: P1)

A logged-in user creates a new habit by providing a required name, selecting a required category from a fixed list, and optionally adding a description (e.g., the habit's purpose). The habit is created with the selected frequency type.

**Why this priority**: Creating habits is the core value proposition. Without this, users cannot track anything.

**Independent Test**: Can be fully tested by filling the habit creation form with valid data for each frequency type and verifying the habit appears in the list with correct settings.

**Acceptance Scenarios**:

1. **Given** a habit creation form, **When** the user provides a name, selects a category from the fixed list, chooses "daily" frequency, and optionally adds a description, **Then** the habit is created and appears in the habit list.
2. **Given** a habit creation form, **When** the user provides a name, selects a category, chooses "chosen weekdays" frequency and selects specific days (e.g., Mon, Wed, Fri), **Then** the habit is created and only appears for marking on those days.
3. **Given** a habit creation form, **When** the user provides a name, selects a category, chooses "times per week" frequency and sets a target (e.g., 3 times), **Then** the habit is created and appears daily until the weekly target is met.
4. **Given** a habit creation form, **When** the user submits without a name, **Then** the system shows a validation error for the required name field.
5. **Given** a habit creation form, **When** the user submits without selecting a category, **Then** the system shows a validation error for the required category field.

---

### User Story 5 - Habit Editing and Deletion (Priority: P2)

A logged-in user can edit an existing habit's name, category, description, and frequency settings. They can also delete a habit permanently. There is no "discontinue" or archive option.

**Why this priority**: Users need to adjust habits as their goals change, and remove habits they no longer track.

**Independent Test**: Can be fully tested by editing each field of an existing habit and verifying changes persist, and by deleting a habit and verifying it no longer appears.

**Acceptance Scenarios**:

1. **Given** an existing habit, **When** the user edits the habit's name and saves, **Then** the new name is displayed in the habit list and profile.
2. **Given** an existing habit, **When** the user changes the habit's category and saves, **Then** the new category is displayed.
3. **Given** an existing habit, **When** the user changes the frequency type (e.g., from daily to weekdays) and saves, **Then** the new frequency rules apply immediately.
4. **Given** an existing habit, **When** the user deletes the habit and confirms, **Then** the habit is removed from the list and profile, and its tracking data is no longer accessible.

---

### User Story 6 - Daily Habit Tracking and Streaks (Priority: P1)

A logged-in user marks habits as completed for today (once per habit per day). They can unmark a habit on the same day if marked by mistake. Past days cannot be marked. The day rolls over at midnight in the user's local time. Streaks are calculated according to the habit's frequency type.

**Why this priority**: This is the core daily interaction. Streak calculation is the primary motivation mechanic.

**Independent Test**: Can be fully tested by marking habits across different frequency types over multiple days and verifying streak calculations match the specified rules.

**Acceptance Scenarios**:

1. **Given** a daily habit, **When** the user marks it complete today, **Then** it shows as completed, the streak increments by 1, and the habit cannot be marked again today.
2. **Given** a daily habit marked complete today, **When** the user unmarks it today, **Then** it shows as incomplete and the streak decrements by 1.
3. **Given** a daily habit with a 5-day streak, **When** the user misses a day (does not mark it), **Then** the streak resets to 0.
4. **Given** a weekday habit (Mon/Wed/Fri), **When** the user marks it on Monday and Wednesday, **Then** the streak is 2. **When** Friday passes without marking, **Then** the streak resets to 0.
5. **Given** a "3 times per week" habit, **When** the user marks it 3 times during the week (any days), **Then** the habit disappears for the rest of the week, the streak increments by 3, and it reappears next week.
6. **Given** a "3 times per week" habit, **When** the week ends with only 2 completions, **Then** the streak resets to 0 and the habit reappears next week.
7. **Given** any habit, **When** the user attempts to mark a past date, **Then** the system prevents the action.
8. **Given** the user's local midnight passes, **When** the new day begins, **Then** today's habits reset for marking and yesterday's completion status is locked.

---

### User Story 7 - Daily Progress Display (Priority: P2)

The habits screen shows a daily progress indicator (e.g., "2 of 4 completed") counting only habits that are scheduled to appear today based on their frequency.

**Why this priority**: Gives users immediate feedback on their daily progress, reinforcing the habit-building loop.

**Independent Test**: Can be fully tested by setting up habits with different frequencies, advancing to a day where only some appear, and verifying the progress counter matches the visible habits.

**Acceptance Scenarios**:

1. **Given** a user with 4 daily habits, **When** they view the habits screen today, **Then** the progress shows "0 of 4 completed" initially, and updates as they mark habits.
2. **Given** a user with 2 daily habits and 2 weekday habits (Mon/Wed/Fri), **When** they view the screen on Tuesday, **Then** the progress shows "0 of 2 completed" (only daily habits appear).
3. **Given** a user with a "3 times per week" habit that has reached its target, **When** they view the screen later in the same week, **Then** that habit is not counted in the progress denominator.

---

### Edge Cases

- **Week boundary definition**: The week for "times per week" frequency runs Sunday through Saturday. The weekly cycle resets at midnight on Sunday (user's local time). This is a fixed standard, not locale-dependent.
- **Session persistence**: Auth session persists in localStorage until explicit logout. If localStorage is cleared (private browsing, manual clear, storage quota), the user must log in again. No server-side session validation exists in Delivery 1.
- **Longest streak unit display**: Profile's "maior sequência" shows the highest streak value across all habits with its native unit (e.g., "15 dias" or "5 semanas × 3"). If multiple habits tie for highest value, the most recently achieved is shown.
- **Password hashing**: PBKDF2-SHA256 with 100k+ iterations and per-user salt is used in Delivery 1. This is a client-side-only protection; Delivery 2 replaces it with Supabase Auth server-side hashing. No hash migration occurs — users re-authenticate.
- **Timezone/day rollover**: The day changes at midnight in the user's local time. If the user travels across timezones, the rollover follows their device's current local time.
- **Concurrent edits**: If a user edits a habit's frequency while having existing streak data, the streak recalculates based on the new frequency from that point forward (historical data for the old frequency is preserved but not used for current streak).
- **Username change uniqueness**: When editing username, the system must check uniqueness excluding the current user's existing username.
- **Category list immutability**: The fixed category list cannot be extended by users in this delivery. New categories require code changes.
- **No password recovery**: Users who forget credentials cannot recover access. This is an intentional design decision for Delivery 1.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to create an account with name, unique username, unique email, and password.
- **FR-002**: System MUST validate that username and email are unique during account creation.
- **FR-003**: System MUST allow users to log in using either email or username in a single identification field, plus password.
- **FR-004**: System MUST reject login attempts with incorrect credentials.
- **FR-005**: System MUST allow logged-in users to log out, ending their session.
- **FR-005.1**: System MUST persist the authentication session across browser close/reopen, page refresh, and tab switches until the user explicitly logs out. Session state is stored in localStorage.
- **FR-005.2**: System MUST hash passwords using PBKDF2 (SHA-256, minimum 100,000 iterations, per-user salt) via the Web Crypto API before storing in localStorage. Salt and iteration count are stored alongside the hash.
- **FR-006**: System MUST NOT provide password recovery functionality.
- **FR-007**: System MUST display the user's profile with name, @username, description, summary card (active habits count, longest streak with unit label), and habit list with current streaks.
- **FR-008**: System MUST allow users to edit their profile description, name, and username.
- **FR-009**: System MUST validate username uniqueness when editing profile username.
- **FR-010**: System MUST allow users to create habits with required name, required category (from fixed list), and optional description.
- **FR-011**: System MUST enforce category selection from the fixed list: Saúde, Esportes e exercícios, Estudos, Leitura, Alimentação, Sono, Bem-estar mental, Finanças, Organização e produtividade, Hobbies e criatividade, Outros.
- **FR-012**: System MUST support three frequency types: daily, chosen weekdays, times per week.
- **FR-013**: System MUST allow users to edit habit name, category, description, and frequency.
- **FR-014**: System MUST allow users to delete habits permanently.
- **FR-015**: System MUST NOT provide a discontinue/archive option for habits.
- **FR-016**: System MUST allow marking a habit as complete only for today, once per day per habit.
- **FR-017**: System MUST prevent marking habits for past dates.
- **FR-018**: System MUST allow unmarking a habit on the same day it was marked.
- **FR-019**: System MUST roll over to the next day at midnight in the user's local time.
- **FR-020**: For daily frequency: System MUST show the habit every day and calculate streak as consecutive completed days.
- **FR-021**: For chosen weekdays frequency: System MUST show the habit only on selected days; if a selected day passes unmarked, the streak resets to 0.
- **FR-022**: For times per week frequency: System MUST show the habit every day until the weekly target is met; when met, the habit hides for the rest of the week; if the week ends without meeting the target, the streak resets to 0; if the target is met, the streak increments by the target amount.
- **FR-023**: For times per week frequency: System MUST define the week as starting on Sunday and ending on Saturday. The weekly target resets at midnight Sunday (user's local time).
- **FR-024**: System MUST display daily progress as "X of Y completed" counting only habits scheduled for today.
- **FR-025**: Individual habits MUST NOT generate points for groups (groups are out of scope).
- **FR-026**: The interface MUST be in Portuguese.
- **FR-027**: The interface MUST adapt to any screen size (responsive design).

### Key Entities

- **User**: Represents a person using the app. Attributes: id, name, username (unique, displayed as @username), email (unique), password hash (PBKDF2-SHA256, 100k+ iterations, per-user salt), profile description, created date.
- **Habit**: Represents a recurring behavior to track. Attributes: id, user_id, name, category (from fixed list), description, frequency_type (daily | weekdays | times_per_week), frequency_config (selected weekdays array OR target_count per week), created_date, current_streak, longest_streak, streak_unit (days | week_equivalents). Streak is tracked in native units: consecutive calendar days for daily/weekdays; completed weeks × target_count for times_per_week.
- **HabitCompletion**: Represents a single day's completion of a habit. Attributes: id, habit_id, user_id, completion_date (date only, no time), created_at. Enforces uniqueness per habit per date.
- **Category**: Fixed reference list. Values: Saúde, Esportes e exercícios, Estudos, Leitura, Alimentação, Sono, Bem-estar mental, Finanças, Organização e produtividade, Hobbies e criatividade, Outros.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A new user can complete account creation and log in within 2 minutes.
- **SC-002**: A user can create a habit with all frequency types in under 30 seconds.
- **SC-003**: Daily habit marking (mark/unmark) responds in under 500ms perceived latency.
- **SC-004**: Streak calculations are accurate across all three frequency types for a 30-day test period.
- **SC-005**: The habits screen displays correct daily progress count for mixed frequency types on any given day.
- **SC-006**: Profile edits (name, username, description) persist across logout/login cycles.
- **SC-007**: The interface is fully usable on viewport widths from 320px to 1920px without horizontal scrolling.
- **SC-008**: Zero data loss: habit completions and streaks persist correctly across browser sessions and page reloads.
- **SC-009**: 90% of users can complete the primary flow (create account → create habit → mark habit → view streak) without external help on first attempt.

## Clarifications

### Session 2026-10-15

- Q: How should the user's authentication session behave across browser sessions, page refreshes, and tab switches? → A: Persistent session until explicit logout. User stays logged in across browser close/reopen, refresh, and tab switches until they click "Logout". Auth state stored in localStorage.
- Q: How should the "longest streak" (maior sequência) be computed across different frequency types for the profile summary? → A: Each habit tracks its own streak in native units (consecutive days for daily/weekdays; completed weeks × target for times/week). Profile shows the highest value among all habits with its unit label (e.g., "12 dias" or "4 semanas × 3").
- Q: What password hashing algorithm should be used in Delivery 1 (client-only, no backend)? → A: PBKDF2 via Web Crypto API (SHA-256, 100k+ iterations, per-user salt stored with hash). Browser-native, no dependencies. Delivery 2 replaces this with Supabase Auth; no hash migration needed.

## Assumptions

- Users have stable internet connectivity for this web application.
- Users' devices have correct local time and timezone settings for day rollover.
- The fixed category list covers all common habit domains; new categories are not needed for Delivery 1.
- "Times per week" frequency uses a fixed week definition (Sunday–Saturday) that does not vary by user locale.
- No password recovery is an acceptable UX trade-off for Delivery 1 simplicity.
- Data persistence in Delivery 1 uses local JSON files via the data isolation layer (per constitution).
- The application is a single-page application (SPA) built with vanilla JavaScript and Vite (Delivery 1 stack).
- No backend exists in Delivery 1; all data operations go through the isolated data layer.
- React and Supabase will be introduced in Delivery 2; the data layer contract must remain stable.
- Screen size adaptation uses CSS media queries and flexible layouts (no separate mobile/desktop codebases).