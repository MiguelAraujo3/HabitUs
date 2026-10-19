import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { Check, Flame, Home, Newspaper, UserRound, Users, WifiOff } from 'lucide-react'
import { TODAY_IDX } from './data'
import { useStore } from './store'
import { Avatar, Logo, cx } from './ui'

export function Root() {
  const { toast } = useStore()
  const { pathname } = useLocation()
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return (
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
  )
}

const NAV = [
  { to: '/feed', label: 'Feed', icon: Newspaper },
  { to: '/hoje', label: 'Hoje', icon: Home },
  { to: '/grupos', label: 'Grupos', icon: Users },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

function TodayColumn() {
  const { habits, toggleHabit } = useStore()
  const list = habits.filter((h) => h.freq.type !== 'days' || h.freq.days.includes(TODAY_IDX))
  const done = list.filter((h) => h.markedToday).length
  return (
    <section aria-label="Hábitos de hoje" className="rounded-[18px] bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[17px] font-semibold">Hábitos de hoje</h2>
        <span className="tnum text-[13px] text-ink-2">{done} de {list.length}</span>
      </div>
      {list.length === 0 ? (
        <p className="mt-3 text-[14px] leading-5 text-ink-2">Nenhum hábito para hoje.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line/70">
          {list.map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-2.5">
              <button
                onClick={() => toggleHabit(h.id)}
                aria-pressed={h.markedToday}
                aria-label={`${h.markedToday ? 'Desmarcar' : 'Marcar'} ${h.name}`}
                disabled={!h.markedToday && h.freq.type === 'weekly' && h.weekCount >= h.freq.times}
                className={cx('press flex size-8 shrink-0 items-center justify-center rounded-full border-2 disabled:opacity-40', h.markedToday ? 'border-lime bg-lime text-black' : 'border-action text-transparent hover:bg-action-tint')}
              >
                <Check size={16} strokeWidth={3} aria-hidden />
              </button>
              <span className={cx('min-w-0 flex-1 text-[15px] leading-5', h.markedToday && 'text-ink-2')}>{h.name}</span>
              <span className="tnum flex items-center gap-1 text-[13px] font-semibold text-coral-ink"><Flame size={14} aria-hidden />{h.streak}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/hoje" className="mt-2 block rounded-[10px] py-2 text-center text-[14px] font-semibold text-action hover:bg-action-tint">Abrir Hoje</Link>
    </section>
  )
}

export function Shell() {
  const { me } = useStore()
  const loc = useLocation()
  if (!me) return <Navigate to={`/login?voltar=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col border-r border-line/70 bg-surface md:flex lg:w-60">
        <Link to="/hoje" className="flex h-[72px] items-center justify-center px-5 lg:justify-start" aria-label="HabitUs">
          <span className="lg:hidden"><span className="flex size-9 items-center justify-center rounded-full bg-black"><span className="size-3.5 rounded-full bg-lime" /></span></span>
          <span className="hidden lg:block"><Logo size={24} /></span>
        </Link>
        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 px-2.5 lg:px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cx('press flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[12px] text-[11px] font-medium lg:flex-row lg:justify-start lg:gap-3 lg:px-3.5 lg:text-[16px]', isActive ? 'bg-black text-white' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')}
            >
              <Icon size={22} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <Link to="/perfil" className="m-3 hidden items-center gap-3 rounded-[12px] p-2 hover:bg-surface-2 lg:flex">
          <Avatar name={me.name} size={36} />
          <span className="min-w-0 text-[14px] leading-[18px]"><b className="block truncate font-semibold">{me.name}</b><span className="text-ink-2">@{me.username}</span></span>
        </Link>
      </aside>

      <div className="md:pl-[72px] lg:pl-60">
        <div className="mx-auto flex max-w-[1060px] justify-center gap-8 px-4 md:px-6 lg:px-8">
          <main className="min-w-0 max-w-[680px] flex-1 pb-28 md:pb-16">
            <Outlet />
          </main>
          <div className="hidden w-[300px] shrink-0 xl:block">
            <div className="sticky top-8 pt-8"><TodayColumn /></div>
          </div>
        </div>
      </div>

      <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <ul className="mx-auto flex max-w-[480px]">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink to={to} className={({ isActive }) => cx('flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium', isActive ? 'text-black' : 'text-ink-2')}>
                {({ isActive }) => (
                  <>
                    <span className={cx('flex h-7 w-12 items-center justify-center rounded-full', isActive && 'bg-lime')}><Icon size={22} aria-hidden /></span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
