import { lerLista, salvarLista } from './storage.js';
import { criarMembro } from './modelo.js';

export async function criar(dados) {
  const membro = criarMembro(dados);
  const lista = await lerLista('membros');
  lista.push(membro);
  salvarLista('membros', lista);
  return membro;
}

export async function listar() {
  return lerLista('membros');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(m => m.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(m => m.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('membros', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(m => m.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('membros', lista);
}