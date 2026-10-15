import { lerLista, salvarLista } from './storage.js';
import { criarRegistroRecordes } from './modelo.js';

export async function criar(dados) {
  const registro = criarRegistroRecordes(dados);
  const lista = await lerLista('recordes');
  if (lista.some(r => r.idUsuario === registro.idUsuario)) {
    throw new Error(`Já existe recorde para o usuário ${registro.idUsuario}`);
  }
  lista.push(registro);
  salvarLista('recordes', lista);
  return registro;
}

export async function listar() {
  return lerLista('recordes');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(r => r.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(r => r.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('recordes', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const novaLista = lista.filter(r => r.id !== id);
  salvarLista('recordes', novaLista);
}