import { lerLista, salvarLista } from './storage.js';
import { criarCurtida } from './modelo.js';

export async function criar(dados) {
  const curtida = criarCurtida(dados);
  const lista = await lerLista('curtidas');
  lista.push(curtida);
  salvarLista('curtidas', lista);
  return curtida;
}

export async function listar() {
  return lerLista('curtidas');
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
  salvarLista('curtidas', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('curtidas', lista);
}