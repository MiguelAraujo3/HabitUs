import { lerLista, salvarLista } from './storage.js';
import { criarCurtida } from './modelo.js';

export interface Curtida {
  id: string;
  idPostagem: string;
  idUsuario: string;
}

export interface DadosNovaCurtida {
  id?: string;
  idPostagem: string;
  idUsuario: string;
}

export async function criar(dados: DadosNovaCurtida): Promise<Curtida> {
  const curtida: Curtida = criarCurtida({ id: dados.id, ...dados });
  const lista: Curtida[] = await lerLista('curtidas');
  lista.push(curtida);
  salvarLista('curtidas', lista);
  return curtida;
}

export async function listar(): Promise<Curtida[]> {
  return lerLista('curtidas');
}

export async function buscarPorId(id: string): Promise<Curtida | null> {
  const lista = await listar();
  return lista.find((c) => c.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Curtida, 'id'>>
): Promise<Curtida | null> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado: Curtida = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('curtidas', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('curtidas', lista);
}
