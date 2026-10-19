import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Check, ChevronDown, Flame, Plus, Sprout } from 'lucide-react'
import { TODAY_LABEL, TODAY_IDX, WEEKDAYS, type Freq, type Habit } from '../data'
import { useStore } from '../store'
import { BigTitle, CategoryChip, CategoryGrid, Empty, ErrorSummary, Field, PageHeader, Sheet, SheetActions, SheetBody, Stepper, btn, cx, inputCls, Notice } from '../ui'

const SUGGEST = [
  { name: 'Beber água', cat: 'saude' },
  { name: 'Caminhar', cat: 'esportes' },
  { name: 'Ler 10 min', cat: 'leitura' },
  { name: 'Estudar', cat: 'estudos' },
]

function streakText(h: Habit) {
  const n = h.streak
  if (h.freq.type === 'weekly') return `Sequência: ${n} ${n === 1 ? 'conclusão' : 'conclusões'}`
  return `Sequência: ${n} ${n === 1 ? 'dia' : 'dias'}`
}

function HabitCard({ h }: { h: Habit }) {
  const { toggleHabit } = useStore()
  const weekly = h.freq.type === 'weekly' ? h.freq : null
  const blocked = !!weekly && !h.markedToday && h.weekCount >= weekly.times
  return (
    <li className={cx('relative p-4', h.markedToday && 'bg-[#f6fce6]')}>
      {h.markedToday && <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-lime" />}
      <div className="flex items-start gap-3.5">
        <button
          onClick={() => toggleHabit(h.id)}
          aria-pressed={h.markedToday}
          aria-label={`${h.markedToday ? 'Desmarcar' : 'Marcar'} ${h.name}`}
          disabled={blocked}
          className={cx('press flex size-12 shrink-0 items-center justify-center rounded-full border-2 disabled:opacity-40', h.markedToday ? 'border-lime bg-lime text-black' : 'border-action text-transparent hover:bg-action-tint hover:text-action/40')}
        >
          <Check size={24} strokeWidth={3} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/habitos/${h.id}/editar`} className="text-[17px] leading-[22px] font-semibold hover:underline">{h.name}</Link>
            <span className="tnum flex shrink-0 items-center gap-1 rounded-full bg-[#fde8e8] px-2.5 py-1 text-xs font-semibold text-coral-ink"><Flame size={13} aria-hidden />{h.streak}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <CategoryChip cat={h.cat} />
            <span className="text-[13px] text-ink-2">{h.markedToday ? 'Feito hoje · ' : ''}{streakText(h)}</span>
          </div>
          {weekly && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[13px] text-ink-2">
                <span>Esta semana: <b className="tnum text-ink">{h.weekCount}/{weekly.times}</b></span>
                <span>{h.weekCount >= weekly.times ? `Meta cumprida · +${weekly.times} na sequência` : `Ao atingir ${weekly.times}/${weekly.times}: +${weekly.times}`}</span>
              </div>
              <div className="mt-1.5 flex gap-1" role="progressbar" aria-valuenow={h.weekCount} aria-valuemin={0} aria-valuemax={weekly.times} aria-label="Progresso da semana">
                {Array.from({ length: weekly.times }).map((_, i) => <span key={i} className={cx('h-2 flex-1 rounded-full', i < h.weekCount ? 'bg-black' : 'bg-surface-2')} />)}
              </div>
            </div>
          )}
          {h.lost && <p className="mt-3 rounded-[10px] bg-surface-2 px-3 py-2 text-[13px] leading-[18px] text-ink-2">{h.lost}</p>}
        </div>
      </div>
    </li>
  )
}

export function Hoje() {
  const { habits } = useStore()
  const [showOff, setShowOff] = useState(false)
  const today = habits.filter((h) => h.freq.type !== 'days' || h.freq.days.includes(TODAY_IDX))
  const off = habits.filter((h) => !today.includes(h))
  const done = today.filter((h) => h.markedToday).length
  const pct = today.length ? (done / today.length) * 100 : 0
  const cap = TODAY_LABEL.charAt(0).toUpperCase() + TODAY_LABEL.slice(1)

  return (
    <>
      <BigTitle title="Hoje" sub={cap} right={habits.length > 0 && <Link to="/habitos/novo" className={btn('primary', 'min-h-11 px-4 text-[15px]')}><Plus size={18} aria-hidden />Novo hábito</Link>} />
      {habits.length === 0 ? (
        <Empty
          icon={Sprout}
          title="Comece pelo primeiro hábito"
          text="Marque quando cumprir. Sua sequência começa hoje."
          action={
            <>
              <Link to="/habitos/novo" className={btn('primary', 'w-full')}>Criar meu primeiro hábito</Link>
              <div className="mt-2 flex w-full flex-wrap justify-center gap-2">
                {SUGGEST.map((s) => <Link key={s.name} to={`/habitos/novo?nome=${encodeURIComponent(s.name)}&cat=${s.cat}`} className="press rounded-full border border-line bg-surface px-3.5 py-2 text-[14px] font-medium hover:bg-surface-2">{s.name}</Link>)}
              </div>
            </>
          }
        />
      ) : (
        <>
          <div className="mb-4 rounded-[18px] bg-black p-5 text-white">
            <p className="tnum text-[15px] font-medium text-white/70">{done === today.length && today.length > 0 ? 'Dia completo' : 'Progresso de hoje'}</p>
            <p className="mt-1 text-[28px] leading-[34px] font-bold tracking-[-0.02em]"><span className="tnum">{done}</span> de <span className="tnum">{today.length}</span> feitos</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={today.length} aria-label="Hábitos feitos hoje"><div className="h-full rounded-full bg-lime transition-[width] duration-300" style={{ width: `${pct}%` }} /></div>
          </div>
          <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">{today.map((h) => <HabitCard key={h.id} h={h} />)}</ul>
          {off.length > 0 && (
            <div className="mt-4">
              <button onClick={() => setShowOff(!showOff)} aria-expanded={showOff} className="press flex min-h-11 w-full items-center justify-between rounded-[12px] px-3 text-[15px] font-medium text-ink-2 hover:bg-surface-2">
                Não é hoje ({off.length})<ChevronDown size={18} className={cx('transition-transform', showOff && 'rotate-180')} aria-hidden />
              </button>
              {showOff && (
                <ul className="mt-1 divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
                  {off.map((h) => (
                    <li key={h.id} className="flex items-center justify-between gap-3 p-4 text-ink-2">
                      <div><Link to={`/habitos/${h.id}/editar`} className="text-[16px] font-medium text-ink hover:underline">{h.name}</Link><p className="text-[13px]">Dias: {h.freq.type === 'days' && h.freq.days.map((d) => WEEKDAYS[d]).join(', ')} · {streakText(h)}</p></div>
                      <span className="text-[13px] font-medium">Não é hoje</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export function HabitoForm() {
  const { id } = useParams()
  const { habits, saveHabit, deleteHabit, notify } = useStore()
  const nav = useNavigate()
  const editing = habits.find((h) => h.id === id)
  const q = new URLSearchParams(window.location.search)
  const [name, setName] = useState(editing?.name ?? q.get('nome') ?? '')
  const [desc, setDesc] = useState(editing?.desc ?? '')
  const [cat, setCat] = useState(editing?.cat ?? q.get('cat') ?? '')
  const [ft, setFt] = useState<Freq['type']>(editing?.freq.type ?? 'daily')
  const [days, setDays] = useState<number[]>(editing?.freq.type === 'days' ? editing.freq.days : [0, 2, 4])
  const [times, setTimes] = useState(editing?.freq.type === 'weekly' ? editing.freq.times : 3)
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [del, setDel] = useState(false)

  if (id && !editing)
    return (<><PageHeader title="Editar hábito" back="/hoje" /><div className="mt-6"><Empty icon={Sprout} title="Hábito não encontrado" text="Ele pode ter sido excluído." action={<Link to="/hoje" className={btn('primary')}>Voltar para Hoje</Link>} /></div></>)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!name.trim()) er.name = 'Dê um nome ao hábito.'
    if (!cat) er.cat = 'Escolha uma categoria.'
    if (ft === 'days' && days.length === 0) er.days = 'Escolha ao menos um dia da semana.'
    setErrs(er)
    if (Object.keys(er).length) return
    const freq: Freq = ft === 'daily' ? { type: 'daily' } : ft === 'days' ? { type: 'days', days: [...days].sort() } : { type: 'weekly', times }
    saveHabit({ id: editing?.id, name: name.trim(), desc: desc.trim(), cat, freq, lost: undefined })
    notify(editing ? 'Hábito salvo' : 'Hábito criado. Sua sequência começa hoje.')
    nav('/hoje')
  }

  const FREQS: { id: Freq['type']; label: string }[] = [
    { id: 'daily', label: 'Todos os dias' },
    { id: 'days', label: 'Dias da semana' },
    { id: 'weekly', label: 'X vezes por semana' },
  ]

  return (
    <>
      <PageHeader title={editing ? 'Editar hábito' : 'Novo hábito'} back="/hoje" />
      <form onSubmit={submit} className="mt-5 space-y-6" noValidate>
        <ErrorSummary errors={Object.values(errs)} />
        <Field id="nome" label="Nome" error={errs.name}><input id="nome" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Ex.: Correr 30 min" aria-invalid={!!errs.name} /></Field>
        <Field id="desc" label="Descrição (opcional)"><input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} className={inputCls} /></Field>
        <fieldset><legend className="mb-2 text-[15px] font-medium">Categoria</legend><CategoryGrid value={cat} onChange={setCat} error={errs.cat} /></fieldset>
        <fieldset>
          <legend className="mb-2 text-[15px] font-medium">Frequência</legend>
          <div role="radiogroup" className="space-y-2">
            {FREQS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={ft === f.id} onClick={() => setFt(f.id)} className={cx('press flex min-h-12 w-full items-center gap-3 rounded-[12px] border px-4 text-left text-[16px] font-medium', ft === f.id ? 'border-action bg-action-tint ring-1 ring-action' : 'border-line bg-surface')}>
                <span className={cx('flex size-5 items-center justify-center rounded-full border-2', ft === f.id ? 'border-action' : 'border-line')}>{ft === f.id && <span className="size-2.5 rounded-full bg-action" />}</span>{f.label}
              </button>
            ))}
          </div>
          {ft === 'days' && (
            <div className="mt-3">
              <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
                {WEEKDAYS.map((d, i) => {
                  const on = days.includes(i)
                  return <button key={d} type="button" aria-pressed={on} onClick={() => setDays(on ? days.filter((x) => x !== i) : [...days, i])} className={cx('press min-h-11 rounded-[10px] text-[14px] font-semibold', on ? 'bg-black text-white' : 'bg-surface-2 text-ink-2')}>{d}</button>
                })}
              </div>
              {errs.days && <p className="mt-1.5 text-[13px] font-medium text-danger">{errs.days}</p>}
            </div>
          )}
          {ft === 'weekly' && (
            <div className="mt-3 rounded-[14px] bg-surface p-4">
              <div className="flex items-center justify-between"><span className="text-[16px] font-medium">Vezes por semana</span><Stepper label="vezes por semana" value={times} min={1} max={7} onChange={setTimes} suffix="×" /></div>
              <p className="mt-3 text-[13px] leading-[18px] text-ink-2">Ao cumprir {times}/{times}, sua sequência aumenta em {times}. Se a semana terminar abaixo da meta, volta a zero.</p>
            </div>
          )}
        </fieldset>
        <div className="space-y-2">
          <button className={btn('primary', 'w-full')}>Salvar hábito</button>
          {editing && <button type="button" onClick={() => setDel(true)} className={btn('danger', 'w-full')}>Excluir hábito</button>}
        </div>
      </form>
      <Sheet open={del} onClose={() => setDel(false)} title="Excluir este hábito?">
        <SheetBody><p>Os registros e a sequência de <b className="text-ink">{editing?.name}</b> serão apagados. Essa ação é irreversível.</p></SheetBody>
        <SheetActions>
          <button className={btn('dangerSolid')} onClick={() => { deleteHabit(editing!.id); notify('Hábito excluído'); nav('/hoje') }}>Excluir hábito</button>
          <button className={btn('secondary')} onClick={() => setDel(false)}>Cancelar</button>
        </SheetActions>
      </Sheet>
    </>
  )
}
