import { lerLista, salvarLista } from './storage.js';
import { criarTotalUsuario } from './modelo.js';

export async function criar(dados) {
  const total = criarTotalUsuario(dados);
  const lista = await lerLista('totais');
  if (lista.some(t => t.idUsuario === total.idUsuario)) {
    throw new Error(`Já existe total para o usuário ${total.idUsuario}`);
  }
  lista.push(total);
  salvarLista('totais', lista);
  return total;
}

export async function listar() {
  return lerLista('totais');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(t => t.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('totais', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const novaLista = lista.filter(t => t.id !== id);
  salvarLista('totais', novaLista);
}