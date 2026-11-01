import { lerLista, salvarLista } from './storage.js';
import { criarConclusaoGrupo, type ConclusaoGrupo } from './modelo.js';

export type { ConclusaoGrupo };

export interface DadosNovaConclusaoGrupo {
  id?: string;
  idGrupo: string;
  idAtividade: string;
  idUsuario: string;
  data?: string;
  foto?: string | null;
  texto?: string;
}

export async function criar(dados: DadosNovaConclusaoGrupo): Promise<ConclusaoGrupo> {
  const conclusao = criarConclusaoGrupo(dados);
  const lista = await lerLista<ConclusaoGrupo>('conclusoesGrupo');
  lista.push(conclusao);
  salvarLista('conclusoesGrupo', lista);
  return conclusao;
}

export async function listar(): Promise<ConclusaoGrupo[]> {
  return lerLista<ConclusaoGrupo>('conclusoesGrupo');
}

export async function buscarPorId(id: string): Promise<ConclusaoGrupo | null> {
  const lista = await listar();
  return lista.find((c) => c.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<ConclusaoGrupo, 'id'>>
): Promise<ConclusaoGrupo | null> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado: ConclusaoGrupo = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('conclusoesGrupo', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('conclusoesGrupo', lista);
}
