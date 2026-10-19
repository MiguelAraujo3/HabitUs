import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { Info, Newspaper, Plus, Search, Send, X } from 'lucide-react'
import { catOf } from '../data'
import { PhotoPicker, PostCard } from '../lib'
import { useStore } from '../store'
import { Avatar, BigTitle, Card, CategoryChip, Empty, ErrorState, ErrorSummary, Field, Notice, PageHeader, Sheet, SheetActions, SheetBody, Skeleton, btn, cx, inputCls } from '../ui'

export function Feed() {
  const { posts, users, me } = useStore()
  const [sp] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(sp.get('estado') === 'erro')
  const [limit, setLimit] = useState(6)
  const [more, setMore] = useState(false)
  const [moreErr, setMoreErr] = useState(false)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 550)
    return () => window.clearTimeout(t)
  }, [])

  const term = q.trim().replace(/^@/, '').toLowerCase()
  const matches = term ? users.filter((u) => u.username.toLowerCase().includes(term) || u.name.toLowerCase().includes(term)) : []
  const list = term ? posts.filter((p) => matches.some((u) => u.id === p.userId)) : posts
  const shown = term ? list : list.slice(0, limit)

  const loadMore = () => {
    if (!navigator.onLine) return setMoreErr(true)
    setMoreErr(false)
    setMore(true)
    window.setTimeout(() => { setLimit((l) => l + 3); setMore(false) }, 600)
  }

  return (
    <>
      <BigTitle
        title="Feed"
        sub="O que está acontecendo nos hábitos de todo mundo."
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Buscar usuários" className="press flex size-11 items-center justify-center rounded-full bg-surface text-ink md:hidden">{open ? <X size={20} /> : <Search size={20} />}</button>
            <Link to="/feed/nova" className={btn('primary', 'min-h-11 px-4 text-[15px]')}><Plus size={18} aria-hidden /><span className="hidden sm:inline">Nova postagem</span><span className="sm:hidden">Postar</span></Link>
          </div>
        }
      />
      <div className={cx('mb-4', open ? 'block' : 'hidden md:block')}>
        <label className="sr-only" htmlFor="busca">Buscar por @usuário</label>
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2" aria-hidden />
          <input id="busca" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por @usuário" className="min-h-11 w-full rounded-[12px] bg-surface-2 pr-10 pl-10 text-[16px] placeholder:text-ink-2 focus:outline-2 focus:outline-action" autoFocus={open} />
          {q && <button onClick={() => setQ('')} aria-label="Limpar busca" className="absolute top-0 right-0 flex size-11 items-center justify-center text-ink-2"><X size={18} /></button>}
        </div>
      </div>

      {term && matches.length > 0 && (
        <ul className="mb-4 divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
          {matches.map((u) => (
            <li key={u.id}><Link to={u.id === me?.id ? '/perfil' : `/u/${u.username}`} className="flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-surface-2"><Avatar name={u.name} size={36} /><span className="leading-5"><b className="block text-[16px] font-semibold">{u.name}</b><span className="text-[13px] text-ink-2">@{u.username}</span></span></Link></li>
          ))}
        </ul>
      )}

      {failed ? (
        <ErrorState onRetry={() => { setFailed(false); setLoading(true); window.setTimeout(() => setLoading(false), 500) }} />
      ) : loading ? (
        <Skeleton rows={3} photo />
      ) : term && matches.length === 0 ? (
        <Empty icon={Search} title="Nenhum @usuário encontrado" text={`Não achamos ninguém para “${q}”. Confira a grafia do @usuário.`} action={<button className={btn('secondary')} onClick={() => setQ('')}>Limpar busca</button>} />
      ) : shown.length === 0 ? (
        <Empty icon={Newspaper} title="Nada por aqui ainda" text="Quando alguém publicar, aparece aqui. Que tal abrir a conversa?" action={<Link to="/feed/nova" className={btn('primary')}>Nova postagem</Link>} />
      ) : (
        <div className="space-y-3">
          {shown.map((p) => <PostCard key={p.id} post={p} />)}
          {!term && limit < list.length && (
            moreErr ? <ErrorState onRetry={loadMore} /> : (
              <button onClick={loadMore} disabled={more} className={btn('secondary', 'w-full')} aria-busy={more}>{more ? 'Carregando…' : 'Carregar mais'}</button>
            )
          )}
          {!term && limit >= list.length && <p className="py-4 text-center text-[14px] text-ink-2">Você viu tudo por enquanto.</p>}
        </div>
      )}
    </>
  )
}

export function NovaPostagem() {
  const { habits, addPost, notify } = useStore()
  const nav = useNavigate()
  const [hid, setHid] = useState('')
  const [text, setText] = useState('')
  const [img, setImg] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})

  if (habits.length === 0)
    return (
      <>
        <PageHeader title="Nova postagem" back="/feed" />
        <div className="mt-6"><Empty icon={Plus} title="Crie um hábito para postar" text="Suas postagens são ligadas a um hábito seu. Comece criando o primeiro." action={<Link to="/habitos/novo" className={btn('primary')}>Criar hábito</Link>} /></div>
      </>
    )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!hid) er.hid = 'Escolha o hábito da postagem.'
    if (!text.trim()) er.text = 'Escreva algo sobre o seu dia.'
    setErrs(er)
    if (Object.keys(er).length) return
    const h = habits.find((x) => x.id === hid)!
    addPost({ text: text.trim(), cat: h.cat, habit: h.name, img: img || undefined })
    notify('Postagem publicada')
    nav('/feed')
  }

  return (
    <>
      <PageHeader title="Nova postagem" back="/feed" />
      <form onSubmit={submit} className="mt-5 space-y-5" noValidate>
        <ErrorSummary errors={Object.values(errs)} />
        <Field id="hid" label="Hábito" error={errs.hid}>
          <select id="hid" value={hid} onChange={(e) => setHid(e.target.value)} className={inputCls} aria-invalid={!!errs.hid}>
            <option value="">Selecione um hábito</option>
            {habits.map((h) => <option key={h.id} value={h.id}>{h.name} · {catOf(h.cat).label}</option>)}
          </select>
        </Field>
        <Field id="text" label="Texto" error={errs.text}>
          <textarea id="text" rows={5} value={text} onChange={(e) => setText(e.target.value)} className={inputCls + ' py-3 leading-6'} placeholder="Como foi hoje?" aria-invalid={!!errs.text} />
        </Field>
        <PhotoPicker value={img} onChange={setImg} />
        <Notice icon={Info}>Postar não marca o hábito como cumprido. Para registrar, vá em <Link to="/hoje" className="underline">Hoje</Link>.</Notice>
        <button className={btn('primary', 'w-full')}>Publicar</button>
      </form>
    </>
  )
}

export function PostDetalhe() {
  const { id } = useParams()
  const { posts, deletePost, addComment, userById, me, groups, ranking, notify } = useStore()
  const nav = useNavigate()
  const [c, setC] = useState('')
  const [del, setDel] = useState(false)
  const post = posts.find((p) => p.id === id)
  if (!post)
    return (
      <>
        <PageHeader title="Postagem" back="/feed" />
        <div className="mt-6"><Empty icon={Newspaper} title="Postagem não encontrada" text="Ela pode ter sido excluída pelo autor ou pelo dono do grupo." action={<Link to="/feed" className={btn('primary')}>Voltar ao feed</Link>} /></div>
      </>
    )
  const g = post.groupId ? groups.find((x) => x.id === post.groupId) : undefined
  const canDelete = post.userId === me?.id || g?.ownerId === me?.id
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!c.trim()) return
    addComment(post.id, c.trim())
    setC('')
  }
  return (
    <>
      <PageHeader title="Postagem" back="/feed" />
      <div className="mt-4 space-y-4">
        <PostCard post={post} detail onDelete={canDelete ? () => setDel(true) : undefined} />
        <section aria-label="Comentários">
          <h2 className="mb-2 px-1 text-[17px] font-semibold">Comentários <span className="tnum text-ink-2">({post.comments.length})</span></h2>
          {post.comments.length === 0 ? (
            <Card className="text-center text-[15px] text-ink-2">Seja a primeira pessoa a comentar.</Card>
          ) : (
            <ul className="divide-y divide-line/70 rounded-[14px] bg-surface">
              {post.comments.map((cm) => {
                const u = userById(cm.userId)
                return (
                  <li key={cm.id} className="flex gap-3 p-4">
                    <Avatar name={u?.name ?? '?'} size={36} />
                    <div className="min-w-0 text-[16px] leading-[22px]"><p><b className="font-semibold">{u?.name}</b> <span className="text-[13px] text-ink-2">{cm.ago}</span></p><p className="break-words">{cm.text}</p></div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
      <form onSubmit={submit} className="sticky bottom-[68px] z-10 mt-4 -mx-4 flex gap-2 border-t border-line bg-bg/92 px-4 py-3 backdrop-blur-lg md:bottom-0 md:mx-0 md:rounded-t-[14px]">
        <label className="sr-only" htmlFor="coment">Escrever comentário</label>
        <input id="coment" value={c} onChange={(e) => setC(e.target.value)} placeholder="Escreva um comentário" className={inputCls + ' rounded-full'} />
        <button className="press flex size-12 shrink-0 items-center justify-center rounded-full bg-action text-white disabled:opacity-40" disabled={!c.trim()} aria-label="Enviar comentário"><Send size={19} /></button>
      </form>

      <Sheet open={del} onClose={() => setDel(false)} title="Excluir postagem?">
        <SheetBody>
          {post.points && g ? (
            <p>Esta é uma conclusão do grupo <b className="text-ink">{g.name}</b>. Ao excluir, <b className="text-ink">{post.points} pontos serão descontados</b> do ranking de {userById(post.userId)?.name}.</p>
          ) : (
            <p>Essa ação é irreversível. A postagem e os comentários serão removidos.</p>
          )}
        </SheetBody>
        <SheetActions>
          <button className={btn('dangerSolid')} onClick={() => { deletePost(post.id); notify(post.points ? 'Conclusão excluída e pontos descontados' : 'Postagem excluída'); nav(-1) }}>Excluir postagem</button>
          <button className={btn('secondary')} onClick={() => setDel(false)}>Cancelar</button>
        </SheetActions>
      </Sheet>
    </>
  )
}
