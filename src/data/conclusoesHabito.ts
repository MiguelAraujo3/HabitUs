import type { ConclusaoHabito } from '../types/habito.js';
import { lerLista, salvarLista } from './storage.js';
import { criarConclusaoHabito } from './modelo.js';
import { hoje, paraChave } from '../utils/datas.js';

export interface DadosNovaConclusaoHabito {
  id?: string;
  idHabito: string;
  data?: string;
}

export interface ResultadoAlternarConclusao {
  marcado: boolean;
  conclusao: ConclusaoHabito;
}

export async function criar(dados: DadosNovaConclusaoHabito): Promise<ConclusaoHabito> {
  const conclusao = criarConclusaoHabito(dados);
  const lista = await lerLista<ConclusaoHabito>('conclusoesHabito');
  lista.push(conclusao);
  salvarLista('conclusoesHabito', lista);
  return conclusao;
}

export async function listar(): Promise<ConclusaoHabito[]> {
  return lerLista<ConclusaoHabito>('conclusoesHabito');
}

export async function buscarPorId(id: string): Promise<ConclusaoHabito | null> {
  const lista = await listar();
  return lista.find((c) => c.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<ConclusaoHabito, 'id'>>
): Promise<ConclusaoHabito | null> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado: ConclusaoHabito = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('conclusoesHabito', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('conclusoesHabito', lista);
}

export async function getCompletionsByHabit(habitId: string): Promise<ConclusaoHabito[]> {
  const conclusoes = await listar();
  return conclusoes
    .filter((conclusao) => conclusao.idHabito === habitId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

// Remove todas as conclusões de um hábito (usado quando o hábito é excluído)
export async function excluirPorHabito(idHabito: string): Promise<void> {
  const lista = await listar();
  const restantes = lista.filter((c) => c.idHabito !== idHabito);
  if (restantes.length !== lista.length) {
    salvarLista('conclusoesHabito', restantes);
  }
}

// Marca ou desmarca o hábito HOJE. Lê e grava a lista de uma vez só, então não sobra mais de
// uma conclusão por hábito no mesmo dia (nem se houver duplicatas antigas: todas são removidas).
// Devolve { marcado, conclusao }: marcado = true se agora está feito; conclusao = a criada
// (ao marcar) ou a removida (ao desmarcar).
export async function alternarConclusaoHoje(idHabito: string): Promise<ResultadoAlternarConclusao> {
  const chave = paraChave(hoje());
  const lista = await lerLista<ConclusaoHabito>('conclusoesHabito');
  const doDia = lista.filter((c) => c.idHabito === idHabito && c.data === chave);

  if (doDia.length > 0) {
    const restantes = lista.filter((c) => !(c.idHabito === idHabito && c.data === chave));
    salvarLista('conclusoesHabito', restantes);
    return { marcado: false, conclusao: doDia[0] };
  }

  const conclusao = criarConclusaoHabito({ idHabito, data: chave });
  lista.push(conclusao);
  salvarLista('conclusoesHabito', lista);
  return { marcado: true, conclusao };
}
