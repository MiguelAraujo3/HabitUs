import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle, ArrowLeft, Check, Clock, Minus, Plus, RefreshCw, Lock, type LucideIcon } from 'lucide-react'
import { CATEGORIES, STATUS_LABEL, catOf, type Family, type GroupStatus } from './data'

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

const FAMILY: Record<Family, string> = {
  coral: 'bg-[#fde8e8] text-coral-ink',
  lime: 'bg-[#eef9cf] text-[#3f5a00]',
  blue: 'bg-[#e3ecff] text-[#1e40af]',
  violet: 'bg-[#f1e6fa] text-violet-ink',
  cyan: 'bg-[#ddf4f8] text-[#0e5a68]',
  gray: 'bg-[#ecece9] text-[#4a4a47]',
}
const AVATARS: Family[] = ['blue', 'coral', 'violet', 'cyan', 'lime']

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const parts = name.trim().split(/\s+/)
  const ini = ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
  const fam = AVATARS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATARS.length]
  return (
    <span
      aria-hidden
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none', FAMILY[fam])}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ini}
    </span>
  )
}

export function CategoryChip({ cat, className }: { cat: string; className?: string }) {
  const c = catOf(cat)
  const Icon = c.icon
  return (
    <span className={cx('inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-4', FAMILY[c.family], className)}>
      <Icon size={13} aria-hidden className="shrink-0" />
      <span>{c.label}</span>
    </span>
  )
}

export function StatusBadge({ status }: { status: GroupStatus }) {
  const map = {
    andamento: ['bg-[#e3f4ea] text-ok', <span key="d" className="size-1.5 rounded-full bg-ok" />],
    'nao-iniciado': ['bg-[#fbf0c9] text-warn-ink', <Clock key="c" size={12} />],
    encerrado: ['bg-surface-2 text-closed', <Lock key="l" size={12} />],
  } as const
  const [cls, icon] = map[status]
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cls)}>
      {icon}
      {STATUS_LABEL[status]}
    </span>
  )
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid' | 'black'
export const btn = (v: Variant = 'primary', extra = '') =>
  cx(
    'press inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[12px] px-5 text-[16px] font-semibold disabled:cursor-not-allowed disabled:opacity-45',
    v === 'primary' && 'bg-action text-white hover:bg-action-press',
    v === 'black' && 'bg-black text-white hover:bg-[#222]',
    v === 'secondary' && 'bg-surface-2 text-ink hover:bg-[#e6e6e3]',
    v === 'ghost' && 'text-action hover:bg-action-tint',
    v === 'danger' && 'bg-danger-tint text-danger hover:bg-[#f9dad6]',
    v === 'dangerSolid' && 'bg-danger text-white hover:bg-[#8f1c12]',
    extra,
  )

export const inputCls =
  'w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30'

export function Field({ id, label, error, hint, children, count }: { id: string; label: string; error?: string; hint?: string; children: ReactNode; count?: string }) {
  return (
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
  )
}

export function ErrorSummary({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return (
    <div role="alert" className="rounded-[14px] border border-danger/30 bg-danger-tint p-4 text-[15px] text-danger">
      <p className="flex items-center gap-2 font-semibold"><AlertCircle size={18} aria-hidden />Revise {errors.length === 1 ? '1 campo' : `${errors.length} campos`}</p>
      <ul className="mt-1 list-disc pl-9 text-[14px] leading-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
    </div>
  )
}

export function Stepper({ value, min, max, onChange, label, suffix }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string; suffix?: string }) {
  const b = 'press flex size-11 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-[#e6e6e3] disabled:opacity-35'
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-1">
      <button type="button" className={b} aria-label={`Diminuir ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}><Minus size={18} /></button>
      <output className="tnum min-w-14 text-center text-[17px] font-semibold" aria-live="polite">{value}{suffix}</output>
      <button type="button" className={b} aria-label={`Aumentar ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}><Plus size={18} /></button>
    </div>
  )
}

export function CategoryGrid({ value, onChange, error }: { value: string; onChange: (id: string) => void; error?: string }) {
  return (
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
  )
}

export function Segmented<T extends string>({ options, value, onChange, label, scroll }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; scroll?: boolean }) {
  return (
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
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('button,a,input,select,textarea')].filter((x) => !x.hasAttribute('disabled'))
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="anim-fade absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="anim-sheet relative w-full max-w-[460px] rounded-t-[22px] bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl md:rounded-[22px] md:p-6">
        <div aria-hidden className="mx-auto mb-4 h-1 w-9 rounded-full bg-line md:hidden" />
        <h2 className="text-[22px] leading-7 font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className="mt-2 space-y-3 text-[16px] leading-[22px] text-ink-2">{children}</div>
}
export function SheetActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col gap-2">{children}</div>
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[18px] border border-dashed border-line bg-surface px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-ink-2"><Icon size={26} aria-hidden /></span>
      <h2 className="mt-4 text-[20px] leading-[26px] font-bold">{title}</h2>
      <p className="mt-1 max-w-[34ch] text-[16px] leading-[22px] text-ink-2">{text}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-[18px] bg-surface px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger-tint text-danger"><AlertCircle size={26} aria-hidden /></span>
      <h2 className="mt-4 text-[20px] font-bold">Não foi possível carregar</h2>
      <p className="mt-1 text-[16px] text-ink-2">Confira sua conexão e tente de novo.</p>
      <button onClick={onRetry} className={btn('secondary', 'mt-5')}><RefreshCw size={18} aria-hidden />Tentar de novo</button>
    </div>
  )
}

export function Skeleton({ rows = 3, photo }: { rows?: number; photo?: boolean }) {
  return (
    <div aria-busy="true" aria-label="Carregando" className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-[14px] bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="skeleton size-10 rounded-full" />
            <div className="flex-1 space-y-2"><div className="skeleton h-3.5 w-1/3 rounded" /><div className="skeleton h-3 w-1/5 rounded" /></div>
          </div>
          <div className="skeleton mt-4 h-3.5 w-full rounded" />
          <div className="skeleton mt-2 h-3.5 w-2/3 rounded" />
          {photo && <div className="skeleton mt-4 aspect-[4/3] w-full rounded-[12px]" />}
        </div>
      ))}
    </div>
  )
}

export function PageHeader({ title, back, right }: { title: string; back?: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
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
  )
}

export function BigTitle({ title, sub, right }: { title: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 pt-6 pb-4 md:pt-8">
      <div className="min-w-0">
        <h1 className="text-[34px] leading-[41px] font-bold tracking-[-0.02em]">{title}</h1>
        {sub && <p className="mt-0.5 text-[16px] leading-[22px] text-ink-2">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-[14px] bg-surface p-4', className)}>{children}</div>
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mt-8 mb-2 flex items-baseline justify-between px-1 first:mt-0">
      <h2 className="text-[22px] leading-7 font-bold tracking-[-0.01em]">{children}</h2>
      {right}
    </div>
  )
}

export function Notice({ tone = 'info', icon: Icon, children }: { tone?: 'info' | 'warn' | 'danger'; icon?: LucideIcon; children: ReactNode }) {
  const t = { info: 'bg-action-tint text-[#1e3a8a]', warn: 'bg-[#fbf0c9] text-warn-ink', danger: 'bg-danger-tint text-danger' }[tone]
  return (
    <div className={cx('flex items-start gap-2.5 rounded-[12px] px-3.5 py-3 text-[14px] leading-5 font-medium', t)}>
      {Icon && <Icon size={18} className="mt-px shrink-0" aria-hidden />}
      <div>{children}</div>
    </div>
  )
}

export function ProfileLink({ username, children, className }: { username: string; children: ReactNode; className?: string }) {
  return <Link to={`/u/${username}`} className={className}>{children}</Link>
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-bold tracking-[-0.03em]" style={{ fontSize: size }}>
      <span className="relative inline-flex items-center justify-center rounded-full bg-black" style={{ width: size * 1.1, height: size * 1.1 }}>
        <span className="rounded-full bg-lime" style={{ width: size * 0.42, height: size * 0.42 }} />
      </span>
      HabitUs
    </span>
  )
}
