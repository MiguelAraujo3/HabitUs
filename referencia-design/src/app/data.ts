import {
  Apple,
  BookOpen,
  Dumbbell,
  Flower2,
  GraduationCap,
  Heart,
  ListChecks,
  Moon,
  Palette,
  Shapes,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const TODAY = '2026-10-13'
export const TODAY_LABEL = 'terça-feira, 13 de outubro'
export const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
export const TODAY_IDX = 1

export type Family = 'coral' | 'lime' | 'blue' | 'violet' | 'cyan' | 'gray'

export interface Category {
  id: string
  label: string
  family: Family
  icon: LucideIcon
}

export const CATEGORIES: Category[] = [
  { id: 'saude', label: 'Saúde', family: 'coral', icon: Heart },
  { id: 'esportes', label: 'Esportes e exercícios', family: 'lime', icon: Dumbbell },
  { id: 'estudos', label: 'Estudos', family: 'blue', icon: GraduationCap },
  { id: 'leitura', label: 'Leitura', family: 'violet', icon: BookOpen },
  { id: 'alimentacao', label: 'Alimentação', family: 'coral', icon: Apple },
  { id: 'sono', label: 'Sono', family: 'blue', icon: Moon },
  { id: 'bem-estar', label: 'Bem-estar mental', family: 'violet', icon: Flower2 },
  { id: 'financas', label: 'Finanças', family: 'lime', icon: Wallet },
  { id: 'organizacao', label: 'Organização e produtividade', family: 'cyan', icon: ListChecks },
  { id: 'hobbies', label: 'Hobbies e criatividade', family: 'cyan', icon: Palette },
  { id: 'outros', label: 'Outros', family: 'gray', icon: Shapes },
]
export const catOf = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[10]

export interface User {
  id: string
  name: string
  username: string
  bio: string
  habits?: { name: string; cat: string }[]
}

export type Freq =
  | { type: 'daily' }
  | { type: 'days'; days: number[] }
  | { type: 'weekly'; times: number }

export interface Habit {
  id: string
  name: string
  desc: string
  cat: string
  freq: Freq
  markedToday: boolean
  weekCount: number
  streak: number
  lost?: string
}

export interface Comment {
  id: string
  userId: string
  text: string
  ago: string
}

export interface Post {
  id: string
  userId: string
  text: string
  cat?: string
  habit?: string
  img?: string
  ago: string
  date: string
  likes: number
  liked: boolean
  comments: Comment[]
  groupId?: string
  activityId?: string
  points?: number
}

export interface Activity {
  id: string
  name: string
  points: number
}

export interface Member {
  userId: string
  joinedAt: string
  base: number
}

export interface Group {
  id: string
  code: string
  name: string
  cat: string
  start: string
  end: string
  desc: string
  ownerId: string
  activities: Activity[]
  members: Member[]
  blocked: string[]
  left: string[]
}

export type GroupStatus = 'andamento' | 'nao-iniciado' | 'encerrado'
export const statusOf = (g: Group): GroupStatus =>
  TODAY < g.start ? 'nao-iniciado' : TODAY > g.end ? 'encerrado' : 'andamento'

export const STATUS_LABEL: Record<GroupStatus, string> = {
  andamento: 'Em andamento',
  'nao-iniciado': 'Não iniciado',
  encerrado: 'Encerrado',
}

export const fmtDate = (iso: string, long = false) => {
  const [y, m, d] = iso.split('-').map(Number)
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const mesesL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  return long ? `${d} de ${mesesL[m - 1]} de ${y}` : `${d} ${meses[m - 1]}`
}

export const ME = 'u-me'

export const SEED_USERS: User[] = [
  { id: ME, name: 'Marina Duarte', username: 'marinaduarte', bio: 'Corrida de manhã, livro à noite. Tentando ser constante em tudo um pouco.' },
  {
    id: 'u-rafa', name: 'Rafael Lima', username: 'rafalima', bio: 'Treino antes do café. Dono do Movimento 30 Dias.',
    habits: [{ name: 'Treino de força', cat: 'esportes' }, { name: 'Dormir 8 h', cat: 'sono' }],
  },
  {
    id: 'u-bia', name: 'Beatriz Nogueira', username: 'bia.nogueira', bio: 'Estudante de nutrição. Marmita pronta no domingo.',
    habits: [{ name: 'Preparar marmitas', cat: 'alimentacao' }, { name: 'Estudar 1 h', cat: 'estudos' }],
  },
  {
    id: 'u-caio', name: 'Caio Menezes', username: 'caiomenezes', bio: 'Pedalando até a meta de 1.000 km.',
    habits: [{ name: 'Pedalar', cat: 'esportes' }, { name: 'Guardar R$ 20', cat: 'financas' }],
  },
  {
    id: 'u-helena', name: 'Helena Prado', username: 'helenaprado', bio: 'Yoga, chá e planilhas.',
    habits: [{ name: 'Yoga 20 min', cat: 'bem-estar' }, { name: 'Planejar o dia', cat: 'organizacao' }],
  },
  {
    id: 'u-tomas', name: 'Tomás Ribeiro', username: 'tomasribeiro', bio: 'Leio no ônibus. Já passei de 30 livros neste ano.',
    habits: [{ name: 'Ler 30 páginas', cat: 'leitura' }],
  },
  {
    id: 'u-julia', name: 'Júlia Faria', username: 'juliafaria', bio: 'Aquarela aos sábados.',
    habits: [{ name: 'Desenhar 15 min', cat: 'hobbies' }, { name: 'Ler 10 min', cat: 'leitura' }],
  },
]

export const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Correr 30 min', desc: 'Parque perto de casa', cat: 'esportes', freq: { type: 'weekly', times: 3 }, markedToday: false, weekCount: 2, streak: 6 },
  { id: 'h2', name: 'Ler 20 min', desc: '', cat: 'leitura', freq: { type: 'daily' }, markedToday: true, weekCount: 0, streak: 12 },
  { id: 'h3', name: 'Beber 2 litros de água', desc: '', cat: 'saude', freq: { type: 'daily' }, markedToday: false, weekCount: 0, streak: 5 },
  { id: 'h4', name: 'Academia', desc: 'Treino A, B e C', cat: 'esportes', freq: { type: 'days', days: [0, 2, 4] }, markedToday: false, weekCount: 0, streak: 3 },
  { id: 'h5', name: 'Meditar 10 min', desc: '', cat: 'bem-estar', freq: { type: 'daily' }, markedToday: false, weekCount: 0, streak: 0, lost: 'Sua sequência de 9 dias terminou. Recomeçar hoje vale muito.' },
  { id: 'h6', name: 'Estudar inglês', desc: 'Aula + 15 min de prática', cat: 'estudos', freq: { type: 'weekly', times: 4 }, markedToday: false, weekCount: 1, streak: 0, lost: 'A semana terminou em 2/4 e sua sequência voltou a zero.' },
]

const IMG = {
  run: 'https://images.unsplash.com/photo-1603455778956-d71832eafa4e?w=900&h=700&fit=crop&auto=format',
  read: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=900&h=700&fit=crop&auto=format',
  meal: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&h=700&fit=crop&auto=format',
  gym: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&h=700&fit=crop&auto=format',
}
export const SAMPLE_IMG = IMG

export const SEED_POSTS: Post[] = [
  { id: 'p1', userId: 'u-rafa', text: 'Treino de 30 min feito antes do trabalho. Cheguei na frente no ranking, mas o Caio vem atrás.', groupId: 'g1', activityId: 'g1a1', points: 5, img: IMG.gym, ago: 'há 25 min', date: TODAY, likes: 8, liked: false, comments: [{ id: 'c1', userId: 'u-bia', text: 'Segura aí, líder!', ago: 'há 12 min' }] },
  { id: 'p2', userId: 'u-me', text: 'Alongamento rápido depois de passar a manhã sentada.', groupId: 'g1', activityId: 'g1a3', points: 1, img: IMG.run, ago: 'há 1 h', date: TODAY, likes: 3, liked: true, comments: [] },
  { id: 'p3', userId: 'u-tomas', cat: 'leitura', habit: 'Ler 30 páginas', text: 'Terminei “Torto Arado” hoje no ônibus. Final de arrepiar.', img: IMG.read, ago: 'há 2 h', date: TODAY, likes: 14, liked: false, comments: [{ id: 'c2', userId: 'u-julia', text: 'Está na minha lista!', ago: 'há 1 h' }, { id: 'c3', userId: 'u-me', text: 'Um dos melhores que li este ano.', ago: 'há 40 min' }] },
  { id: 'p4', userId: 'u-bia', cat: 'alimentacao', habit: 'Preparar marmitas', text: 'Marmitas da semana prontas: frango, quinoa e muita folha.', img: IMG.meal, ago: 'há 4 h', date: TODAY, likes: 21, liked: true, comments: [] },
  { id: 'p5', userId: 'u-helena', cat: 'bem-estar', habit: 'Yoga 20 min', text: 'Vinte minutos de yoga antes do café. A cabeça agradece.', ago: 'há 6 h', date: TODAY, likes: 6, liked: false, comments: [] },
  { id: 'p6', userId: 'u-caio', text: 'Pedal de 25 km no domingo. Meta do mês mais perto.', groupId: 'g5', activityId: 'g5a1', points: 4, img: IMG.run, ago: 'ontem', date: '2026-10-12', likes: 9, liked: false, comments: [] },
  { id: 'p7', userId: 'u-julia', cat: 'hobbies', habit: 'Desenhar 15 min', text: 'Estudo de luz com aquarela. Ainda estou aprendendo a controlar a água.', ago: 'ontem', date: '2026-10-12', likes: 17, liked: false, comments: [] },
  { id: 'p8', userId: 'u-me', cat: 'esportes', habit: 'Correr 30 min', text: 'Corrida de 5 km no parque. Dois de três na semana.', img: IMG.run, ago: 'ontem', date: '2026-10-12', likes: 11, liked: false, comments: [] },
  { id: 'p9', userId: 'u-helena', text: 'Último dia sem açúcar do grupo. Fechei com chave de ouro.', groupId: 'g4', activityId: 'g4a1', points: 2, ago: '30 set', date: '2026-09-30', likes: 5, liked: false, comments: [] },
  { id: 'p10', userId: 'u-me', text: 'Dia sem açúcar com direito a fruta de sobremesa.', groupId: 'g4', activityId: 'g4a1', points: 2, img: IMG.meal, ago: '30 set', date: '2026-09-30', likes: 4, liked: false, comments: [] },
  { id: 'p11', userId: 'u-rafa', cat: 'sono', habit: 'Dormir 8 h', text: 'Uma semana dormindo no horário. Mudou meu rendimento no treino.', ago: '10 out', date: '2026-10-10', likes: 12, liked: false, comments: [] },
  { id: 'p12', userId: 'u-caio', cat: 'financas', habit: 'Guardar R$ 20', text: 'Cofrinho digital passou dos R$ 600.', ago: '9 out', date: '2026-10-09', likes: 7, liked: false, comments: [] },
]

const act = (id: string, name: string, points: number): Activity => ({ id, name, points })

export const SEED_GROUPS: Group[] = [
  {
    id: 'g1', code: 'movimento-30', name: 'Movimento 30 Dias', cat: 'esportes', start: '2026-10-01', end: '2026-10-31',
    desc: 'Um mês para tirar o corpo do sofá. Treine, caminhe, alongue e some pontos.',
    ownerId: 'u-rafa', blocked: [], left: [],
    activities: [act('g1a1', 'Treino de 30 min', 5), act('g1a2', 'Caminhada de 5 km', 3), act('g1a3', 'Alongamento', 1)],
    members: [
      { userId: 'u-rafa', joinedAt: '2026-10-01T08:00', base: 37 },
      { userId: 'u-bia', joinedAt: '2026-10-01T09:10', base: 42 },
      { userId: 'u-caio', joinedAt: '2026-10-02T07:30', base: 31 },
      { userId: 'u-helena', joinedAt: '2026-10-03T18:00', base: 18 },
      { userId: ME, joinedAt: '2026-10-03T19:20', base: 23 },
    ],
  },
  {
    id: 'g2', code: 'clube-10', name: 'Clube dos 10 Minutos', cat: 'leitura', start: '2026-10-05', end: '2026-11-15',
    desc: 'Dez minutos de leitura por dia. Quem resume o capítulo ganha mais.',
    ownerId: ME, blocked: [], left: [],
    activities: [act('g2a1', 'Ler 10 minutos', 2), act('g2a2', 'Resumir um capítulo', 4)],
    members: [
      { userId: ME, joinedAt: '2026-10-05T10:00', base: 26 },
      { userId: 'u-tomas', joinedAt: '2026-10-06T12:00', base: 30 },
      { userId: 'u-julia', joinedAt: '2026-10-07T21:00', base: 14 },
    ],
  },
  {
    id: 'g3', code: 'sono-nov', name: 'Maratona do Sono', cat: 'sono', start: '2026-11-03', end: '2026-11-30',
    desc: 'Novembro com noites completas. Dormir antes das 23 h vale pontos.',
    ownerId: 'u-bia', blocked: [], left: [],
    activities: [act('g3a1', 'Dormir antes das 23 h', 3)],
    members: [
      { userId: 'u-bia', joinedAt: '2026-10-08T20:00', base: 0 },
      { userId: ME, joinedAt: '2026-10-10T20:30', base: 0 },
    ],
  },
  {
    id: 'g4', code: 'sem-acucar', name: 'Setembro Sem Açúcar', cat: 'alimentacao', start: '2026-09-01', end: '2026-09-30',
    desc: 'Trinta dias sem açúcar adicionado. Foi difícil, foi bom.',
    ownerId: ME, blocked: [], left: [],
    activities: [act('g4a1', 'Dia sem açúcar', 2)],
    members: [
      { userId: ME, joinedAt: '2026-09-01T08:00', base: 46 },
      { userId: 'u-helena', joinedAt: '2026-09-01T09:00', base: 50 },
      { userId: 'u-caio', joinedAt: '2026-09-02T09:00', base: 48 },
    ],
  },
  {
    id: 'g5', code: 'corrida-dom', name: 'Corrida de Domingo', cat: 'esportes', start: '2026-10-01', end: '2026-12-15',
    desc: 'Todo domingo, uma corrida ou pedal. Sem pressa, com companhia.',
    ownerId: 'u-caio', blocked: [], left: [],
    activities: [act('g5a1', 'Longão de domingo', 4)],
    members: [
      { userId: 'u-caio', joinedAt: '2026-10-01T07:00', base: 12 },
      { userId: 'u-tomas', joinedAt: '2026-10-04T07:00', base: 8 },
    ],
  },
  {
    id: 'g6', code: 'pedal-bloq', name: 'Pedal Matinal', cat: 'esportes', start: '2026-10-01', end: '2026-12-31',
    desc: 'Pedal em grupo toda manhã.', ownerId: 'u-rafa', blocked: [ME], left: [],
    activities: [act('g6a1', 'Pedal de 20 km', 4)],
    members: [{ userId: 'u-rafa', joinedAt: '2026-10-01T06:00', base: 0 }],
  },
  {
    id: 'g7', code: 'yoga-volta', name: 'Yoga em Casa', cat: 'bem-estar', start: '2026-10-01', end: '2026-12-01',
    desc: 'Vinte minutos de yoga em casa.', ownerId: 'u-helena', blocked: [], left: [ME],
    activities: [act('g7a1', 'Sessão de 20 min', 2)],
    members: [{ userId: 'u-helena', joinedAt: '2026-10-01T06:30', base: 10 }],
  },
  {
    id: 'g8', code: 'leitura-25', name: 'Leitura de Inverno', cat: 'leitura', start: '2026-06-01', end: '2026-08-31',
    desc: 'Três meses de leitura em dia.', ownerId: 'u-tomas', blocked: [], left: [],
    activities: [act('g8a1', 'Ler 20 páginas', 1)],
    members: [{ userId: 'u-tomas', joinedAt: '2026-06-01T09:00', base: 77 }],
  },
]

export const INVITE_TESTS = [
  { code: 'corrida-dom', label: 'Convite válido' },
  { code: 'movimento-30', label: 'Já é membro' },
  { code: 'yoga-volta', label: 'Saiu voluntariamente' },
  { code: 'pedal-bloq', label: 'Removido pelo dono' },
  { code: 'leitura-25', label: 'Grupo encerrado' },
  { code: 'codigo-torto', label: 'Código inválido' },
]
