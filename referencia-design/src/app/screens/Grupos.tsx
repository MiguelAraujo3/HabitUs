import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { Camera, Check, ChevronRight, Copy, Crown, Info, Lock, Plus, Settings, Trash2, Users } from 'lucide-react'
import { INVITE_TESTS, TODAY, fmtDate, statusOf, type Activity, type Group } from '../data'
import { PhotoPicker, PostCard } from '../lib'
import { useStore } from '../store'
import { Avatar, BigTitle, Card, CategoryChip, CategoryGrid, Empty, ErrorSummary, Field, Notice, PageHeader, Segmented, Sheet, SheetActions, SheetBody, StatusBadge, Stepper, btn, cx, inputCls } from '../ui'

const range = (g: Group) => `${fmtDate(g.start)} – ${fmtDate(g.end)}`
const nameJoin = (n: number) => `${n} ${n === 1 ? 'membro' : 'membros'}`

export function GruposLista() {
  const { groups, me, ranking } = useStore()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const mine = groups.filter((g) => g.members.some((m) => m.userId === me?.id))
  const sections: { key: ReturnType<typeof statusOf>; title: string }[] = [
    { key: 'andamento', title: 'Em andamento' },
    { key: 'nao-iniciado', title: 'Não iniciado' },
    { key: 'encerrado', title: 'Encerrado' },
  ]
  return (
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
  )
}

export function GrupoCriar() {
  const { createGroup, notify } = useStore()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [cat, setCat] = useState('')
  const [start, setStart] = useState(TODAY)
  const [end, setEnd] = useState('')
  const [desc, setDesc] = useState('')
  const [acts, setActs] = useState<Activity[]>([{ id: 'n1', name: '', points: 3 }])
  const [errs, setErrs] = useState<Record<string, string>>({})
  const upd = (i: number, p: Partial<Activity>) => setActs((l) => l.map((a, k) => (k === i ? { ...a, ...p } : a)))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (name.trim().length < 3) er.name = 'Dê um nome ao grupo (mínimo 3 letras).'
    if (!cat) er.cat = 'Escolha uma categoria.'
    if (!start) er.start = 'Informe a data de início.'
    if (!end) er.end = 'Informe a data de fim.'
    else if (start && end <= start) er.end = 'A data de fim precisa ser depois do início.'
    const valid = acts.filter((a) => a.name.trim())
    if (valid.length === 0) er.acts = 'Adicione ao menos uma atividade com nome.'
    setErrs(er)
    if (Object.keys(er).length) return
    const id = createGroup({ name: name.trim(), cat, start, end, desc: desc.trim(), activities: valid.map((a, i) => ({ ...a, id: `na${Date.now()}${i}`, name: a.name.trim() })) })
    notify('Grupo criado. Compartilhe o convite!')
    nav(`/grupos/${id}`, { replace: true })
  }

  return (
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
          <button type="button" onClick={() => setActs([...acts, { id: `n${acts.length + 1}${Date.now()}`, name: '', points: 3 }])} className={btn('ghost', 'mt-2 min-h-11 w-full')}><Plus size={18} aria-hidden />Adicionar atividade</button>
        </fieldset>
        <button className={btn('primary', 'w-full')}>Criar grupo</button>
      </form>
    </>
  )
}

type Tab = 'feed' | 'ranking' | 'atividades' | 'membros'

export function GrupoPagina() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const { groups, me, posts, ranking, userById, leaveGroup, removeMember, notify } = useStore()
  const nav = useNavigate()
  const [leave, setLeave] = useState(false)
  const [rm, setRm] = useState<string | null>(null)
  const g = groups.find((x) => x.id === id)

  if (!g)
    return (<><PageHeader title="Grupo" back="/grupos" /><div className="mt-6"><Empty icon={Users} title="Grupo não encontrado" text="Ele pode ter sido excluído pelo dono." action={<Link to="/grupos" className={btn('primary')}>Meus grupos</Link>} /></div></>)
  const member = g.members.some((m) => m.userId === me?.id)
  if (!member) return <Navigate to={`/convite/${g.code}`} replace />

  const status = statusOf(g)
  const owner = g.ownerId === me?.id
  const closed = status === 'encerrado'
  const tab = (['feed', 'ranking', 'atividades', 'membros'].includes(sp.get('aba') ?? '') ? sp.get('aba') : 'feed') as Tab
  const rank = ranking(g)
  const gPosts = posts.filter((p) => p.groupId === g.id)
  const doneToday = (a: Activity) => gPosts.some((p) => p.activityId === a.id && p.userId === me?.id && p.date === TODAY)
  const link = `${window.location.origin}/convite/${g.code}`
  const others = g.members.filter((m) => m.userId !== me?.id).sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
  const successor = others[0] && userById(others[0].userId)
  const myPts = rank.find((r) => r.user.id === me?.id)?.points ?? 0
  const target = rm ? userById(rm) : null

  const copy = async () => {
    try { await navigator.clipboard.writeText(link) } catch { /* ignore */ }
    notify('Link de convite copiado')
  }

  return (
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
  )
}

export function PostarConclusao() {
  const { id } = useParams()
  const { groups, posts, me, addCompletion, notify } = useStore()
  const nav = useNavigate()
  const g = groups.find((x) => x.id === id)
  const [aid, setAid] = useState('')
  const [img, setImg] = useState('')
  const [text, setText] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})
  if (!g || !g.members.some((m) => m.userId === me?.id)) return <Navigate to="/grupos" replace />
  const st = statusOf(g)
  if (st !== 'andamento')
    return (<><PageHeader title="Postar conclusão" back={`/grupos/${g.id}`} /><div className="mt-6"><Empty icon={Lock} title={st === 'encerrado' ? 'Grupo encerrado' : 'Grupo ainda não começou'} text={st === 'encerrado' ? 'Conclusões não são mais aceitas. O ranking final está salvo.' : `As conclusões abrem em ${fmtDate(g.start, true)}.`} action={<Link to={`/grupos/${g.id}`} className={btn('primary')}>Voltar ao grupo</Link>} /></div></>)
  const done = (a: Activity) => posts.some((p) => p.groupId === g.id && p.activityId === a.id && p.userId === me?.id && p.date === TODAY)
  const sel = g.activities.find((a) => a.id === aid)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!sel) er.aid = 'Escolha a atividade que você concluiu.'
    if (!img) er.img = 'A foto é obrigatória para postar a conclusão.'
    setErrs(er)
    if (Object.keys(er).length || !sel) return
    addCompletion(g, sel, text.trim(), img)
    notify(`Conclusão publicada · +${sel.points} pontos`)
    nav(`/grupos/${g.id}?aba=ranking`, { replace: true })
  }

  return (
    <>
      <PageHeader title="Postar conclusão" back={`/grupos/${g.id}`} />
      <form onSubmit={submit} className="mt-5 space-y-6" noValidate>
        <ErrorSummary errors={Object.values(errs)} />
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
        <div>
          <p className="mb-2 text-[15px] font-medium">Foto</p>
          <PhotoPicker value={img} onChange={setImg} required capture />
          {errs.img && <p className="mt-1.5 text-[13px] font-medium text-danger">{errs.img}</p>}
        </div>
        <Field id="txt" label="Texto (opcional)"><textarea id="txt" rows={3} value={text} onChange={(e) => setText(e.target.value)} className={inputCls + ' py-3 leading-6'} placeholder="Conte como foi" /></Field>
        <Notice icon={Info}>Publicar não marca nenhum hábito seu. Para registrar, vá em <Link to="/hoje" className="underline">Hoje</Link>.</Notice>
        <button className={btn('primary', 'w-full')}>{sel ? `Publicar conclusão · +${sel.points} pts` : 'Publicar conclusão'}</button>
      </form>
    </>
  )
}
