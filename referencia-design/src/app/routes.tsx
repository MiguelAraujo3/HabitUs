import { Navigate, createBrowserRouter } from 'react-router'
import { Root, Shell } from './Layout'
import { Cadastro, Login } from './screens/Auth'
import { Feed, NovaPostagem, PostDetalhe } from './screens/Feed'
import { HabitoForm, Hoje } from './screens/Habitos'
import { EditarPerfil, Perfil } from './screens/Perfil'
import { GrupoCriar, GrupoPagina, GruposLista, PostarConclusao } from './screens/Grupos'
import { Convite, GrupoGerenciar, NotFound } from './screens/GrupoAdmin'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { path: 'login', Component: Login },
      { path: 'cadastro', Component: Cadastro },
      { path: 'convite/:codigo', Component: Convite },
      {
        Component: Shell,
        children: [
          { index: true, element: <Navigate to="/hoje" replace /> },
          { path: 'feed', Component: Feed },
          { path: 'feed/nova', Component: NovaPostagem },
          { path: 'post/:id', Component: PostDetalhe },
          { path: 'hoje', Component: Hoje },
          { path: 'habitos/novo', Component: HabitoForm },
          { path: 'habitos/:id/editar', Component: HabitoForm },
          { path: 'grupos', Component: GruposLista },
          { path: 'grupos/novo', Component: GrupoCriar },
          { path: 'grupos/:id', Component: GrupoPagina },
          { path: 'grupos/:id/postar', Component: PostarConclusao },
          { path: 'grupos/:id/gerenciar', Component: GrupoGerenciar },
          { path: 'perfil', Component: Perfil },
          { path: 'perfil/editar', Component: EditarPerfil },
          { path: 'u/:usuario', Component: Perfil },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
])
