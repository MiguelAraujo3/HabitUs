import { paraChave, hoje } from './datas.js';

// ---------------------------------------------------------------------------
// Formatação e período (telas de grupos)

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_LONGOS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

// formatarDia('2026-10-13') -> '13 out'; formatarDia('2026-10-13', true) -> '13 de outubro de 2026'
// Lê a chave como texto: não cria Date, então não sofre com fuso horário.
export function formatarDia(chave, longo = false) {
  const ano = parseInt(chave.substring(0, 4));
  const mes = parseInt(chave.substring(5, 7));
  const dia = parseInt(chave.substring(8, 10));
  if (longo) {
    return `${dia} de ${MESES_LONGOS[mes - 1]} de ${ano}`;
  }
  return `${dia} ${MESES_CURTOS[mes - 1]}`;
}

// statusDoPeriodo(inicio, fim) -> 'nao-iniciado' | 'andamento' | 'encerrado'
// Chaves 'AAAA-MM-DD' podem ser comparadas como texto.
export function statusDoPeriodo(dataInicio, dataFim, chaveHoje = paraChave(hoje())) {
  if (chaveHoje < dataInicio) {
    return 'nao-iniciado';
  }
  if (chaveHoje > dataFim) {
    return 'encerrado';
  }
  return 'andamento';
}
