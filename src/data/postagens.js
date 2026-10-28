import { lerLista, salvarLista } from './storage.js';
import { criarPostagem } from './modelo.js';

export async function criar(dados) {
  const postagem = criarPostagem(dados);
  const lista = await lerLista('postagens');
  lista.push(postagem);
  salvarLista('postagens', lista);
  return postagem;
}

export async function listar() {
  return lerLista('postagens');
}
export async function getPostsByUser(userId) {
  const postagens = await listar()

  return postagens.filter(postagem => postagem.idUsuario === userId)
  .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(p => p.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('postagens', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(p => p.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('postagens', lista);
}