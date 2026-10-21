import { buscarPorId, listar as listarHabitos } from "./habitos.js";
import { getCompletionsByHabit, listar as listarConclusoes } from "./conclusoesHabito.js";
import { calcularSequencia, calcularDataRecorde } from "../rules/streak.js";

export async function getHabitStreak(habitId) {
  const habito = await buscarPorId(habitId);

  if (!habito) {
    const erro = new Error('Hábito não encontrado');
    erro.code = "NOT_FOUND";
    throw erro;
  }
  const conclusoes = await getCompletionsByHabit(habitId);
  const datas = conclusoes.map((conclusao) => conclusao.data);
  
  const sequencia = calcularSequencia(habito.frequencia,datas);

  return  {
    current: sequencia.atual,
    longest: sequencia.maior,
    longestAchievedAt: calcularDataRecorde(habito.frequencia, datas),
    unit: habito.frequencia.tipo === 'vezes-semana'?'week_equivalents':'days',
  };
}

// Hábitos ativos do usuário e as conclusões deles (usado pela página Hábitos e pelo painel lateral)
export async function carregarHabitosDoUsuario(idUsuario) {
  const todos = await listarHabitos();
  const habitos = todos.filter((h) => h.idUsuario === idUsuario && h.ativo !== false);

  const ids = new Set(habitos.map((h) => h.id));
  const todasConclusoes = await listarConclusoes();
  const conclusoes = todasConclusoes.filter((c) => ids.has(c.idHabito));

  return { habitos, conclusoes };
}