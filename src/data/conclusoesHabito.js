import { lerLista, salvarLista } from './storage.js';
import { criarConclusaoHabito } from './modelo.js';
import { hoje, paraChave } from '../utils/datas.js';

export async function criar(dados) {
  const conclusao = criarConclusaoHabito(dados);
  const lista = await lerLista('conclusoesHabito');
  lista.push(conclusao);
  salvarLista('conclusoesHabito', lista);
  return conclusao;
}

export async function listar() {
  return lerLista('conclusoesHabito');
}

export async function buscarPorId(id) {
  const lista = await listar();
  return lista.find(c => c.id === id) || null;
}

export async function atualizar(id, dados) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const atualizado = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('conclusoesHabito', lista);
  return atualizado;
}

export async function excluir(id) {
  const lista = await listar();
  const idx = lista.findIndex(c => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('conclusoesHabito', lista);
}

export async function getCompletionsByHabit(habitId) {
  const conclusoes = await listar()
  return conclusoes.filter((conclusao) => conclusao.idHabito === habitId)
  .sort((a,b) => b.data.localeCompare(a.data));
}

// Remove todas as conclusões de um hábito (usado quando o hábito é excluído)
export async function excluirPorHabito(idHabito) {
  const lista = await listar();
  const restantes = lista.filter(c => c.idHabito !== idHabito);
  if (restantes.length !== lista.length) {
    salvarLista('conclusoesHabito', restantes);
  }
}

// Marca ou desmarca o hábito HOJE. Lê e grava a lista de uma vez só, então não sobra mais de
// uma conclusão por hábito no mesmo dia (nem se houver duplicatas antigas: todas são removidas).
// Devolve { marcado, conclusao }: marcado = true se agora está feito; conclusao = a criada
// (ao marcar) ou a removida (ao desmarcar).
export async function alternarConclusaoHoje(idHabito) {
  const chave = paraChave(hoje());
  const lista = await lerLista('conclusoesHabito');
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