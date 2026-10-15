import { lerLista, salvarLista } from './storage.js';
import { criarAtividade } from './modelo.js';

export async function criar(dados) {
  const atividade = criarAtividade(dados);
  const lista = await lerLista('atividades');
  lista.push(atividade);
  salvarLista('atividades', lista);
  return atividade;
}

export async function listar() {
  return lerLista('atividades');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(a => a.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('atividades', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(a => a.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('atividades', lista);
}