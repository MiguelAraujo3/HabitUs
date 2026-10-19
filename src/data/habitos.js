import { lerLista, salvarLista } from './storage.js';
import { criarHabito } from './modelo.js';

export async function criar(dados) {
  const habito = criarHabito(dados);
  const lista = await lerLista('habitos');
  lista.push(habito);
  salvarLista('habitos', lista);
  return habito;
}

export async function listar() {
  return lerLista('habitos');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(h => h.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(h => h.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('habitos', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(h => h.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('habitos', lista);
}