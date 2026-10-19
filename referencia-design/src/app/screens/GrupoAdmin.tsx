import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { AlertTriangle, Ban, CalendarX2, Check, CircleHelp, Lock, PartyPopper, Plus, RotateCcw, Trash2, UserCheck, Users } from 'lucide-react'
import { TODAY, fmtDate, statusOf, type Activity } from '../data'
import { useStore } from '../store'
import { Avatar, Card, CategoryChip, Empty, ErrorSummary, Field, Logo, Notice, PageHeader, SectionTitle, Sheet, SheetActions, SheetBody, Stepper, btn, inputCls } from '../ui'
import { useSearchParams } from 'react-router'

export function GrupoGerenciar() {
  const { id } = useParams()
  const { groups, me, posts, userById, updateGroup, removeMember, deletePost, deleteGroup, notify } = useStore()
  const nav = useNavigate()
  const g = groups.find((x) => x.id === id)
  const [acts, setActs] = useState<Activity[] | null>(null)
  const [end, setEnd] = useState<string | null>(null)
  const [errs, setErrs] = useState<string[]>([])
  const [sheet, setSheet] = useState<null | { kind: 'member' | 'post' | 'delete' | 'reopen'; id?: string }>(null)

  if (!g || g.ownerId !== me?.id) return <Navigate to={g ? `/grupos/${g.id}` : '/grupos'} replace />
  const closed = statusOf(g) === 'encerrado'
  const list = acts ?? g.activities
  const endV = end ?? g.end
  const comp = posts.filter((p) => p.groupId === g.id)
  const upd = (i: number, p: Partial<Activity>) => setActs(list.map((a, k) => (k === i ? { ...a, ...p } : a)))
  const dirty = acts !== null || end !== null

  const validate = () => {
    const e: string[] = []
    if (endV <= g.start) e.push('A data final precisa ser depois do início.')
    if (!closed && list.filter((a) => a.name.trim()).length === 0) e.push('Mantenha ao menos uma atividade com nome.')
    setErrs(e)
    return e.length === 0
  }
  const commit = () => {
    updateGroup(g.id, { end: endV, ...(closed ? {} : { activities: list.filter((a) => a.name.trim()) }) })
    setActs(null); setEnd(null); setSheet(null)
    notify('Alterações salvas')
  }
  const save = () => {
    if (!validate()) return
    if (closed && endV >= TODAY) return setSheet({ kind: 'reopen' })
    commit()
  }
  const target = sheet?.kind === 'member' ? userById(sheet.id!) : null
  const tpost = sheet?.kind === 'post' ? posts.find((p) => p.id === sheet.id) : null

  return (
    <>
      <PageHeader title="Gerenciar grupo" back={`/grupos/${g.id}`} />
      <div className="pt-5">
        <h2 className="text-[22px] font-bold">{g.name}</h2>
        {closed && <div className="mt-3"><Notice icon={Lock}>Grupo encerrado. Atividades, membros e postagens estão em leitura. Você pode alterar a data final ou excluir o grupo.</Notice></div>}
        <div className="mt-3"><ErrorSummary errors={errs} /></div>
      </div>

      <SectionTitle>Data final</SectionTitle>
      <Card>
        <Field id="fim" label="Encerra em" hint={closed ? 'Se a nova data for futura, o grupo é reaberto com membros, feed, ranking e pontos preservados.' : undefined}>
          <input id="fim" type="date" value={endV} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
        </Field>
      </Card>

      <SectionTitle>Atividades</SectionTitle>
      {closed ? (
        <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">{g.activities.map((a) => <li key={a.id} className="flex justify-between px-4 py-3.5 text-[16px]"><span>{a.name}</span><b className="tnum">+{a.points} pts</b></li>)}</ul>
      ) : (
        <>
          <ul className="space-y-2">
            {list.map((a, i) => (
              <li key={a.id} className="rounded-[14px] bg-surface p-3">
                <div className="flex items-center gap-2">
                  <input aria-label={`Nome da atividade ${i + 1}`} value={a.name} onChange={(e) => upd(i, { name: e.target.value })} className={inputCls} />
                  {list.length > 1 && <button onClick={() => setActs(list.filter((_, k) => k !== i))} aria-label={`Remover ${a.name || 'atividade'}`} className="press flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"><Trash2 size={18} /></button>}
                </div>
                <div className="mt-2 flex items-center justify-between"><span className="text-[14px] text-ink-2">Pontos</span><Stepper label="pontos" value={a.points} min={1} max={10} onChange={(n) => upd(i, { points: n })} /></div>
              </li>
            ))}
          </ul>
          <button onClick={() => setActs([...list, { id: `na${Date.now()}`, name: '', points: 3 }])} className={btn('ghost', 'mt-2 min-h-11 w-full')}><Plus size={18} aria-hidden />Adicionar atividade</button>
          <p className="mt-1 px-1 text-[13px] text-ink-2">A nova pontuação vale apenas para conclusões feitas dali em diante.</p>
        </>
      )}
      {dirty && <div className="sticky bottom-[68px] z-10 mt-4 md:bottom-4"><button onClick={save} className={btn('primary', 'w-full shadow-lg')}>Salvar alterações</button></div>}

      <SectionTitle>Membros ({g.members.length})</SectionTitle>
      <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
        {g.members.map((m) => {
          const u = userById(m.userId)!
          const own = u.id === g.ownerId
          return (
            <li key={u.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={u.name} size={38} />
              <div className="min-w-0 flex-1 leading-5"><b className="block truncate text-[16px] font-semibold">{u.name}</b><span className="text-[13px] text-ink-2">{own ? 'Dono' : `@${u.username}`}</span></div>
              {!own && !closed && <button onClick={() => setSheet({ kind: 'member', id: u.id })} className="press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint">Remover</button>}
            </li>
          )
        })}
      </ul>
      {g.blocked.length > 0 && <p className="mt-2 px-1 text-[13px] text-ink-2">{g.blocked.length} {g.blocked.length === 1 ? 'pessoa bloqueada' : 'pessoas bloqueadas'} permanentemente.</p>}

      <SectionTitle>Conclusões ({comp.length})</SectionTitle>
      {comp.length === 0 ? <p className="rounded-[14px] bg-surface p-4 text-[15px] text-ink-2">Nenhuma conclusão publicada.</p> : (
        <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
          {comp.map((p) => {
            const u = userById(p.userId)!
            const a = g.activities.find((x) => x.id === p.activityId)
            return (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={u.name} size={36} />
                <div className="min-w-0 flex-1 text-[15px] leading-5"><b className="font-semibold">{u.name}</b><p className="truncate text-ink-2">{a?.name} · +{p.points} pts · {p.ago}</p></div>
                {!closed && <button onClick={() => setSheet({ kind: 'post', id: p.id })} aria-label={`Excluir conclusão de ${u.name}`} className="press flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"><Trash2 size={18} /></button>}
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-10 rounded-[18px] border border-danger/30 bg-danger-tint p-4">
        <h2 className="flex items-center gap-2 text-[17px] font-semibold text-danger"><AlertTriangle size={18} aria-hidden />Zona de perigo</h2>
        <p className="mt-1 text-[14px] leading-5 text-danger/90">Excluir o grupo apaga membros, ranking, feed e conclusões para todo mundo.</p>
        <button onClick={() => setSheet({ kind: 'delete' })} className={btn('dangerSolid', 'mt-3 w-full')}>Excluir grupo</button>
      </div>

      <Sheet open={sheet?.kind === 'member' && !!target} onClose={() => setSheet(null)} title={`Remover ${target?.name.split(' ')[0] ?? ''}?`}>
        <SheetBody><p>A pessoa perde todos os pontos e fica <b className="text-ink">bloqueada permanentemente</b>, sem poder voltar por convite.</p></SheetBody>
        <SheetActions><button className={btn('dangerSolid')} onClick={() => { removeMember(g.id, sheet!.id!); setSheet(null); notify('Membro removido e bloqueado') }}>Remover e bloquear</button><button className={btn('secondary')} onClick={() => setSheet(null)}>Cancelar</button></SheetActions>
      </Sheet>
      <Sheet open={!!tpost} onClose={() => setSheet(null)} title="Excluir conclusão?">
        <SheetBody><p>Os <b className="text-ink">{tpost?.points} pontos</b> concedidos por essa conclusão serão descontados do ranking de {tpost && userById(tpost.userId)?.name}.</p></SheetBody>
        <SheetActions><button className={btn('dangerSolid')} onClick={() => { deletePost(sheet!.id!); setSheet(null); notify('Conclusão excluída e pontos descontados') }}>Excluir e descontar pontos</button><button className={btn('secondary')} onClick={() => setSheet(null)}>Cancelar</button></SheetActions>
      </Sheet>
      <Sheet open={sheet?.kind === 'delete'} onClose={() => setSheet(null)} title="Excluir este grupo?">
        <SheetBody><p>Essa ação é <b className="text-ink">permanente</b>. {g.members.length} {g.members.length === 1 ? 'membro perde' : 'membros perdem'} o acesso a {g.name}.</p></SheetBody>
        <SheetActions><button className={btn('dangerSolid')} onClick={() => { deleteGroup(g.id); notify('Grupo excluído'); nav('/grupos', { replace: true }) }}>Excluir grupo</button><button className={btn('secondary')} onClick={() => setSheet(null)}>Cancelar</button></SheetActions>
      </Sheet>
      <Sheet open={sheet?.kind === 'reopen'} onClose={() => setSheet(null)} title="Reabrir o grupo?">
        <SheetBody><p>Com a data final em <b className="text-ink">{fmtDate(endV, true)}</b>, o grupo volta a ficar em andamento. Membros, feed, ranking e pontos são mantidos; convites e conclusões são retomados.</p></SheetBody>
        <SheetActions><button className={btn('primary')} onClick={commit}><RotateCcw size={18} aria-hidden />Reabrir e salvar</button><button className={btn('secondary')} onClick={() => setSheet(null)}>Cancelar</button></SheetActions>
      </Sheet>
    </>
  )
}

export function Convite() {
  const { codigo } = useParams()
  const { groups, me, joinGroup, userById, notify } = useStore()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const g = groups.find((x) => x.code === codigo)
  const back = `/convite/${codigo}`

  type S = { icon: typeof Users; tone: string; title: string; text: string; cta: React.ReactNode }
  let s: S
  if (!g) {
    s = { icon: CircleHelp, tone: 'bg-surface-2 text-ink-2', title: 'Convite inválido', text: 'Esse link não leva a nenhum grupo. Peça um novo link a quem convidou você.', cta: <Link to={me ? '/grupos' : '/login'} className={btn('primary', 'w-full')}>{me ? 'Ir para Grupos' : 'Entrar'}</Link> }
  } else if (!me) {
    s = { icon: Users, tone: 'bg-lime text-black', title: 'Você foi convidado para um grupo no HabitUs', text: 'Entre ou crie sua conta para ver o grupo e participar. Você volta para este convite em seguida.', cta: (<><Link to={`/login?voltar=${encodeURIComponent(back)}`} className={btn('primary', 'w-full')}>Entrar para aceitar</Link><Link to={`/cadastro?voltar=${encodeURIComponent(back)}`} className={btn('secondary', 'w-full')}>Criar conta</Link></>) }
  } else if (g.blocked.includes(me.id)) {
    s = { icon: Ban, tone: 'bg-danger-tint text-danger', title: 'Você não pode entrar neste grupo', text: 'O dono do grupo removeu você, e o acesso não pode ser recuperado por convite.', cta: <Link to="/grupos" className={btn('secondary', 'w-full')}>Voltar para Grupos</Link> }
  } else if (g.members.some((m) => m.userId === me.id)) {
    s = { icon: UserCheck, tone: 'bg-action-tint text-action', title: 'Você já está neste grupo', text: `Você já participa de ${g.name}.`, cta: <Link to={`/grupos/${g.id}`} className={btn('primary', 'w-full')}>Abrir grupo</Link> }
  } else if (statusOf(g) === 'encerrado') {
    s = { icon: CalendarX2, tone: 'bg-surface-2 text-closed', title: 'Convites encerrados', text: `${g.name} terminou em ${fmtDate(g.end, true)} e não aceita novos membros.`, cta: <Link to="/grupos" className={btn('secondary', 'w-full')}>Voltar para Grupos</Link> }
  } else {
    const left = g.left.includes(me.id)
    s = { icon: PartyPopper, tone: 'bg-lime text-black', title: left ? `Quer voltar para ${g.name}?` : `Entrar em ${g.name}?`, text: left ? 'Você saiu deste grupo antes. Ao voltar, começa de novo com zero pontos.' : `${userById(g.ownerId)?.name} convidou você para este grupo.`, cta: <button className={btn('primary', 'w-full')} onClick={() => { joinGroup(g.id); notify(`Você entrou em ${g.name}`); nav(`/grupos/${g.id}`, { replace: true }) }}>{left ? 'Voltar para o grupo' : 'Entrar no grupo'}</button> }
  }
  const Icon = s.icon
  const showMeta = !!g && !!me && !g.blocked.includes(me.id)
  return (
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
  )
}

export function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Empty icon={CircleHelp} title="Página não encontrada" text="O endereço não existe ou foi movido." action={<Link to="/hoje" className={btn('primary')}>Ir para Hoje</Link>} />
    </div>
  )
}
