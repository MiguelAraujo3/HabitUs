import type { Frequencia, Habito } from '../types/habito.js';
import { lerLista, salvarLista } from './storage.js';
import { criarHabito } from './modelo.js';

export interface DadosNovoHabito {
  id?: string;
  idUsuario: string;
  nome: string;
  categoria: string;
  descricao?: string;
  frequencia: Frequencia;
}

export async function criar(dados: DadosNovoHabito): Promise<Habito> {
  const habito = criarHabito(dados);
  const lista = await lerLista<Habito>('habitos');
  lista.push(habito);
  salvarLista('habitos', lista);
  return habito;
}

export async function listar(): Promise<Habito[]> {
  return lerLista<Habito>('habitos');
}

export async function buscarPorId(id: string): Promise<Habito | null> {
  const lista = await listar();
  return lista.find((h) => h.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Habito, 'id'>>
): Promise<Habito | null> {
  const lista = await listar();
  const idx = lista.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const atualizado: Habito = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('habitos', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((h) => h.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('habitos', lista);
}

export async function getHabitsByUser(userId: string): Promise<Habito[]> {
  const habitos = await listar();
  return habitos
    .filter((habito) => habito.idUsuario === userId) //separa os habitos do usuario
    .sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao)); //ordena os habitos, do mais recente ao mais antigo
}
