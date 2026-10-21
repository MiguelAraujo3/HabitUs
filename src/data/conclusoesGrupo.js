import { lerLista, salvarLista } from './storage.js';
import { criarConclusaoGrupo } from './modelo.js';

export async function criar(dados) {
  const conclusao = criarConclusaoGrupo(dados);
  const lista = await lerLista('conclusoesGrupo');
  lista.push(conclusao);
  salvarLista('conclusoesGrupo', lista);
  return conclusao;
}

export async function listar() {
  return lerLista('conclusoesGrupo');
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
  salvarLista('conclusoesGrupo', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('conclusoesGrupo', lista);
}