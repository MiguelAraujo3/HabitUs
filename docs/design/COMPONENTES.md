# COMPONENTES — Referência de className (cópia literal)

Origem: `referencia-design/src/app/ui.tsx` e `referencia-design/src/app/Layout.tsx` (somente leitura).
As strings `className` abaixo são copiadas **literalmente**, sem reescrever nem "melhorar".
Quando um item não existe como componente compartilhado dedicado, consta `NÃO ENCONTRADO`.

---

## 1. Botões — `btn(v, extra)`  (ui.tsx:59-70)

**Assinatura:** `export const btn = (v: Variant = 'primary', extra = '') => cx(...)`
**Variante:** `Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid' | 'black'`

**className base (sempre aplicada):**
```
press inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[12px] px-5 text-[16px] font-semibold disabled:cursor-not-allowed disabled:opacity-45
```

**className por variante:**
- `primary`: `bg-action text-white hover:bg-action-press`
- `black`: `bg-black text-white hover:bg-[#222]`
- `secondary`: `bg-surface-2 text-ink hover:bg-[#e6e6e3]`
- `ghost`: `text-action hover:bg-action-tint`
- `danger`: `bg-danger-tint text-danger hover:bg-[#f9dad6]`
- `dangerSolid`: `bg-danger text-white hover:bg-[#8f1c12]`

**HTML (exemplo de uso, ErrorState ui.tsx:226):**
```jsx
<button onClick={onRetry} className={btn('secondary', 'mt-5')}>
  <RefreshCw size={18} aria-hidden />Tentar de novo
</button>
```

**Tamanhos:** não existem variantes de tamanho separadas; a altura mínima é fixa em `min-h-[50px]`.

---

## 2. Campo/Input — `inputCls`  (ui.tsx:72-73)

**className literal:**
```
w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30
```

**HTML de uso (Field, ui.tsx:75-92):** o `children` passado a `<Field>` é renderizado direto (esperado ser um `<input>` com `className={inputCls}`).

---

## 3. Rótulo e mensagem de erro — `Field`  (ui.tsx:75-92)

**Estrutura HTML (tags aninhadas):**
```jsx
<div className="space-y-1.5">
  <div className="flex items-baseline justify-between">
    <label htmlFor={id} className="text-[15px] font-medium">{label}</label>
    {count && <span className="tnum text-xs text-ink-2">{count}</span>}
  </div>
  {children}
  {hint && !error && <p className="text-[13px] leading-[18px] text-ink-2">{hint}</p>}
  {error && (
    <p id={`${id}-erro`} className="flex items-start gap-1.5 text-[13px] leading-[18px] font-medium text-danger">
      <AlertCircle size={15} className="mt-px shrink-0" aria-hidden />
      {error}
    </p>
  )}
</div>
```

**className literais:**
- Wrapper: `space-y-1.5`
- Linha do rótulo: `flex items-baseline justify-between`
- Rótulo (`<label>`): `text-[15px] font-medium`
- Contador: `tnum text-xs text-ink-2`
- Hint: `text-[13px] leading-[18px] text-ink-2`
- Erro (`<p>`): `flex items-start gap-1.5 text-[13px] leading-[18px] font-medium text-danger`
- Ícone de erro (`<AlertCircle>`): `mt-px shrink-0` (com `size={15}`)

---

## 4. Chip de categoria — `CategoryChip`  (ui.tsx:33-42)

**className literal do `<span>` raiz:**
```
inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-4
```
(Juntado via `cx` com `FAMILY[c.family]` e o `className` opcional.)

**Estrutura HTML:**
```jsx
<span className={cx('inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-4', FAMILY[c.family], className)}>
  <Icon size={13} aria-hidden className="shrink-0" />
  <span>{c.label}</span>
</span>
```

**className do ícone:** `shrink-0` (com `size={13}`)

**FAMILY (cores de fundo/texto do chip):**
- `coral`: `bg-[#fde8e8] text-coral-ink`
- `lime`: `bg-[#eef9cf] text-[#3f5a00]`
- `blue`: `bg-[#e3ecff] text-[#1e40af]`
- `violet`: `bg-[#f1e6fa] text-violet-ink`
- `cyan`: `bg-[#ddf4f8] text-[#0e5a68]`
- `gray`: `bg-[#ecece9] text-[#4a4a47]`

---

## 5. Selo de status — `StatusBadge`  (ui.tsx:44-57)

**className literal do `<span>` raiz:**
```
inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
```
(Juntado via `cx` com `cls` do mapa abaixo.)

**className por status (`cls`):**
- `andamento`: `bg-[#e3f4ea] text-ok`  — ícone: `<span key="d" className="size-1.5 rounded-full bg-ok" />`
- `nao-iniciado`: `bg-[#fbf0c9] text-warn-ink` — ícone: `<Clock key="c" size={12} />`
- `encerrado`: `bg-surface-2 text-closed` — ícone: `<Lock key="l" size={12} />`

**Estrutura HTML:**
```jsx
<span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cls)}>
  {icon}
  {STATUS_LABEL[status]}
</span>
```

---

## 6. Avatar — `Avatar`  (ui.tsx:18-31)

**className literal do `<span>` raiz:**
```
inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none
```
(Juntado via `cx` com `FAMILY[fam]`.)

**Estrutura HTML:**
```jsx
<span
  aria-hidden
  className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none', FAMILY[fam])}
  style={{ width: size, height: size, fontSize: size * 0.38 }}
>
  {ini}
</span>
```

**FAMILY (mesma do CategoryChip):**
- `coral`: `bg-[#fde8e8] text-coral-ink`
- `lime`: `bg-[#eef9cf] text-[#3f5a00]`
- `blue`: `bg-[#e3ecff] text-[#1e40af]`
- `violet`: `bg-[#f1e6fa] text-violet-ink`
- `cyan`: `bg-[#ddf4f8] text-[#0e5a68]`
- `gray`: `bg-[#ecece9] text-[#4a4a47]`

---

## 7. Stepper de pontos — `Stepper`  (ui.tsx:104-113)

**className literal dos botões (`b`):**
```
press flex size-11 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-[#e6e6e3] disabled:opacity-35
```

**Estrutura HTML:**
```jsx
<div role="group" aria-label={label} className="inline-flex items-center gap-1">
  <button type="button" className={b} aria-label={`Diminuir ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
    <Minus size={18} />
  </button>
  <output className="tnum min-w-14 text-center text-[17px] font-semibold" aria-live="polite">{value}{suffix}</output>
  <button type="button" className={b} aria-label={`Aumentar ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
    <Plus size={18} />
  </button>
</div>
```

**className do `<output>`:** `tnum min-w-14 text-center text-[17px] font-semibold`

---

## 8. Abas — `Segmented`  (ui.tsx:146-162)

**className do tablist (`<div role="tablist">`):**
```
flex gap-1 rounded-[12px] bg-surface-2 p-1
```
(Juntado via `cx` com `scroll && 'no-scrollbar overflow-x-auto'`.)

**className de cada tab (`<button role="tab">`):**
```
press min-h-10 flex-1 rounded-[9px] px-3 text-[15px] font-medium whitespace-nowrap
```
(Juntado via `cx` com `value === o.id ? 'bg-surface text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]' : 'text-ink-2 hover:text-ink'`.)

**Estrutura HTML:**
```jsx
<div role="tablist" aria-label={label} className={cx('flex gap-1 rounded-[12px] bg-surface-2 p-1', scroll && 'no-scrollbar overflow-x-auto')}>
  {options.map((o) => (
    <button
      key={o.id}
      role="tab"
      aria-selected={value === o.id}
      onClick={() => onChange(o.id)}
      className={cx('press min-h-10 flex-1 rounded-[9px] px-3 text-[15px] font-medium whitespace-nowrap', value === o.id ? 'bg-surface text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]' : 'text-ink-2 hover:text-ink')}
    >
      {o.label}
    </button>
  ))}
</div>
```

---

## 9. Janela — `Sheet` (fundo, painel, animação)  (ui.tsx:164-200)

**Estrutura HTML:**
```jsx
<div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
  {/* Fundo (backdrop) */}
  <div className="anim-fade absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
  {/* Painel */}
  <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="anim-sheet relative w-full max-w-[460px] rounded-t-[22px] bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl md:rounded-[22px] md:p-6">
    <div aria-hidden className="mx-auto mb-4 h-1 w-9 rounded-full bg-line md:hidden" />
    <h2 className="text-[22px] leading-7 font-bold">{title}</h2>
    {children}
  </div>
</div>
```

**className literais:**
- Container: `fixed inset-0 z-50 flex items-end justify-center md:items-center`
- Fundo (backdrop): `anim-fade absolute inset-0 bg-black/40`
- Painel: `anim-sheet relative w-full max-w-[460px] rounded-t-[22px] bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl md:rounded-[22px] md:p-6`
- Alça/handle: `mx-auto mb-4 h-1 w-9 rounded-full bg-line md:hidden`
- Título (`<h2>`): `text-[22px] leading-7 font-bold`

**SheetBody** (ui.tsx:202-204): `<div className="mt-2 space-y-3 text-[16px] leading-[22px] text-ink-2">`

**SheetActions** (ui.tsx:205-207): `<div className="mt-6 flex flex-col gap-2">`

**Animações:** `anim-fade` e `anim-sheet` são classes CSS definidas em `src/index.css` (linhas 109 e 112); não são montadas via `className` dinâmica no componente, apenas referenciadas literalmente acima.

---

## 10. Estado vazio — `Empty`  (ui.tsx:209-218)

**className literal do wrapper:**
```
flex flex-col items-center rounded-[18px] border border-dashed border-line bg-surface px-6 py-12 text-center
```

**Estrutura HTML:**
```jsx
<div className="flex flex-col items-center rounded-[18px] border border-dashed border-line bg-surface px-6 py-12 text-center">
  <span className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-ink-2"><Icon size={26} aria-hidden /></span>
  <h2 className="mt-4 text-[20px] leading-[26px] font-bold">{title}</h2>
  <p className="mt-1 max-w-[34ch] text-[16px] leading-[22px] text-ink-2">{text}</p>
  {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
</div>
```

**className adicionais:**
- Ícone: `flex size-14 items-center justify-center rounded-full bg-surface-2 text-ink-2` (com `size={26}`)
- Título: `mt-4 text-[20px] leading-[26px] font-bold`
- Texto: `mt-1 max-w-[34ch] text-[16px] leading-[22px] text-ink-2`
- Ação: `mt-5 flex flex-wrap justify-center gap-2`

---

## 11. Cabeçalho de página — `PageHeader`  (ui.tsx:249-264)

**className literal do `<header>`:**
```
sticky top-0 z-20 -mx-4 flex min-h-14 items-center gap-1 border-b border-line/70 bg-bg/92 px-2 backdrop-blur-lg md:mx-0 md:rounded-b-[14px] md:px-2
```

**Estrutura HTML:**
```jsx
<header className="sticky top-0 z-20 -mx-4 flex min-h-14 items-center gap-1 border-b border-line/70 bg-bg/92 px-2 backdrop-blur-lg md:mx-0 md:rounded-b-[14px] md:px-2">
  <button
    onClick={() => (window.history.length > 1 ? nav(-1) : nav(back ?? '/hoje'))}
    className="press flex min-h-11 items-center gap-1 rounded-full px-3 text-[16px] font-medium text-action hover:bg-action-tint"
    aria-label="Voltar"
  >
    <ArrowLeft size={20} aria-hidden /><span className="hidden sm:inline">Voltar</span>
  </button>
  <h1 className="flex-1 truncate text-center text-[17px] leading-[22px] font-semibold">{title}</h1>
  <div className="flex min-w-11 justify-end">{right}</div>
</header>
```

**className adicionais:**
- Botão Voltar: `press flex min-h-11 items-center gap-1 rounded-full px-3 text-[16px] font-medium text-action hover:bg-action-tint`
- Texto "Voltar" (somente mobile): `hidden sm:inline`
- Título (`<h1>`): `flex-1 truncate text-center text-[17px] leading-[22px] font-semibold`
- Área direita: `flex min-w-11 justify-end`

---

## 12. Aviso — `Notice`  (ui.tsx:291-299)

**className literal da base:**
```
flex items-start gap-2.5 rounded-[12px] px-3.5 py-3 text-[14px] leading-5 font-medium
```
(Juntado via `cx` com `t` do mapa de tone.)

**className por tone (`t`):**
- `info`: `bg-action-tint text-[#1e3a8a]`
- `warn`: `bg-[#fbf0c9] text-warn-ink`
- `danger`: `bg-danger-tint text-danger`

**Estrutura HTML:**
```jsx
<div className={cx('flex items-start gap-2.5 rounded-[12px] px-3.5 py-3 text-[14px] leading-5 font-medium', t)}>
  {Icon && <Icon size={18} className="mt-px shrink-0" aria-hidden />}
  <div>{children}</div>
</div>
```

**className do ícone:** `mt-px shrink-0` (com `size={18}`)

---

## 13. Cartão — `Card`  (ui.tsx:278-280)

**className literal:**
```
rounded-[14px] bg-surface p-4
```
(Juntado via `cx` com o `className` opcional.)

**Estrutura HTML:**
```jsx
<div className={cx('rounded-[14px] bg-surface p-4', className)}>{children}</div>
```

> **Cartão de item de lista dedicado:** `NÃO ENCONTRADO`. Não existe um componente compartilhado chamado "cartão de item de lista" em `ui.tsx` nem em `Layout.tsx`. O genérico é `Card` acima. Itens de lista são renderizados inline (ex.: `<li>` em `Layout.tsx` `TodayColumn`, veja item 14).

---

## 14. Layout — `Shell` e `Root`  (Layout.tsx:8-141)

### Root (banner offline + toast)
```jsx
<>
  {!online && (
    <div role="status" className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-black px-4 py-2 text-[14px] font-medium text-white">
      <WifiOff size={16} aria-hidden />Você está sem conexão.
    </div>
  )}
  <Outlet />
  <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
    {toast && <div className="anim-fade rounded-full bg-black px-5 py-3 text-[15px] font-medium text-white shadow-lg">{toast}</div>}
  </div>
</>
```

**className literais:**
- Banner offline: `sticky top-0 z-40 flex items-center justify-center gap-2 bg-black px-4 py-2 text-[14px] font-medium text-white`
- Container do toast: `pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8`
- Toast: `anim-fade rounded-full bg-black px-5 py-3 text-[15px] font-medium text-white shadow-lg`

### Shell (aside, navegação, conteúdo, navegação inferior)
**Wrapper:** `<div className="min-h-dvh">`

**Aside (desktop):**
```jsx
<aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col border-r border-line/70 bg-surface md:flex lg:w-60">
```

**Link logo:**
```jsx
<Link to="/hoje" className="flex h-[72px] items-center justify-center px-5 lg:justify-start" aria-label="HabitUs">
  <span className="lg:hidden"><span className="flex size-9 items-center justify-center rounded-full bg-black"><span className="size-3.5 rounded-full bg-lime" /></span></span>
  <span className="hidden lg:block"><Logo size={24} /></span>
</Link>
```

**Nav principal (desktop):**
```jsx
<nav aria-label="Principal" className="flex flex-1 flex-col gap-1 px-2.5 lg:px-3">
  {/* NavLink className: */}
  cx('press flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[12px] text-[11px] font-medium lg:flex-row lg:justify-start lg:gap-3 lg:px-3.5 lg:text-[16px]', isActive ? 'bg-black text-white' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')
  {/* ícone: */}
  <Icon size={22} aria-hidden />
</nav>
```

**Link perfil (desktop):**
```jsx
<Link to="/perfil" className="m-3 hidden items-center gap-3 rounded-[12px] p-2 hover:bg-surface-2 lg:flex">
  <Avatar name={me.name} size={36} />
  <span className="min-w-0 text-[14px] leading-[18px]"><b className="block truncate font-semibold">{me.name}</b><span className="text-ink-2">@{me.username}</span></span>
</Link>
```

**Área de conteúdo:**
```jsx
<div className="md:pl-[72px] lg:pl-60">
  <div className="mx-auto flex max-w-[1060px] justify-center gap-8 px-4 md:px-6 lg:px-8">
    <main className="min-w-0 max-w-[680px] flex-1 pb-28 md:pb-16"><Outlet /></main>
    <div className="hidden w-[300px] shrink-0 xl:block">
      <div className="sticky top-8 pt-8"><TodayColumn /></div>
    </div>
  </div>
</div>
```

**Navegação inferior (mobile):**
```jsx
<nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
  <ul className="mx-auto flex max-w-[480px]">
    <li key={to} className="flex-1">
      <NavLink to={to} className={({ isActive }) => cx('flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium', isActive ? 'text-black' : 'text-ink-2')}>
        <span className={cx('flex h-7 w-12 items-center justify-center rounded-full', isActive && 'bg-lime')}>
          <Icon size={22} aria-hidden />
        </span>
        {label}
      </NavLink>
    </li>
  </ul>
</nav>
```

### Cartão de item de lista — `TodayColumn` (Layout.tsx:47-81)
Não há componente dedicado; o item de lista é um `<li>` inline:

```jsx
<ul className="mt-2 divide-y divide-line/70">
  <li key={h.id} className="flex items-center gap-3 py-2.5">
    <button
      onClick={() => toggleHabit(h.id)}
      aria-pressed={h.markedToday}
      className={cx('press flex size-8 shrink-0 items-center justify-center rounded-full border-2 disabled:opacity-40', h.markedToday ? 'border-lime bg-lime text-black' : 'border-action text-transparent hover:bg-action-tint')}
    >
      <Check size={16} strokeWidth={3} aria-hidden />
    </button>
    <span className={cx('min-w-0 flex-1 text-[15px] leading-5', h.markedToday && 'text-ink-2')}>{h.name}</span>
    <span className="tnum flex items-center gap-1 text-[13px] font-semibold text-coral-ink"><Flame size={14} aria-hidden />{h.streak}</span>
  </li>
</ul>
```

**className literais do item de lista:**
- `<li>`: `flex items-center gap-3 py-2.5`
- Botão de conclusão (base): `press flex size-8 shrink-0 items-center justify-center rounded-full border-2 disabled:opacity-40`
  - marcado: `border-lime bg-lime text-black`
  - não marcado: `border-action text-transparent hover:bg-action-tint`
- Nome: `min-w-0 flex-1 text-[15px] leading-5` (+ `text-ink-2` quando marcado)
- Streak: `tnum flex items-center gap-1 text-[13px] font-semibold text-coral-ink`
- Link "Abrir Hoje": `mt-2 block rounded-[10px] py-2 text-center text-[14px] font-semibold text-action hover:bg-action-tint`

---

## Itens solicitados não encontrados como componente dedicado

| Item solicitado | Situação |
|---|---|
| Cartão de item de lista | `NÃO ENCONTRADO` como componente compartilhado. Usa-se `Card` (ui.tsx:278) e itens `<li>` inline (ex.: `Layout.tsx` `TodayColumn`). |
| Tamanhos de botão | `NÃO ENCONTRADO` — apenas `min-h-[50px]` fixo. |

---

## A) Classes personalizadas — `referencia-design/src/index.css`

Origem: `referencia-design/src/index.css` (linhas 1-129). Cópia literal das regras e seletores.

### html / body / seleção / foco (index.css:37-68)

**html:**
```css
html {
  -webkit-text-size-adjust: 100%;
  scrollbar-width: none;
}
html::-webkit-scrollbar {
  display: none;
}
```

**body:**
```css
body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 24px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

**::selection:**
```css
::selection {
  background: var(--color-lime);
  color: var(--color-black);
}
```

**button, a, input, textarea, select, summary:**
```css
button,
a,
input,
textarea,
select,
summary {
  -webkit-tap-highlight-color: transparent;
}
```

**:focus-visible:**
```css
:focus-visible {
  outline: 2px solid var(--color-action);
  outline-offset: 2px;
}
```

### Utilitárias customizadas (index.css:69-118)

**.tnum** (index.css:69-71):
```css
.tnum {
  font-variant-numeric: tabular-nums;
}
```

**.no-scrollbar** (index.css:72-77):
```css
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

**.press** (index.css:78-87):
```css
.press {
  transition:
    transform 120ms ease,
    background-color 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease;
}
.press:active:not(:disabled) {
  transform: scale(0.98);
}
```

### Keyframes (index.css:88-103)

**@keyframes sheet-up:**
```css
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

**@keyframes fade-in:**
```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**@keyframes pulse-soft:**
```css
@keyframes pulse-soft {
  50% {
    opacity: 0.5;
  }
}
```

**.anim-sheet** (index.css:109-111):
```css
.anim-sheet {
  animation: sheet-up 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

**.anim-fade** (index.css:112-114):
```css
.anim-fade {
  animation: fade-in 200ms ease;
}
```

**.skeleton** (index.css:115-118):
```css
.skeleton {
  background: var(--color-surface-2);
  animation: pulse-soft 1.4s ease-in-out infinite;
}
```

### Redução de movimento (index.css:119-129)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .press:active:not(:disabled) {
    transform: none;
  }
}
```

---

## B) Componentes de Grupos.tsx, GrupoAdmin.tsx e lib.tsx

### BigTitle (já documentado na seção 9 — `ui.tsx:266-276`)
Não repetido conforme regra de não alterar seções existentes.

### SectionTitle (já documentado na seção 9 — `ui.tsx:282-289`)
Não repetido conforme regra de não alterar seções existentes.

### Fieldset / legend — `GrupoCriar` (Grupos.tsx:104, 110-125) e `PostarConclusao` (Grupos.tsx:312-328)

**Estrutura HTML (Categoria, Grupos.tsx:104):**
```html
<fieldset>
  <legend className="mb-2 text-[15px] font-medium">Categoria</legend>
  <CategoryGrid value={cat} onChange={setCat} error={errs.cat} />
</fieldset>
```

**Estrutura HTML (Atividades e pontos, Grupos.tsx:110-125):**
```html
<fieldset>
  <legend className="mb-2 text-[15px] font-medium">Atividades e pontos</legend>
  <ul className="space-y-2">
    {acts.map((a, i) => (
      <li key={a.id} className="rounded-[14px] bg-surface p-3">
        <div className="flex items-center gap-2">
          <input aria-label={`Nome da atividade ${i + 1}`} value={a.name} onChange={(e) => upd(i, { name: e.target.value })} className={inputCls} placeholder="Ex.: Treino de 30 min" />
          {acts.length > 1 && <button type="button" onClick={() => setActs(acts.filter((_, k) => k !== i))} aria-label={`Remover atividade ${i + 1}`} className="press flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"><Trash2 size={18} /></button>}
        </div>
        <div className="mt-2 flex items-center justify-between"><span className="text-[14px] text-ink-2">Pontos por conclusão</span><Stepper label="pontos" value={a.points} min={1} max={10} onChange={(n) => upd(i, { points: n })} /></div>
      </li>
    ))}
  </ul>
  {errs.acts && <p className="mt-1.5 text-[13px] font-medium text-danger">{errs.acts}</p>}
  <button type="button" onClick={() => setActs([...acts, { id: `n${acts.length + 1}${Date.now()}`, name: '', points: 3 }])} className={btn('ghost', 'mt-2 min-h-11 w-full')}>
    <Plus size={18} aria-hidden />Adicionar atividade
  </button>
</fieldset>
```

**Estrutura HTML (Atividade, PostarConclusao, Grupos.tsx:312-328):**
```html
<fieldset>
  <legend className="mb-2 text-[15px] font-medium">Atividade</legend>
  <div role="radiogroup" className="space-y-2">
    {g.activities.map((a) => {
      const off = done(a)
      const on = aid === a.id
      return (
        <button key={a.id} type="button" role="radio" aria-checked={on} aria-disabled={off} disabled={off} onClick={() => setAid(a.id)} className={cx('press flex min-h-14 w-full items-center gap-3 rounded-[12px] border px-4 py-2 text-left disabled:opacity-60', on ? 'border-action bg-action-tint ring-1 ring-action' : 'border-line bg-surface')}>
          <span className={cx('flex size-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-action' : 'border-line')}>{on && <span className="size-2.5 rounded-full bg-action" />}</span>
          <span className="min-w-0 flex-1"><b className="block text-[16px] font-medium">{a.name}</b>{off && <span className="text-[13px] text-ink-2">Já feita hoje, volte amanhã</span>}</span>
          <span className="tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold">+{a.points}</span>
        </button>
      )
    })}
  </div>
  {errs.aid && <p className="mt-1.5 text-[13px] font-medium text-danger">{errs.aid}</p>}
</fieldset>
```

**className literais do legend:** `mb-2 text-[15px] font-medium`

### Summary de erros — `ErrorSummary` (já documentado na seção 4 — `ui.tsx:94-102`)
Não repetido conforme regra de não alterar seções existentes.

### CategoryGrid (já documentado na seção anterior — `ui.tsx:115-144`)
Não repetido conforme regra de não alterar seções existentes.

### Cartão de grupo na lista — `GruposLista` (Grupos.tsx:38-47)

**Estrutura HTML:**
```html
<li key={g.id}>
  <Link to={`/grupos/${g.id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
    <div className="min-w-0 flex-1 space-y-1.5">
      <p className="truncate text-[17px] leading-[22px] font-semibold">{g.name}</p>
      <div className="flex flex-wrap items-center gap-2"><CategoryChip cat={g.cat} /><StatusBadge status={s.key} /></div>
      <p className="text-[13px] text-ink-2">{nameJoin(g.members.length)} · {s.key === 'nao-iniciado' ? `Começa em ${fmtDate(g.start)}` : s.key === 'encerrado' ? `Encerrado em ${fmtDate(g.end)}` : `Até ${fmtDate(g.end)}`}</p>
    </div>
    {pos && s.key !== 'nao-iniciado' && <div className="text-center"><p className="tnum text-[26px] leading-7 font-bold">{pos}º</p><p className="text-[11px] font-medium text-ink-2">{s.key === 'encerrado' ? 'final' : 'posição'}</p></div>}
    <ChevronRight size={18} className="shrink-0 text-ink-2" aria-hidden />
  </Link>
</li>
```

**className literais:**
- `<li>`: (sem classe própria)
- `<Link>`: `flex items-center gap-3 p-4 hover:bg-surface-2`
- Conteúdo: `min-w-0 flex-1 space-y-1.5`
- Nome (`<p>`): `truncate text-[17px] leading-[22px] font-semibold`
- Chips: `flex flex-wrap items-center gap-2`
- Meta (`<p>`): `text-[13px] text-ink-2`
- Posição: `text-center` — interno: `tnum text-[26px] leading-7 font-bold` (posição) e `text-[11px] font-medium text-ink-2` (rótulo)
- Chevron: `shrink-0 text-ink-2` (com `size={18}`)

### Linha de ranking — `GrupoPagina` tab ranking (Grupos.tsx:205-212)

**Estrutura HTML:**
```html
<li key={r.user.id} className={cx('relative flex items-center gap-3 px-4 py-3', you && 'bg-action-tint')}>
  {you && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-action" />}
  <span className={cx('tnum w-9 text-center', r.pos <= 3 ? 'text-[20px] font-bold' : 'text-[16px] font-medium text-ink-2')}><span className="sr-only">Posição </span>{r.pos}º</span>
  <Avatar name={r.user.name} size={38} />
  <Link to={you ? '/perfil' : `/u/${r.user.username}`} className="min-w-0 flex-1 truncate text-[16px] font-semibold hover:underline">{r.user.name}{you && <span className="ml-2 rounded-full bg-action px-2 py-0.5 align-middle text-[11px] font-semibold text-white">Você</span>}</Link>
  <span className="tnum text-[17px] font-bold">{r.points}<span className="ml-1 text-[12px] font-medium text-ink-2">pts</span></span>
</li>
```

**className literais:**
- `<li>` base: `relative flex items-center gap-3 px-4 py-3`
- Você (ativo): `bg-action-tint`
- Marca lateral "você": `absolute inset-y-0 left-0 w-1 bg-action`
- Posição (`<span>`): `tnum w-9 text-center` — top 3: `text-[20px] font-bold` — outros: `text-[16px] font-medium text-ink-2`
- Sr-only: `sr-only`
- Avatar: (usado via componente `Avatar`, size={38})
- Nome (`<Link>`): `min-w-0 flex-1 truncate text-[16px] font-semibold hover:underline`
- Selo "Você": `ml-2 rounded-full bg-action px-2 py-0.5 align-middle text-[11px] font-semibold text-white`
- Pontos: `tnum text-[17px] font-bold` — sufixo pts: `ml-1 text-[12px] font-medium text-ink-2`

### Caixa do link de convite — `GrupoPagina` (Grupos.tsx:174-178)

**Estrutura HTML:**
```html
<div className="mt-4 flex items-center gap-2 rounded-[12px] bg-surface p-2 pl-3.5">
  <span className="min-w-0 flex-1 truncate text-[14px] text-ink-2">{link.replace(/^https?:\/\//, '')}</span>
  <button onClick={copy} className={btn('secondary', 'min-h-10 px-3.5 text-[14px]')}><Copy size={15} aria-hidden />Copiar</button>
</div>
```

**className literais:**
- Caixa: `mt-4 flex items-center gap-2 rounded-[12px] bg-surface p-2 pl-3.5`
- Link (span): `min-w-0 flex-1 truncate text-[14px] text-ink-2`
- Botão Copiar: `btn('secondary', 'min-h-10 px-3.5 text-[14px]')` → base do btn secondary + `min-h-10 px-3.5 text-[14px]`

### Linha de membro — `GrupoPagina` tab membros (Grupos.tsx:237-243) e `GrupoGerenciar` (GrupoAdmin.tsx:91-95)

**Estrutura HTML (membros do grupo, Grupos.tsx:237-243):**
```html
<li key={u.id} className="flex items-center gap-3 px-4 py-3">
  <Avatar name={u.name} size={40} />
  <Link to={you ? '/perfil' : `/u/${u.username}`} className="min-w-0 flex-1 leading-5"><b className="block truncate text-[16px] font-semibold">{u.name}{you && ' (você)'}</b><span className="text-[13px] text-ink-2">@{u.username}</span></Link>
  {g.ownerId === u.id && <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white"><Crown size={12} aria-hidden />Dono</span>}
  {owner && !you && !closed && <button onClick={() => setRm(u.id)} className="press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint">Remover</button>}
</li>
```

**Estrutura HTML (gerenciar membros, GrupoAdmin.tsx:91-95):**
```html
<li key={u.id} className="flex items-center gap-3 px-4 py-3">
  <Avatar name={u.name} size={38} />
  <div className="min-w-0 flex-1 leading-5"><b className="block truncate text-[16px] font-semibold">{u.name}</b><span className="text-[13px] text-ink-2">{own ? 'Dono' : `@${u.username}`}</span></div>
  {!own && !closed && <button onClick={() => setSheet({ kind: 'member', id: u.id })} className="press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint">Remover</button>}
</li>
```

**className literais (membros):**
- `<li>`: `flex items-center gap-3 px-4 py-3`
- Avatar: (via componente, size={40} ou {38})
- Nome (`<b>`): `block truncate text-[16px] font-semibold`
- Username: `text-[13px] text-ink-2`
- Selo Dono: `inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white`
- Botão Remover: `press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint`

### Linha de atividade com selo "Feito hoje" — `GrupoPagina` tab atividades (Grupos.tsx:221-225)

**Estrutura HTML:**
```html
<li key={a.id} className="flex items-center gap-3 px-4 py-3.5">
  <span className="min-w-0 flex-1 text-[16px] font-medium">{a.name}</span>
  {doneToday(a) && <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black"><Check size={12} strokeWidth={3} aria-hidden />Feito hoje</span>}
  <span className="tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold">+{a.points} pts</span>
</li>
```

**className literais:**
- `<li>`: `flex items-center gap-3 px-4 py-3.5`
- Nome: `min-w-0 flex-1 text-[16px] font-medium`
- Selo "Feito hoje": `inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black`
- Ícone Check: `size={12} strokeWidth={3}`
- Pontos: `tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold`

### PostCard — `lib.tsx:57-102`

**Estrutura HTML:**
```html
<article className="rounded-[14px] bg-surface">
  <div className="flex items-center gap-3 p-4 pb-3">
    <Link to={u.id === me?.id ? '/perfil' : `/u/${u.username}`}><Avatar name={u.name} /></Link>
    <div className="min-w-0 flex-1 leading-5">
      <Link to={u.id === me?.id ? '/perfil' : `/u/${u.username}`} className="block truncate text-[16px] font-semibold hover:underline">{u.name}</Link>
      <p className="truncate text-[13px] text-ink-2">@{u.username} · {post.ago}</p>
    </div>
    {onDelete && (
      <button onClick={onDelete} aria-label="Excluir postagem" className="press flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"><Trash2 size={19} /></button>
    )}
  </div>
  <div className="flex flex-wrap items-center gap-2 px-4">
    {g && act ? (
      <>
        <Link to={`/grupos/${g.id}`} className="inline-flex items-center rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">{g.name}</Link>
        <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black">{act.name} · +{post.points} pts</span>
      </>
    ) : (
      post.cat && (<><CategoryChip cat={post.cat} />{post.habit && <span className="text-[13px] text-ink-2">{post.habit}</span>}</>)
    )}
  </div>
  {detail ? (
    <p className="px-4 pt-3 text-[17px] leading-6">{post.text}</p>
  ) : (
    <Link to={`/post/${post.id}`} className="block px-4 pt-3 text-[17px] leading-6">{post.text}</Link>
  )}
  {post.img && <img src={post.img} alt={`Foto de ${u.name}: ${post.text.slice(0, 60)}`} loading="lazy" className="mt-3 aspect-[4/3] w-full bg-surface-2 object-cover" />}
  <div className="flex items-center gap-1 p-2">
    <button onClick={() => toggleLike(post.id)} aria-pressed={post.liked} className={cx('press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium hover:bg-surface-2', post.liked ? 'text-coral-ink' : 'text-ink-2')}>
      <Heart size={20} aria-hidden fill={post.liked ? 'currentColor' : 'none'} />
      <span className="tnum">{post.likes}</span><span className="sr-only">{post.liked ? 'Descurtir' : 'Curtir'}</span><span aria-hidden>Curtir</span>
    </button>
    <Link to={`/post/${post.id}`} className="press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium text-ink-2 hover:bg-surface-2">
      <MessageCircle size={20} aria-hidden /><span className="tnum">{post.comments.length}</span>Comentar
    </Link>
  </div>
</article>
```

**className literais do PostCard:**
- `<article>`: `rounded-[14px] bg-surface`
- Cabeçalho: `flex items-center gap-3 p-4 pb-3`
- Avatar: (via componente, sem size explícito → padrão 40)
- Nome (`<Link>`): `block truncate text-[16px] font-semibold hover:underline`
- Meta (`<p>`): `truncate text-[13px] text-ink-2`
- Botão excluir: `press flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger`
- Linha grupo/atividade: `flex flex-wrap items-center gap-2 px-4`
- Link grupo: `inline-flex items-center rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white`
- Selo atividade: `rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black`
- CategoryChip: (via componente)
- Habit: `text-[13px] text-ink-2`
- Texto (detail): `px-4 pt-3 text-[17px] leading-6`
- Texto (Link): `block px-4 pt-3 text-[17px] leading-6`
- Imagem: `mt-3 aspect-[4/3] w-full bg-surface-2 object-cover`
- Barra inferior: `flex items-center gap-1 p-2`
- Botão curtir: `press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium hover:bg-surface-2` — liked: `text-coral-ink` — não liked: `text-ink-2`
- Heart: `size={20}`
- Contagem curtidas: `tnum`
- Sr-only: `sr-only`
- Botão comentar: `press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium text-ink-2 hover:bg-surface-2`
- MessageCircle: `size={20}`
- Contagem comentários: `tnum`

### Cartão centralizado da página de convite — `Convite` (GrupoAdmin.tsx:171-183)

**Estrutura HTML:**
```html
<div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
  <Link to={me ? '/hoje' : '/login'} className="mb-8"><Logo size={22} /></Link>
  <div className="w-full max-w-[420px] rounded-[22px] bg-surface p-6 text-center shadow-[0_2px_12px_rgb(0_0_0/0.06)]">
    <span className={`mx-auto flex size-16 items-center justify-center rounded-full ${s.tone}`}><Icon size={30} aria-hidden /></span>
    <h1 className="mt-5 text-[26px] leading-8 font-bold tracking-[-0.02em]">{s.title}</h1>
    <p className="mt-2 text-[16px] leading-[22px] text-ink-2">{s.text}</p>
    {showMeta && g && (
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[14px] bg-surface-2 p-3 text-[13px] text-ink-2">
        <CategoryChip cat={g.cat} /><span>{g.members.length} membros</span><span>{fmtDate(g.start)} – {fmtDate(g.end)}</span>
      </div>
    )}
    <div className="mt-6 flex flex-col gap-2">{s.cta}</div>
  </div>
</div>
```

**className literais:**
- Wrapper: `flex min-h-dvh flex-col items-center justify-center px-4 py-10`
- Logo link: `mb-8`
- Cartão central: `w-full max-w-[420px] rounded-[22px] bg-surface p-6 text-center shadow-[0_2px_12px_rgb(0_0_0/0.06)]`
- Ícone circular: `mx-auto flex size-16 items-center justify-center rounded-full ${s.tone}` (dinâmico via template literal)
- Ícone (Icon): `size={30}`
- Título (`<h1>`): `mt-5 text-[26px] leading-8 font-bold tracking-[-0.02em]`
- Texto (`<p>`): `mt-2 text-[16px] leading-[22px] text-ink-2`
- Meta box: `mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[14px] bg-surface-2 p-3 text-[13px] text-ink-2`
- CTA: `mt-6 flex flex-col gap-2`

**Tones possíveis (GrupoAdmin.tsx:154-166):**
- inválido: `bg-surface-2 text-ink-2`
- não logado: `bg-lime text-black`
- bloqueado: `bg-danger-tint text-danger`
- já membro: `bg-action-tint text-action`
- encerrado: `bg-surface-2 text-closed`
- entrar/voltar: `bg-lime text-black`

---

## C) Dados de categoria — `CATEGORIES` (`referencia-design/src/app/data.ts:30-42`)

**Arquivo:** `referencia-design/src/app/data.ts:30-42`
**Interface `Category` (data.ts:23-28):** `id: string`, `label: string`, `family: Family`, `icon: LucideIcon`
**Tipo `Family` (data.ts:21):** `'coral' | 'lime' | 'blue' | 'violet' | 'cyan' | 'gray'`

**Lista literal de CATEGORIES:**

| id | label | família | ícone |
|---|---|---|---|
| `saude` | Saúde | `coral` | `Heart` |
| `esportes` | Esportes e exercícios | `lime` | `Dumbbell` |
| `estudos` | Estudos | `blue` | `GraduationCap` |
| `leitura` | Leitura | `violet` | `BookOpen` |
| `alimentacao` | Alimentação | `coral` | `Apple` |
| `sono` | Sono | `blue` | `Moon` |
| `bem-estar` | Bem-estar mental | `violet` | `Flower2` |
| `financas` | Finanças | `lime` | `Wallet` |
| `organizacao` | Organização e produtividade | `cyan` | `ListChecks` |
| `hobbies` | Hobbies e criatividade | `cyan` | `Palette` |
| `outros` | Outros | `gray` | `Shapes` |

**Código literal (data.ts:30-42):**
```js
export const CATEGORIES: Category[] = [
  { id: 'saude', label: 'Saúde', family: 'coral', icon: Heart },
  { id: 'esportes', label: 'Esportes e exercícios', family: 'lime', icon: Dumbbell },
  { id: 'estudos', label: 'Estudos', family: 'blue', icon: GraduationCap },
  { id: 'leitura', label: 'Leitura', family: 'violet', icon: BookOpen },
  { id: 'alimentacao', label: 'Alimentação', family: 'coral', icon: Apple },
  { id: 'sono', label: 'Sono', family: 'blue', icon: Moon },
  { id: 'bem-estar', label: 'Bem-estar mental', family: 'violet', icon: Flower2 },
  { id: 'financas', label: 'Finanças', family: 'lime', icon: Wallet },
  { id: 'organizacao', label: 'Organização e produtividade', family: 'cyan', icon: ListChecks },
  { id: 'hobbies', label: 'Hobbies e criatividade', family: 'cyan', icon: Palette },
  { id: 'outros', label: 'Outros', family: 'gray', icon: Shapes },
]
```

**`catOf` (data.ts:43):**
```js
export const catOf = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[10]
```

**FAMILY (cores, replicado de `ui.tsx:8-15`):**
- `coral`: `bg-[#fde8e8] text-coral-ink`
- `lime`: `bg-[#eef9cf] text-[#3f5a00]`
- `blue`: `bg-[#e3ecff] text-[#1e40af]`
- `violet`: `bg-[#f1e6fa] text-violet-ink`
- `cyan`: `bg-[#ddf4f8] text-[#0e5a68]`
- `gray`: `bg-[#ecece9] text-[#4a4a47]`

---

## Componentes individuais (arquivo:linha, className literal, estrutura HTML)

### BigTitle — `referencia-design/src/app/ui.tsx:266-276`

**className literais:**
- Wrapper (`<div>`): `flex items-end justify-between gap-3 pt-6 pb-4 md:pt-8`
- Div do título: `min-w-0`
- Título (`<h1>`): `text-[34px] leading-[41px] font-bold tracking-[-0.02em]`
- Subtítulo (`<p>`): `mt-0.5 text-[16px] leading-[22px] text-ink-2`

**Estrutura HTML:**
```jsx
<div className="flex items-end justify-between gap-3 pt-6 pb-4 md:pt-8">
  <div className="min-w-0">
    <h1 className="text-[34px] leading-[41px] font-bold tracking-[-0.02em]">{title}</h1>
    {sub && <p className="mt-0.5 text-[16px] leading-[22px] text-ink-2">{sub}</p>}
  </div>
  {right}
</div>
```

**Ícones Lucide:** nenhum.

---

### SectionTitle — `referencia-design/src/app/ui.tsx:282-289`

**className literais:**
- Wrapper (`<div>`): `mt-8 mb-2 flex items-baseline justify-between px-1 first:mt-0`
- Título (`<h2>`): `text-[22px] leading-7 font-bold tracking-[-0.01em]`

**Estrutura HTML:**
```jsx
<div className="mt-8 mb-2 flex items-baseline justify-between px-1 first:mt-0">
  <h2 className="text-[22px] leading-7 font-bold tracking-[-0.01em]">{children}</h2>
  {right}
</div>
```

**Ícones Lucide:** nenhum.

---

### ErrorSummary — `referencia-design/src/app/ui.tsx:94-102`

**className literais:**
- Wrapper (`<div role="alert">`): `rounded-[14px] border border-danger/30 bg-danger-tint p-4 text-[15px] text-danger`
- Parágrafo (`<p>`): `flex items-center gap-2 font-semibold`
- Lista (`<ul>`): `mt-1 list-disc pl-9 text-[14px] leading-5`
- Ícone (`<AlertCircle>`): `size={18}` (sem classe adicional)

**Estrutura HTML:**
```jsx
<div role="alert" className="rounded-[14px] border border-danger/30 bg-danger-tint p-4 text-[15px] text-danger">
  <p className="flex items-center gap-2 font-semibold"><AlertCircle size={18} aria-hidden />Revise {errors.length === 1 ? '1 campo' : `${errors.length} campos`}</p>
  <ul className="mt-1 list-disc pl-9 text-[14px] leading-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
</div>
```

**Ícones Lucide:** `AlertCircle` (size={18}).

---

### CategoryGrid — `referencia-design/src/app/ui.tsx:115-144`

**className literais:**
- Wrapper (`<div>`): (sem classe própria)
- Radiogroup (`<div role="radiogroup">`): `grid grid-cols-2 gap-2 sm:grid-cols-3`
- Botão base (`<button role="radio">`): `press flex min-h-[56px] items-center gap-2 rounded-[12px] border px-3 py-2 text-left text-[14px] leading-[18px] font-medium`
- Chip selecionado: `border-action bg-action-tint ring-1 ring-action`
- Chip não selecionado: `border-line bg-surface hover:bg-surface-2`
- Span do ícone: `flex size-8 shrink-0 items-center justify-center rounded-full` (juntado com `FAMILY[c.family]`)
- Label (`<span>`): `min-w-0 flex-1`
- Check (`<Check>`): `shrink-0 text-action` (com `size={16}`)
- Erro (`<p>`): `mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-danger`

**Estrutura HTML:**
```jsx
<div>
  <div role="radiogroup" aria-label="Categoria" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
    {CATEGORIES.map((c) => {
      const on = value === c.id
      const Icon = c.icon
      return (
        <button
          key={c.id}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(c.id)}
          className={cx(
            'press flex min-h-[56px] items-center gap-2 rounded-[12px] border px-3 py-2 text-left text-[14px] leading-[18px] font-medium',
            on ? 'border-action bg-action-tint ring-1 ring-action' : 'border-line bg-surface hover:bg-surface-2',
          )}
        >
          <span className={cx('flex size-8 shrink-0 items-center justify-center rounded-full', FAMILY[c.family])}><Icon size={16} aria-hidden /></span>
          <span className="min-w-0 flex-1">{c.label}</span>
          {on && <Check size={16} className="shrink-0 text-action" aria-hidden />}
        </button>
      )
    })}
  </div>
  {error && <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-danger"><AlertCircle size={15} aria-hidden />{error}</p>}
</div>
```

**Ícones Lucide:** `Check` (size={16}), `AlertCircle` (size={15}, só no erro).

**FAMILY (cores dos chips):**
- `coral`: `bg-[#fde8e8] text-coral-ink`
- `lime`: `bg-[#eef9cf] text-[#3f5a00]`
- `blue`: `bg-[#e3ecff] text-[#1e40af]`
- `violet`: `bg-[#f1e6fa] text-violet-ink`
- `cyan`: `bg-[#ddf4f8] text-[#0e5a68]`
- `gray`: `bg-[#ecece9] text-[#4a4a47]`

---

### Logo — `referencia-design/src/app/ui.tsx:305-314`

**className literais:**
- Span raiz (`<span>`): `inline-flex items-center gap-2 font-bold tracking-[-0.03em]` (com `style={{ fontSize: size }}`)
- Círculo preto (`<span>`): `relative inline-flex items-center justify-center rounded-full bg-black` (com `style={{ width: size * 1.1, height: size * 1.1 }}`)
- Círculo lime (`<span>`): `rounded-full bg-lime` (com `style={{ width: size * 0.42, height: size * 0.42 }}`)
- Texto: `HabitUs`

**Estrutura HTML:**
```jsx
<span className="inline-flex items-center gap-2 font-bold tracking-[-0.03em]" style={{ fontSize: size }}>
  <span className="relative inline-flex items-center justify-center rounded-full bg-black" style={{ width: size * 1.1, height: size * 1.1 }}>
    <span className="rounded-full bg-lime" style={{ width: size * 0.42, height: size * 0.42 }} />
  </span>
  HabitUs
</span>
```

**Ícones Lucide:** nenhum (wordmap + dois círculos via CSS inline).

---

## JSX completo das 4 telas (return de ponta a ponta)

### GruposLista — `referencia-design/src/app/screens/Grupos.tsx:22-67`

```jsx
<>
  <BigTitle title="Grupos" right={<Link to="/grupos/novo" className={btn('primary', 'min-h-11 px-4 text-[15px]')}><Plus size={18} aria-hidden />Criar grupo</Link>} />
  {mine.length === 0 ? (
    <Empty icon={Users} title="Nenhum grupo ainda" text="Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite." action={<Link to="/grupos/novo" className={btn('primary')}>Criar grupo</Link>} />
  ) : (
    sections.map((s) => {
      const list = mine.filter((g) => statusOf(g) === s.key)
      if (!list.length) return null
      return (
        <section key={s.key} className="mb-6" aria-label={s.title}>
          <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-ink-2 uppercase">{s.title}</h2>
          <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
            {list.map((g) => {
              const pos = ranking(g).find((r) => r.user.id === me?.id)?.pos
              return (
                <li key={g.id}>
                  <Link to={`/grupos/${g.id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="truncate text-[17px] leading-[22px] font-semibold">{g.name}</p>
                      <div className="flex flex-wrap items-center gap-2"><CategoryChip cat={g.cat} /><StatusBadge status={s.key} /></div>
                      <p className="text-[13px] text-ink-2">{nameJoin(g.members.length)} · {s.key === 'nao-iniciado' ? `Começa em ${fmtDate(g.start)}` : s.key === 'encerrado' ? `Encerrado em ${fmtDate(g.end)}` : `Até ${fmtDate(g.end)}`}</p>
                    </div>
                    {pos && s.key !== 'nao-iniciado' && <div className="text-center"><p className="tnum text-[26px] leading-7 font-bold">{pos}º</p><p className="text-[11px] font-medium text-ink-2">{s.key === 'encerrado' ? 'final' : 'posição'}</p></div>}
                    <ChevronRight size={18} className="shrink-0 text-ink-2" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )
    })
  )}
  <form onSubmit={(e) => { e.preventDefault(); const c = code.trim().split('/').pop(); if (c) nav(`/convite/${c}`) }} className="mt-4 flex gap-2">
    <label htmlFor="cod" className="sr-only">Código de convite</label>
    <input id="cod" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Tenho um código de convite" className={inputCls} autoCapitalize="none" />
    <button className={btn('secondary', 'shrink-0')} disabled={!code.trim()}>Entrar</button>
  </form>
  <details className="mt-6 rounded-[14px] border border-dashed border-line px-4 py-3 text-[14px] text-ink-2">
    <summary className="cursor-pointer font-medium text-ink">Protótipo · testar estados do convite</summary>
    <ul className="mt-2 grid gap-1">{INVITE_TESTS.map((t) => <li key={t.code}><Link to={`/convite/${t.code}`} className="flex min-h-11 items-center justify-between rounded-[10px] px-2 hover:bg-surface-2"><span>{t.label}</span><code className="text-[12px]">{t.code}</code></Link></li>)}</ul>
  </details>
</>
```

---

### GrupoCriar — `referencia-design/src/app/screens/Grupos.tsx:99-129`

```jsx
<>
  <PageHeader title="Criar grupo" back="/grupos" />
  <form onSubmit={submit} className="mt-5 space-y-6" noValidate>
    <ErrorSummary errors={Object.values(errs)} />
    <Field id="gname" label="Nome do grupo" error={errs.name}><input id="gname" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Ex.: Movimento 30 Dias" aria-invalid={!!errs.name} /></Field>
    <fieldset><legend className="mb-2 text-[15px] font-medium">Categoria</legend><CategoryGrid value={cat} onChange={setCat} error={errs.cat} /></fieldset>
    <div className="grid grid-cols-2 gap-3">
      <Field id="ini" label="Início" error={errs.start}><input id="ini" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} /></Field>
      <Field id="fim" label="Fim" error={errs.end}><input id="fim" type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} className={inputCls} aria-invalid={!!errs.end} /></Field>
    </div>
    <Field id="gdesc" label="Descrição (opcional)"><textarea id="gdesc" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className={inputCls + ' py-3 leading-6'} /></Field>
    <fieldset>
      <legend className="mb-2 text-[15px] font-medium">Atividades e pontos</legend>
      <ul className="space-y-2">
        {acts.map((a, i) => (
          <li key={a.id} className="rounded-[14px] bg-surface p-3">
            <div className="flex items-center gap-2">
              <input aria-label={`Nome da atividade ${i + 1}`} value={a.name} onChange={(e) => upd(i, { name: e.target.value })} className={inputCls} placeholder="Ex.: Treino de 30 min" />
              {acts.length > 1 && <button type="button" onClick={() => setActs(acts.filter((_, k) => k !== i))} aria-label={`Remover atividade ${i + 1}`} className="press flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"><Trash2 size={18} /></button>}
            </div>
            <div className="mt-2 flex items-center justify-between"><span className="text-[14px] text-ink-2">Pontos por conclusão</span><Stepper label="pontos" value={a.points} min={1} max={10} onChange={(n) => upd(i, { points: n })} /></div>
          </li>
        ))}
      </ul>
      {errs.acts && <p className="mt-1.5 text-[13px] font-medium text-danger">{errs.acts}</p>}
      <button type="button" onClick={() => setActs([...acts, { id: `n${acts.length + 1}${Date.now()}`, name: '', points: 3 }])} className={btn('ghost', 'mt-2 min-h-11 w-full')}>
        <Plus size={18} aria-hidden />Adicionar atividade
      </button>
    </fieldset>
    <button className={btn('primary', 'w-full')}>Criar grupo</button>
  </form>
</>
```

---

### GrupoPagina — `referencia-design/src/app/screens/Grupos.tsx:166-276`

```jsx
<>
  <PageHeader title={g.name} back="/grupos" right={owner ? <Link to={`/grupos/${g.id}/gerenciar`} className="press flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-action hover:bg-action-tint" aria-label="Gerenciar grupo"><Settings size={18} aria-hidden /><span className="hidden sm:inline">Gerenciar</span></Link> : undefined} />
  <section className="pt-5 pb-4">
    <div className="flex flex-wrap items-center gap-2"><CategoryChip cat={g.cat} /><StatusBadge status={status} /></div>
    <h2 className="mt-3 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{g.name}</h2>
    {g.desc && <p className="mt-1 text-[16px] leading-[22px] text-ink-2">{g.desc}</p>}
    <p className="tnum mt-2 text-[14px] text-ink-2">{range(g)} · {nameJoin(g.members.length)}{!closed && status !== 'nao-iniciado' && <> · Você: <b className="text-ink">{myPts} pts</b></>}</p>
    {!closed && (
      <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-surface p-2 pl-3.5">
        <span className="min-w-0 flex-1 truncate text-[14px] text-ink-2">{link.replace(/^https?:\/\//, '')}</span>
        <button onClick={copy} className={btn('secondary', 'min-h-10 px-3.5 text-[14px]')}><Copy size={15} aria-hidden />Copiar</button>
      </div>
    )}
    {closed ? (
      <div className="mt-4"><Notice tone="info" icon={Lock}>Grupo encerrado em {fmtDate(g.end, true)}. Ranking final salvo. Convites encerrados.</Notice></div>
    ) : status === 'nao-iniciado' ? (
      <div className="mt-4"><Notice tone="warn" icon={Info}>Este grupo começa em {fmtDate(g.start, true)}. Você poderá postar conclusões a partir daí.</Notice></div>
    ) : (
      <Link to={`/grupos/${g.id}/postar`} className={btn('primary', 'mt-4 w-full')}><Camera size={19} aria-hidden />Postar conclusão</Link>
    )}
  </section>

  <div className="sticky top-14 z-10 -mx-4 bg-bg/92 px-4 py-2 backdrop-blur-lg md:mx-0">
    <Segmented<Tab> label="Seções do grupo" scroll value={tab} onChange={(t) => setSp({ aba: t }, { replace: true })} options={[{ id: 'feed', label: 'Feed' }, { id: 'ranking', label: 'Ranking' }, { id: 'atividades', label: 'Atividades' }, { id: 'membros', label: 'Membros' }]} />
  </div>

  <div className="mt-3" role="tabpanel">
    {tab === 'feed' && (gPosts.length === 0
      ? <Empty icon={Camera} title="Nenhuma conclusão ainda" text={closed ? 'Este grupo encerrou sem conclusões publicadas.' : 'Seja a primeira pessoa a postar uma conclusão.'} action={!closed && status === 'andamento' ? <Link to={`/grupos/${g.id}/postar`} className={btn('primary')}>Postar conclusão</Link> : undefined} />
      : <div className="space-y-3">{gPosts.map((p) => <PostCard key={p.id} post={p} />)}</div>)}

    {tab === 'ranking' && (
      <>
        {closed && <p className="mb-2 px-1 text-[17px] font-semibold">Ranking final</p>}
        <ol className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
          {rank.map((r) => {
            const you = r.user.id === me?.id
            return (
              <li key={r.user.id} className={cx('relative flex items-center gap-3 px-4 py-3', you && 'bg-action-tint')}>
                {you && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-action" />}
                <span className={cx('tnum w-9 text-center', r.pos <= 3 ? 'text-[20px] font-bold' : 'text-[16px] font-medium text-ink-2')}><span className="sr-only">Posição </span>{r.pos}º</span>
                <Avatar name={r.user.name} size={38} />
                <Link to={you ? '/perfil' : `/u/${r.user.username}`} className="min-w-0 flex-1 truncate text-[16px] font-semibold hover:underline">{r.user.name}{you && <span className="ml-2 rounded-full bg-action px-2 py-0.5 align-middle text-[11px] font-semibold text-white">Você</span>}</Link>
                <span className="tnum text-[17px] font-bold">{r.points}<span className="ml-1 text-[12px] font-medium text-ink-2">pts</span></span>
              </li>
            )
          })}
        </ol>
      </>
    )}

    {tab === 'atividades' && (
      <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
        {g.activities.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-4 py-3.5">
            <span className="min-w-0 flex-1 text-[16px] font-medium">{a.name}</span>
            {doneToday(a) && <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black"><Check size={12} strokeWidth={3} aria-hidden />Feito hoje</span>}
            <span className="tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold">+{a.points} pts</span>
          </li>
        ))}
      </ul>
    )}

    {tab === 'membros' && (
      <>
        <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
          {g.members.map((m) => {
            const u = userById(m.userId)!
            const you = u.id === me?.id
            return (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={u.name} size={40} />
                <Link to={you ? '/perfil' : `/u/${u.username}`} className="min-w-0 flex-1 leading-5"><b className="block truncate text-[16px] font-semibold">{u.name}{you && ' (você)'}</b><span className="text-[13px] text-ink-2">@{u.username}</span></Link>
                {g.ownerId === u.id && <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white"><Crown size={12} aria-hidden />Dono</span>}
                {owner && !you && !closed && <button onClick={() => setRm(u.id)} className="press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint">Remover</button>}
              </li>
            )
          })}
        </ul>
        <button onClick={() => setLeave(true)} className={btn('danger', 'mt-6 w-full')}>Sair do grupo</button>
      </>
    )}
  </div>

  <Sheet open={leave} onClose={() => setLeave(false)} title={owner ? (others.length ? 'Sair e transferir o grupo?' : 'Sair e excluir o grupo?') : 'Sair do grupo?'}>
    <SheetBody>
      {!owner && <><p>Você perde os <b className="text-ink">{myPts} pontos</b> que acumulou em {g.name}.</p><p>Se o grupo ainda aceitar membros, você pode voltar pelo link de convite.</p></>}
      {owner && others.length > 0 && <><p><b className="text-ink">{successor?.name}</b>, quem entrou primeiro, passa a ser a pessoa dona do grupo.</p><p>Você perde seus pontos e pode voltar pelo link de convite.</p></>}
      {owner && others.length === 0 && <p>Você é a única pessoa no grupo. Ao sair, <b className="text-ink">{g.name} e todo o conteúdo serão excluídos permanentemente</b>.</p>}
    </SheetBody>
    <SheetActions>
      <button className={btn('dangerSolid')} onClick={() => { const wasAlone = owner && !others.length; leaveGroup(g.id); notify(wasAlone ? 'Grupo excluído' : 'Você saiu do grupo'); nav('/grupos', { replace: true }) }}>
        {owner ? (others.length ? 'Sair e transferir grupo' : 'Sair e excluir grupo') : 'Sair do grupo'}
      </button>
      <button className={btn('secondary')} onClick={() => setLeave(false)}>Cancelar</button>
    </SheetActions>
  </Sheet>

  <Sheet open={!!target} onClose={() => setRm(null)} title={`Remover ${target?.name.split(' ')[0] ?? ''}?`}>
    <SheetBody>
      <p><b className="text-ink">{target?.name}</b> perde todos os pontos neste grupo.</p>
      <p>A pessoa fica <b className="text-ink">bloqueada permanentemente</b> e não poderá voltar nem por convite.</p>
    </SheetBody>
    <SheetActions>
      <button className={btn('dangerSolid')} onClick={() => { removeMember(g.id, rm!); setRm(null); notify('Membro removido e bloqueado') }}>Remover e bloquear</button>
      <button className={btn('secondary')} onClick={() => setRm(null)}>Cancelar</button>
    </SheetActions>
  </Sheet>
</>
```

---

### Convite — `referencia-design/src/app/screens/GrupoAdmin.tsx:171-186`

```jsx
<div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
  <Link to={me ? '/hoje' : '/login'} className="mb-8"><Logo size={22} /></Link>
  <div className="w-full max-w-[420px] rounded-[22px] bg-surface p-6 text-center shadow-[0_2px_12px_rgb(0_0_0/0.06)]">
    <span className={`mx-auto flex size-16 items-center justify-center rounded-full ${s.tone}`}><Icon size={30} aria-hidden /></span>
    <h1 className="mt-5 text-[26px] leading-8 font-bold tracking-[-0.02em]">{s.title}</h1>
    <p className="mt-2 text-[16px] leading-[22px] text-ink-2">{s.text}</p>
    {showMeta && g && (
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[14px] bg-surface-2 p-3 text-[13px] text-ink-2">
        <CategoryChip cat={g.cat} /><span>{g.members.length} membros</span><span>{fmtDate(g.start)} – {fmtDate(g.end)}</span>
      </div>
    )}
    <div className="mt-6 flex flex-col gap-2">{s.cta}</div>
  </div>
</div>
```
