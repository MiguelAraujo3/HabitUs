import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Eye, EyeOff, Flame, Users } from 'lucide-react'
import { useStore } from '../store'
import { ErrorSummary, Field, Logo, btn, inputCls } from '../ui'

export const safeBack = (v: string | null) => (v && v.startsWith('/') && !v.startsWith('//') ? v : '/hoje')

function AuthFrame({ title, sub, children, footer }: { title: string; sub: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-dvh md:grid-cols-[1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-black p-12 text-white md:flex">
        <Logo size={26} />
        <div>
          <p className="text-[56px] leading-[58px] font-bold tracking-[-0.035em]">Pequenos hábitos.<br /><span className="text-lime">Grandes grupos.</span></p>
          <p className="mt-5 max-w-[34ch] text-[18px] leading-7 text-white/70">Registre o que você faz todo dia, entre em grupos e acompanhe o ranking com quem importa.</p>
        </div>
        <ul className="space-y-3 text-[15px] text-white/80">
          <li className="flex items-center gap-3"><Flame size={18} className="text-coral" aria-hidden />Sequências que contam cada conclusão</li>
          <li className="flex items-center gap-3"><Users size={18} className="text-cyan" aria-hidden />Grupos com ranking de pontos</li>
        </ul>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 md:hidden"><Logo size={26} /></div>
          <h1 className="text-[34px] leading-[41px] font-bold tracking-[-0.02em]">{title}</h1>
          <p className="mt-1 mb-7 text-[16px] text-ink-2">{sub}</p>
          {children}
          <p className="mt-6 text-center text-[16px] text-ink-2">{footer}</p>
        </div>
      </div>
    </div>
  )
}

function PasswordInput({ id, value, onChange, error, autoComplete }: { id: string; value: string; onChange: (v: string) => void; error?: boolean; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls + ' pr-12'} autoComplete={autoComplete} aria-invalid={error} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'} className="absolute top-0 right-0 flex size-12 items-center justify-center text-ink-2">
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}

export function Login() {
  const { login, me } = useStore()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const back = safeBack(sp.get('voltar'))
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    window.setTimeout(() => {
      if (login(id, pw)) nav(back, { replace: true })
      else {
        setErr('E-mail/usuário ou senha incorretos.')
        setBusy(false)
      }
    }, 450)
  }

  return (
    <AuthFrame
      title="Entrar"
      sub={me ? `Você já está conectada como @${me.username}.` : 'Continue de onde parou.'}
      footer={<>Não tem conta? <Link className="font-semibold text-action" to={`/cadastro?voltar=${encodeURIComponent(back)}`}>Criar conta</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {err && <div role="alert" className="rounded-[12px] bg-danger-tint px-4 py-3 text-[15px] font-medium text-danger">{err}</div>}
        <Field id="id" label="E-mail ou @usuário"><input id="id" value={id} onChange={(e) => setId(e.target.value)} className={inputCls} autoComplete="username" autoCapitalize="none" /></Field>
        <Field id="pw" label="Senha"><PasswordInput id="pw" value={pw} onChange={setPw} autoComplete="current-password" /></Field>
        <button className={btn('primary', 'w-full')} disabled={busy || !id || !pw}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
      <div className="mt-6 rounded-[12px] bg-surface-2 p-3.5 text-[13px] leading-[18px] text-ink-2">
        <b className="text-ink">Protótipo.</b> Use <code>marinaduarte</code> e <code>habitus123</code> para entrar.
      </div>
    </AuthFrame>
  )
}

export function Cadastro() {
  const { signup, users } = useStore()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', username: '', email: '', pw: '' })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (f.name.trim().length < 2) er.name = 'Informe seu nome.'
    if (!/^[a-z0-9._]{3,20}$/.test(f.username)) er.username = 'Use de 3 a 20 letras minúsculas, números, ponto ou sublinhado.'
    else if (users.some((u) => u.username === f.username && u.id !== 'u-me')) er.username = 'Esse @usuário já está em uso.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Informe um e-mail válido.'
    if (f.pw.length < 8) er.pw = 'A senha precisa ter ao menos 8 caracteres.'
    setErrs(er)
    if (Object.keys(er).length) return
    signup({ name: f.name.trim(), username: f.username })
    nav(safeBack(sp.get('voltar')), { replace: true })
  }
  const back = safeBack(sp.get('voltar'))
  const hasErr = Object.keys(errs).length > 0
  return (
    <AuthFrame
      title="Criar conta"
      sub="Leva menos de um minuto."
      footer={<>Já tem conta? <Link className="font-semibold text-action" to={`/login?voltar=${encodeURIComponent(back)}`}>Entrar</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {hasErr && <ErrorSummary errors={Object.values(errs)} />}
        <Field id="name" label="Nome" error={errs.name}><input id="name" value={f.name} onChange={(e) => set('name')(e.target.value)} className={inputCls} autoComplete="name" aria-invalid={!!errs.name} /></Field>
        <Field id="username" label="@usuário" error={errs.username} hint="Seu nome público, como @marinaduarte.">
          <div className="relative"><span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2">@</span>
            <input id="username" value={f.username} onChange={(e) => set('username')(e.target.value.toLowerCase().replace(/^@/, ''))} className={inputCls + ' pl-8'} autoCapitalize="none" aria-invalid={!!errs.username} /></div>
        </Field>
        <Field id="email" label="E-mail" error={errs.email}><input id="email" type="email" value={f.email} onChange={(e) => set('email')(e.target.value)} className={inputCls} autoComplete="email" aria-invalid={!!errs.email} /></Field>
        <Field id="pw" label="Senha" error={errs.pw} hint="Mínimo de 8 caracteres."><PasswordInput id="pw" value={f.pw} onChange={set('pw')} error={!!errs.pw} autoComplete="new-password" /></Field>
        <button className={btn('primary', 'w-full')}>Criar conta</button>
      </form>
    </AuthFrame>
  )
}
