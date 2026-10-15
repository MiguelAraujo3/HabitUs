import { lerLista, salvarLista } from './storage.js';
import { criarGrupo } from './modelo.js';

export async function criar(dados) {
  const grupo = criarGrupo(dados);
  const lista = await lerLista('grupos');
  lista.push(grupo);
  salvarLista('grupos', lista);
  return grupo;
}

export async function listar() {
  return lerLista('grupos');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(g => g.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(g => g.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('grupos', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(g => g.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('grupos', lista);
}