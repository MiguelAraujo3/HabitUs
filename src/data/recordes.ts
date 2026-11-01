import { lerLista, salvarLista } from './storage.js';
import { criarRegistroRecordes, type RegistroRecordes } from './modelo.js';

export type { RegistroRecordes };

export interface DadosNovoRegistroRecordes {
  id?: string;
  idUsuario: string;
  maiorSequencia: number;
}

export async function criar(dados: DadosNovoRegistroRecordes): Promise<RegistroRecordes> {
  const registro = criarRegistroRecordes(dados);
  const lista = await lerLista<RegistroRecordes>('recordes');
  if (lista.some((r) => r.idUsuario === registro.idUsuario)) {
    throw new Error(`Já existe recorde para o usuário ${registro.idUsuario}`);
  }
  lista.push(registro);
  salvarLista('recordes', lista);
  return registro;
}

export async function listar(): Promise<RegistroRecordes[]> {
  return lerLista<RegistroRecordes>('recordes');
}

export async function buscarPorId(id: string): Promise<RegistroRecordes | null> {
  const lista = await listar();
  return lista.find((r) => r.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<RegistroRecordes, 'id'>>
): Promise<RegistroRecordes | null> {
  const lista = await listar();
  const idx = lista.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const atualizado: RegistroRecordes = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('recordes', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const novaLista = lista.filter((r) => r.id !== id);
  salvarLista('recordes', novaLista);
}
