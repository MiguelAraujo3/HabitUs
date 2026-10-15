import { lerLista, salvarLista } from './storage.js';
import { criarComentario } from './modelo.js';

export async function criar(dados) {
  const comentario = criarComentario(dados);
  const lista = await lerLista('comentarios');
  lista.push(comentario);
  salvarLista('comentarios', lista);
  return comentario;
}

export async function listar() {
  return lerLista('comentarios');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(c => c.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('comentarios', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('comentarios', lista);
}