import { lerLista, salvarLista } from './storage.js';
import { criarAtividade, type Atividade } from './modelo.js';

export type { Atividade };

export interface DadosNovaAtividade {
  id?: string;
  idGrupo: string;
  nome: string;
  pontos: number;
}

export async function criar(dados: DadosNovaAtividade): Promise<Atividade> {
  const atividade = criarAtividade(dados);
  const lista = await lerLista<Atividade>('atividades');
  lista.push(atividade);
  salvarLista('atividades', lista);
  return atividade;
}

export async function listar(): Promise<Atividade[]> {
  return lerLista<Atividade>('atividades');
}

export async function buscarPorId(id: string): Promise<Atividade | null> {
  const lista = await listar();
  return lista.find((a) => a.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Atividade, 'id'>>
): Promise<Atividade | null> {
  const lista = await listar();
  const idx = lista.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const atualizado: Atividade = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('atividades', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((a) => a.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('atividades', lista);
}
