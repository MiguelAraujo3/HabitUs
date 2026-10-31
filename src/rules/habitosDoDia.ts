// Regras puras dos hábitos do dia, compartilhadas pela página Hábitos e pelo painel lateral.
// Nenhuma função altera dados nem lê o relógio: o dia da semana e a chave da data entram
// como argumento, então a mesma entrada sempre dá a mesma saída (fácil de testar).
//
// diaDaSemana: 0 = domingo ... 6 = sábado. chave: 'AAAA-MM-DD'.
import type { ConclusaoHabito, Habito } from '../types/habito.js';
import { deChave, fimDaSemana, inicioDaSemana, paraChave } from '../utils/datas.js';

// O hábito é do dia? Só os de "dias da semana" podem ficar de fora; os demais são sempre do dia.
export function ehDoDia(habito: Habito, diaDaSemana: number): boolean {
  const f = habito.frequencia;
  if (f && f.tipo === 'dias-semana' && Array.isArray(f.dias) && f.dias.length > 0) {
    return f.dias.includes(diaDaSemana);
  }
  return true;
}

// Só os hábitos do dia (filter)
export function habitosDoDia(habitos: Habito[], diaDaSemana: number): Habito[] {
  return habitos.filter((h) => ehDoDia(h, diaDaSemana));
}

// Conclusão do hábito no dia informado, ou null se ainda não foi marcado
export function conclusaoDoDia(
  habito: Habito,
  conclusoes: ConclusaoHabito[],
  chave: string
): ConclusaoHabito | null {
  return conclusoes.find((c) => c.idHabito === habito.id && c.data === chave) || null;
}

// Quantos dos hábitos informados estão marcados no dia (reduce)
export function contarFeitos(habitos: Habito[], conclusoes: ConclusaoHabito[], chave: string): number {
  return habitos.reduce((soma, h) => soma + (conclusaoDoDia(h, conclusoes, chave) ? 1 : 0), 0);
}

// Quantos dias distintos do hábito foram marcados na semana (domingo a sábado) que contém a data.
// Usado em "2 de 4 esta semana" nos hábitos de "vezes por semana".
export function contarNaSemana(habito: Habito, conclusoes: ConclusaoHabito[], chave: string): number {
  const dia = deChave(chave);
  const inicio = paraChave(inicioDaSemana(dia));
  const fim = paraChave(fimDaSemana(dia));
  const datas = conclusoes
    .filter((c) => c.idHabito === habito.id && c.data >= inicio && c.data <= fim)
    .map((c) => c.data);
  return new Set(datas).size;
}
