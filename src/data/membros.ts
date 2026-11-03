import { lerLista, salvarLista } from './storage.js';
import { criarMembro, type Membro } from './modelo.js';

export type { Membro };

export interface DadosNovoMembro {
  id?: string;
  idGrupo: string;
  idUsuario: string;
  dataEntrada?: string;
  bloqueado?: boolean;
}

export async function criar(dados: DadosNovoMembro): Promise<Membro> {
  const membro = criarMembro(dados);
  const lista = await lerLista<Membro>('membros');
  lista.push(membro);
  salvarLista('membros', lista);
  return membro;
}

export async function listar(): Promise<Membro[]> {
  return lerLista<Membro>('membros');
}

export async function buscarPorId(id: string): Promise<Membro | null> {
  const lista = await listar();
  return lista.find((m) => m.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Membro, 'id'>>
): Promise<Membro | null> {
  const lista = await listar();
  const idx = lista.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const atualizado: Membro = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('membros', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((m) => m.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('membros', lista);
}
