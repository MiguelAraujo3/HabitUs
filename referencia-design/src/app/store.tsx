import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ME, SEED_GROUPS, SEED_HABITS, SEED_POSTS, SEED_USERS, TODAY, statusOf,
  type Group, type Habit, type Post, type User, type Activity,
} from './data'

interface Ranked { user: User; points: number; pos: number }

interface Store {
  me: User | null
  users: User[]
  habits: Habit[]
  posts: Post[]
  groups: Group[]
  toast: string
  notify: (msg: string) => void
  userById: (id: string) => User | undefined
  login: (id: string, pw: string) => boolean
  signup: (u: { name: string; username: string }) => void
  logout: () => void
  updateProfile: (p: Pick<User, 'name' | 'username' | 'bio'>) => void
  saveHabit: (h: Omit<Habit, 'id' | 'markedToday' | 'weekCount' | 'streak'> & { id?: string }) => string
  deleteHabit: (id: string) => void
  toggleHabit: (id: string) => void
  addPost: (p: Pick<Post, 'text' | 'cat' | 'habit' | 'img'>) => string
  addCompletion: (g: Group, a: Activity, text: string, img: string) => string
  deletePost: (id: string) => void
  toggleLike: (id: string) => void
  addComment: (id: string, text: string) => void
  createGroup: (g: Omit<Group, 'id' | 'code' | 'ownerId' | 'members' | 'blocked' | 'left'>) => string
  updateGroup: (id: string, patch: Partial<Group>) => void
  joinGroup: (id: string) => void
  leaveGroup: (id: string) => void
  removeMember: (gid: string, uid: string) => void
  deleteGroup: (id: string) => void
  ranking: (g: Group) => Ranked[]
  pointsOf: (g: Group, uid: string) => number
}

const Ctx = createContext<Store | null>(null)
export const useStore = () => {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider ausente')
  return s
}

let seq = 100
const nid = (p: string) => `${p}${++seq}`
const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function StoreProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<User | null>(SEED_USERS[0])
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS)
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [groups, setGroups] = useState<Group[]>(SEED_GROUPS)
  const [toast, setToast] = useState('')
  const timer = useRef<number>(0)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 3200)
  }, [])

  const userById = useCallback((id: string) => users.find((u) => u.id === id), [users])
  const setMeAndUsers = (u: User) => {
    setMe(u)
    setUsers((list) => list.map((x) => (x.id === ME ? u : x)))
  }

  const login = (id: string, pw: string) => {
    const k = id.trim().toLowerCase().replace(/^@/, '')
    const ok = (k === 'marinaduarte' || k === 'marina@habitus.app') && pw === 'habitus123'
    if (ok) setMe(users.find((u) => u.id === ME)!)
    return ok
  }

  const signup = ({ name, username }: { name: string; username: string }) => {
    const u: User = { id: ME, name, username, bio: '' }
    setUsers((l) => l.map((x) => (x.id === ME ? u : x)))
    setMe(u)
    setHabits([])
    setPosts((l) => l.filter((p) => p.userId !== ME).map((p) => ({ ...p, liked: false, comments: p.comments.filter((c) => c.userId !== ME) })))
    setGroups((l) => l.map((g) => ({
      ...g,
      blocked: [],
      left: [],
      ownerId: g.ownerId === ME ? g.members.find((m) => m.userId !== ME)?.userId ?? g.ownerId : g.ownerId,
      members: g.members.filter((m) => m.userId !== ME),
    })).filter((g) => g.members.length > 0))
  }

  const updateProfile = (p: Pick<User, 'name' | 'username' | 'bio'>) => me && setMeAndUsers({ ...me, ...p })

  const saveHabit: Store['saveHabit'] = (h) => {
    if (h.id) {
      setHabits((l) => l.map((x) => (x.id === h.id ? { ...x, ...h, id: x.id } : x)))
      return h.id
    }
    const id = nid('h')
    setHabits((l) => [...l, { ...h, id, markedToday: false, weekCount: 0, streak: 0 }])
    return id
  }
  const deleteHabit = (id: string) => setHabits((l) => l.filter((h) => h.id !== id))

  const toggleHabit = (id: string) =>
    setHabits((l) =>
      l.map((h) => {
        if (h.id !== id) return h
        if (h.freq.type === 'weekly') {
          const t = h.freq.times
          if (!h.markedToday) {
            if (h.weekCount >= t) return h
            const wc = h.weekCount + 1
            return { ...h, markedToday: true, weekCount: wc, streak: wc === t ? h.streak + t : h.streak, lost: undefined }
          }
          return { ...h, markedToday: false, weekCount: h.weekCount - 1, streak: h.weekCount === t ? Math.max(0, h.streak - t) : h.streak }
        }
        return h.markedToday
          ? { ...h, markedToday: false, streak: Math.max(0, h.streak - 1) }
          : { ...h, markedToday: true, streak: h.streak + 1, lost: undefined }
      }),
    )

  const addPost: Store['addPost'] = (p) => {
    const id = nid('p')
    setPosts((l) => [{ ...p, id, userId: ME, ago: 'agora', date: TODAY, likes: 0, liked: false, comments: [] }, ...l])
    return id
  }
  const addCompletion: Store['addCompletion'] = (g, a, text, img) => {
    const id = nid('p')
    setPosts((l) => [
      { id, userId: ME, text, img, ago: 'agora', date: TODAY, likes: 0, liked: false, comments: [], groupId: g.id, activityId: a.id, points: a.points },
      ...l,
    ])
    return id
  }
  const deletePost = (id: string) => setPosts((l) => l.filter((p) => p.id !== id))
  const toggleLike = (id: string) =>
    setPosts((l) => l.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)))
  const addComment = (id: string, text: string) =>
    setPosts((l) => l.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { id: nid('c'), userId: ME, text, ago: 'agora' }] } : p)))

  const createGroup: Store['createGroup'] = (g) => {
    const id = nid('g')
    setGroups((l) => [...l, { ...g, id, code: `${slug(g.name)}-${Math.random().toString(36).slice(2, 6)}`, ownerId: ME, blocked: [], left: [], members: [{ userId: ME, joinedAt: `${TODAY}T12:00`, base: 0 }] }])
    return id
  }
  const updateGroup = (id: string, patch: Partial<Group>) => setGroups((l) => l.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  const joinGroup = (id: string) =>
    setGroups((l) => l.map((g) => (g.id === id ? { ...g, left: g.left.filter((u) => u !== ME), members: [...g.members, { userId: ME, joinedAt: `${TODAY}T12:00`, base: 0 }] } : g)))

  const dropFromGroup = (gid: string, uid: string) =>
    setPosts((l) => l.filter((p) => !(p.groupId === gid && p.userId === uid)))

  const leaveGroup = (id: string) => {
    const g = groups.find((x) => x.id === id)
    if (!g) return
    if (g.ownerId === ME && g.members.length === 1) {
      deleteGroup(id)
      return
    }
    const next = g.ownerId === ME ? [...g.members].filter((m) => m.userId !== ME).sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))[0].userId : g.ownerId
    dropFromGroup(id, ME)
    updateGroup(id, { ownerId: next, left: [...g.left, ME], members: g.members.filter((m) => m.userId !== ME) })
  }
  const removeMember = (gid: string, uid: string) => {
    const g = groups.find((x) => x.id === gid)
    if (!g) return
    dropFromGroup(gid, uid)
    updateGroup(gid, { members: g.members.filter((m) => m.userId !== uid), blocked: [...g.blocked, uid] })
  }
  const deleteGroup = (id: string) => {
    setGroups((l) => l.filter((g) => g.id !== id))
    setPosts((l) => l.filter((p) => p.groupId !== id))
  }

  const pointsOf = useCallback(
    (g: Group, uid: string) =>
      (g.members.find((m) => m.userId === uid)?.base ?? 0) +
      posts.filter((p) => p.groupId === g.id && p.userId === uid).reduce((s, p) => s + (p.points ?? 0), 0),
    [posts],
  )
  const ranking = useCallback(
    (g: Group): Ranked[] => {
      const rows = g.members
        .map((m) => ({ user: users.find((u) => u.id === m.userId)!, points: pointsOf(g, m.userId), joined: m.joinedAt }))
        .sort((a, b) => b.points - a.points || a.joined.localeCompare(b.joined))
      let pos = 0
      let prev = -1
      return rows.map((r) => {
        if (r.points !== prev) pos++
        prev = r.points
        return { user: r.user, points: r.points, pos }
      })
    },
    [users, pointsOf],
  )

  const value = useMemo<Store>(
    () => ({
      me, users, habits, posts, groups, toast, notify, userById, login, signup, logout: () => setMe(null), updateProfile,
      saveHabit, deleteHabit, toggleHabit, addPost, addCompletion, deletePost, toggleLike, addComment,
      createGroup, updateGroup, joinGroup, leaveGroup, removeMember, deleteGroup, ranking, pointsOf,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [me, users, habits, posts, groups, toast, ranking, pointsOf],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export { statusOf }
