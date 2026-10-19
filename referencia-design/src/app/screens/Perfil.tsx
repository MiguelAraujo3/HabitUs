import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { LogOut, Pencil, UserX } from 'lucide-react'
import { PostCard } from '../lib'
import { useStore } from '../store'
import { Avatar, CategoryChip, Empty, ErrorSummary, Field, PageHeader, SectionTitle, btn, inputCls } from '../ui'

export function Perfil() {
  const { usuario } = useParams()
  const { me, users, habits, groups, posts, logout } = useStore()
  const nav = useNavigate()
  const own = !usuario || usuario === me?.username
  const u = own ? me : users.find((x) => x.username === usuario)
  if (!u)
    return (
      <>
        <PageHeader title="Perfil" back="/feed" />
        <div className="mt-6"><Empty icon={UserX} title="Perfil não encontrado" text={`Não existe o @${usuario}.`} action={<Link to="/feed" className={btn('primary')}>Voltar ao feed</Link>} /></div>
      </>
    )
  const myHabits = own ? habits.map((h) => ({ name: h.name, cat: h.cat })) : (u.habits ?? [])
  const userGroups = groups.filter((g) => g.members.some((m) => m.userId === u.id)).length
  const userPosts = posts.filter((p) => p.userId === u.id)
  const done = userPosts.filter((p) => p.groupId).length

  const stats = [
    { n: myHabits.length, l: 'Hábitos ativos' },
    { n: userGroups, l: 'Grupos' },
    { n: done, l: 'Atividades feitas' },
  ]
  return (
    <>
      {!own && <PageHeader title={`@${u.username}`} back="/feed" />}
      <section className="flex flex-col items-center pt-8 text-center">
        <Avatar name={u.name} size={96} />
        <h1 className="mt-4 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{u.name}</h1>
        <p className="text-[16px] text-ink-2">@{u.username}</p>
        {u.bio && <p className="mt-3 max-w-[44ch] text-[16px] leading-[22px]">{u.bio}</p>}
        {own && <Link to="/perfil/editar" className={btn('secondary', 'mt-4 min-h-11 px-5 text-[15px]')}><Pencil size={16} aria-hidden />Editar perfil</Link>}
      </section>
      <dl className="mt-6 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.l} className="rounded-[14px] bg-surface p-3 text-center">
            <dd className="tnum text-[28px] leading-8 font-bold">{s.n}</dd>
            <dt className="mt-0.5 text-[12px] leading-4 font-medium text-ink-2">{s.l}</dt>
          </div>
        ))}
      </dl>
      <SectionTitle>Hábitos</SectionTitle>
      {myHabits.length === 0 ? (
        <p className="rounded-[14px] bg-surface p-4 text-[15px] text-ink-2">{own ? 'Você ainda não criou hábitos.' : 'Nenhum hábito por aqui.'}</p>
      ) : (
        <ul className="divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface">
          {myHabits.map((h) => <li key={h.name} className="flex items-center justify-between gap-3 px-4 py-3.5"><span className="text-[16px] font-medium">{h.name}</span><CategoryChip cat={h.cat} /></li>)}
        </ul>
      )}
      <SectionTitle>Postagens</SectionTitle>
      {userPosts.length === 0 ? (
        <p className="rounded-[14px] bg-surface p-4 text-[15px] text-ink-2">Nenhuma postagem ainda.</p>
      ) : (
        <div className="space-y-3">{userPosts.map((p) => <PostCard key={p.id} post={p} />)}</div>
      )}
      {own && <button onClick={() => { logout(); nav('/login') }} className={btn('secondary', 'mt-10 w-full')}><LogOut size={18} aria-hidden />Sair da conta</button>}
    </>
  )
}

export function EditarPerfil() {
  const { me, users, updateProfile, notify } = useStore()
  const nav = useNavigate()
  const [name, setName] = useState(me?.name ?? '')
  const [username, setUsername] = useState(me?.username ?? '')
  const [bio, setBio] = useState(me?.bio ?? '')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (name.trim().length < 2) er.name = 'Informe seu nome.'
    if (!/^[a-z0-9._]{3,20}$/.test(username)) er.username = 'Use de 3 a 20 letras minúsculas, números, ponto ou sublinhado.'
    else if (users.some((u) => u.username === username && u.id !== me?.id)) er.username = 'Esse @usuário já está em uso.'
    setErrs(er)
    if (Object.keys(er).length) return
    updateProfile({ name: name.trim(), username, bio: bio.trim() })
    notify('Perfil atualizado')
    nav('/perfil')
  }
  return (
    <>
      <PageHeader title="Editar perfil" back="/perfil" />
      <form onSubmit={submit} className="mt-5 space-y-5" noValidate>
        <div className="flex flex-col items-center gap-2 py-2"><Avatar name={name || '?'} size={88} /><p className="text-[13px] text-ink-2">O avatar usa as iniciais do seu nome.</p></div>
        <ErrorSummary errors={Object.values(errs)} />
        <Field id="nome" label="Nome" error={errs.name}><input id="nome" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} aria-invalid={!!errs.name} /></Field>
        <Field id="user" label="@usuário" error={errs.username}>
          <div className="relative"><span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2">@</span><input id="user" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/^@/, ''))} className={inputCls + ' pl-8'} autoCapitalize="none" aria-invalid={!!errs.username} /></div>
        </Field>
        <Field id="bio" label="Descrição" count={`${bio.length}/160`}><textarea id="bio" rows={4} maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} className={inputCls + ' py-3 leading-6'} /></Field>
        <div className="grid grid-cols-2 gap-2"><Link to="/perfil" className={btn('secondary')}>Cancelar</Link><button className={btn('primary')}>Salvar</button></div>
      </form>
    </>
  )
}
