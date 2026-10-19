import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Camera, Heart, MessageCircle, Trash2, X } from 'lucide-react'
import type { Post } from './data'
import { useStore } from './store'
import { Avatar, CategoryChip, cx } from './ui'

export function compressImage(file: File, max = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => reject(new Error('Imagem inválida'))
    img.src = url
  })
}

export function PhotoPicker({ value, onChange, required, capture }: { value: string; onChange: (v: string) => void; required?: boolean; capture?: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  const [err, setErr] = useState('')
  const pick = async (f?: File) => {
    if (!f) return
    try {
      setErr('')
      onChange(await compressImage(f))
    } catch {
      setErr('Não foi possível ler essa imagem. Tente outro arquivo.')
    }
  }
  return (
    <div>
      <input ref={ref} type="file" accept="image/*" capture={capture ? 'environment' : undefined} className="sr-only" id="foto" onChange={(e) => pick(e.target.files?.[0])} />
      {value ? (
        <div className="relative overflow-hidden rounded-[14px] bg-surface-2">
          <img src={value} alt="Prévia da foto selecionada" className="aspect-[4/3] w-full object-cover" />
          <button type="button" onClick={() => onChange('')} aria-label="Remover foto" className="press absolute top-2 right-2 flex size-11 items-center justify-center rounded-full bg-black/70 text-white"><X size={18} /></button>
        </div>
      ) : (
        <label htmlFor="foto" className="press flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-line bg-surface text-[15px] font-medium text-ink-2 hover:bg-surface-2">
          <Camera size={26} aria-hidden />
          {required ? 'Tirar ou escolher uma foto' : 'Adicionar foto (opcional)'}
        </label>
      )}
      {err && <p role="alert" className="mt-1.5 text-[13px] font-medium text-danger">{err}</p>}
    </div>
  )
}

export function PostCard({ post, detail, onDelete }: { post: Post; detail?: boolean; onDelete?: () => void }) {
  const { userById, toggleLike, groups, me } = useStore()
  const u = userById(post.userId)
  if (!u) return null
  const g = post.groupId ? groups.find((x) => x.id === post.groupId) : undefined
  const act = g?.activities.find((a) => a.id === post.activityId)
  return (
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
  )
}
