import { buscarPorId } from "./habitos.js";
import { getCompletionsByHabit } from "./conclusoesHabito.js";
import { calcularSequencia, calcularDataRecorde } from "../rules/streak.js";

export async function getHabitStreak(habitId) {
  const habito = await buscarPorId(habitId);

  if (!habito) {
    /** @type {Error & { code?: string }} */
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