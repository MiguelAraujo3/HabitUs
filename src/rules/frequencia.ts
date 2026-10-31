// Regras puras da frequência do hábito: validação, texto para a tela e troca dos dias.
// Nada aqui lê o relógio (a data de hoje entra como argumento) nem mexe no DOM ou no storage.
import type { Frequencia } from '../types/habito.js';
import { deChave, paraChave, somarDias } from '../utils/datas.js';

export const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;
export const DIAS_NOME = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

export const META_MINIMA = 1;
export const META_MAXIMA = 7;
const DIAS_NA_SEMANA = 7;

type FrequenciaDiasSemana = Extract<Frequencia, { tipo: 'dias-semana' }>;

// Devolve a mensagem de erro, ou null se a frequência é válida.
// Recebe "unknown" de propósito: o dado pode vir do formulário ou do localStorage.
export function validarFrequencia(frequencia: unknown): string | null {
  if (typeof frequencia !== 'object' || frequencia === null) {
    return 'Escolha uma frequência.';
  }
  const { tipo, dias, vezes } = frequencia as { tipo?: unknown; dias?: unknown; vezes?: unknown };

  if (tipo === 'diaria') return null;

  if (tipo === 'dias-semana') {
    if (!Array.isArray(dias) || dias.length === 0) {
      return 'Escolha pelo menos um dia da semana.';
    }
    const diasValidos = dias.every((d) => Number.isInteger(d) && d >= 0 && d <= 6);
    if (!diasValidos || new Set(dias).size !== dias.length) {
      return 'Os dias da semana escolhidos são inválidos.';
    }
    return null;
  }

  if (tipo === 'vezes-semana') {
    if (typeof vezes !== 'number' || !Number.isInteger(vezes) || vezes < META_MINIMA || vezes > META_MAXIMA) {
      return `A meta deve ser de ${META_MINIMA} a ${META_MAXIMA} vezes por semana.`;
    }
    return null;
  }

  return 'Escolha uma frequência.';
}

// "Todos os dias" escolhido por outro caminho vira a frequência diária:
// os 7 dias da semana, ou 7 vezes por semana. As demais frequências ficam como estão.
export function normalizarFrequencia(frequencia: Frequencia): Frequencia {
  if (frequencia.tipo === 'dias-semana' && new Set(frequencia.dias).size === DIAS_NA_SEMANA) {
    return { tipo: 'diaria' };
  }
  if (frequencia.tipo === 'vezes-semana' && frequencia.vezes === DIAS_NA_SEMANA) {
    return { tipo: 'diaria' };
  }
  return frequencia;
}

// A frequência escolhida é, na prática, "todos os dias" (e será criada como diária)?
export function equivaleATodosOsDias(frequencia: Frequencia): boolean {
  return frequencia.tipo !== 'diaria' && normalizarFrequencia(frequencia).tipo === 'diaria';
}

// Valida a troca dos dias de um hábito de "dias da semana":
// os dias novos precisam ser válidos e na mesma quantidade que os atuais.
export function validarTrocaDeDias(atual: FrequenciaDiasSemana, novosDias: unknown): string | null {
  const erro = validarFrequencia({ tipo: 'dias-semana', dias: novosDias });
  if (erro) return erro;

  const quantidadeAtual = new Set(atual.dias).size;
  if ((novosDias as number[]).length !== quantidadeAtual) {
    const dias = quantidadeAtual === 1 ? 'dia' : 'dias';
    return `Escolha exatamente ${quantidadeAtual} ${dias}: só é possível trocar os dias, não a quantidade.`;
  }
  return null;
}

// Troca os dias a partir de hoje. Os dias antigos viram um período do histórico (valendo até
// ontem), então a sequência e o recorde já conquistados continuam calculados com os dias de
// antes (veja criarAgendamento em rules/streak.js). Não altera o objeto recebido.
export function trocarDiasDaSemana(
  atual: FrequenciaDiasSemana,
  novosDias: number[],
  chaveHoje: string
): FrequenciaDiasSemana {
  const dias = [...novosDias].sort((a, b) => a - b);
  const antigos = [...new Set(atual.dias)].sort((a, b) => a - b);
  const igual = dias.length === antigos.length && dias.every((d, i) => d === antigos[i]);
  if (igual) return atual; // nada mudou

  const ontem = paraChave(somarDias(deChave(chaveHoje), -1));
  const historico = atual.historico ?? [];
  const ultimo = historico[historico.length - 1];
  // Segunda troca no mesmo dia: os dias de hoje ainda não valeram em nenhum dia passado,
  // então só substituem os atuais, sem criar outro período no histórico.
  if (ultimo && ultimo.ate >= ontem) return { ...atual, dias };

  return { ...atual, dias, historico: [...historico, { ate: ontem, dias: antigos }] };
}

// Texto curto da frequência, para o cartão do hábito:
// "Todos os dias", "Seg, Qua, Sex" ou "4x por semana".
export function rotuloFrequencia(frequencia: Frequencia): string {
  if (frequencia.tipo === 'dias-semana') {
    const dias = [...new Set(frequencia.dias)].sort((a, b) => a - b);
    // Sem dias (dado antigo) ou os 7 dias: na prática é todo dia
    if (dias.length === 0 || dias.length === DIAS_NA_SEMANA) return 'Todos os dias';
    return dias.map((d) => DIAS_ABREV[d]).join(', ');
  }
  if (frequencia.tipo === 'vezes-semana') {
    return `${frequencia.vezes}x por semana`;
  }
  return 'Todos os dias';
}
