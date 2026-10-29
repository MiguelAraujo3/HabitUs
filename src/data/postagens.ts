import { lerLista, salvarLista } from './storage.js';
import { criarPostagem } from './modelo.js';

export interface Postagem {
  id: string;
  idUsuario: string;
  idHabito: string;
  texto: string;
  imagem: string | null;
  dataHora: string;
}

export interface DadosNovaPostagem {
  id?: string;
  idUsuario: string;
  idHabito: string;
  texto: string;
  imagem: string | null;
}

export async function criar(dados: DadosNovaPostagem): Promise<Postagem> {
  const postagem: Postagem = criarPostagem({ id: dados.id, ...dados });
  const lista: Postagem[] = await lerLista('postagens');
  lista.push(postagem);
  salvarLista('postagens', lista);
  return postagem;
}

export async function listar(): Promise<Postagem[]> {
  return lerLista('postagens');
}

export async function getPostsByUser(userId: string): Promise<Postagem[]> {
  const postagens = await listar();

  return postagens
    .filter((postagem) => postagem.idUsuario === userId)
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
}

export async function buscarPorId(id: string): Promise<Postagem | null> {
  const lista = await listar();
  return lista.find((p) => p.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Postagem, 'id'>>
): Promise<Postagem | null> {
  const lista = await listar();
  const idx = lista.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const atualizado: Postagem = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('postagens', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((p) => p.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('postagens', lista);
}
