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
