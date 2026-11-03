import { lerLista, salvarLista } from './storage.js';
import { criarTotalUsuario, type TotalUsuario } from './modelo.js';

export type { TotalUsuario };

export interface DadosNovoTotalUsuario {
  id?: string;
  idUsuario: string;
  atividadesConcluidas: number;
}

export async function criar(dados: DadosNovoTotalUsuario): Promise<TotalUsuario> {
  const total = criarTotalUsuario(dados);
  const lista = await lerLista<TotalUsuario>('totais');
  if (lista.some((t) => t.idUsuario === total.idUsuario)) {
    throw new Error(`Já existe total para o usuário ${total.idUsuario}`);
  }
  lista.push(total);
  salvarLista('totais', lista);
  return total;
}

export async function listar(): Promise<TotalUsuario[]> {
  return lerLista<TotalUsuario>('totais');
}

export async function buscarPorId(id: string): Promise<TotalUsuario | null> {
  const lista = await listar();
  return lista.find((t) => t.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<TotalUsuario, 'id'>>
): Promise<TotalUsuario | null> {
  const lista = await listar();
  const idx = lista.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const atualizado: TotalUsuario = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('totais', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const novaLista = lista.filter((t) => t.id !== id);
  salvarLista('totais', novaLista);
}
