import { lerLista, salvarLista } from './storage.js';
import { criarGrupo, type Grupo } from './modelo.js';

export type { Grupo };

export interface DadosNovoGrupo {
  id?: string;
  nome: string;
  categoria: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  idDono: string;
  codigoConvite: string;
}

export async function criar(dados: DadosNovoGrupo): Promise<Grupo> {
  const grupo = criarGrupo(dados);
  const lista = await lerLista<Grupo>('grupos');
  lista.push(grupo);
  salvarLista('grupos', lista);
  return grupo;
}

export async function listar(): Promise<Grupo[]> {
  return lerLista<Grupo>('grupos');
}

export async function buscarPorId(id: string): Promise<Grupo | null> {
  const lista = await listar();
  return lista.find((g) => g.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Grupo, 'id'>>
): Promise<Grupo | null> {
  const lista = await listar();
  const idx = lista.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const atualizado: Grupo = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('grupos', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((g) => g.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('grupos', lista);
}
