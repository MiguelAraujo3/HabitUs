// Funções puras de data — Stage S1-06
// Nenhuma das funções altera a data recebida (trabalha com cópia)
// NÃO usar toISOString() (converte para UTC e erra à noite no Brasil)
// NÃO usar Intl.DateTimeFormat com timeZone:'local' (lança RangeError)

// hoje() — horário LOCAL
export function hoje() {
  return new Date();
}

// paraChave(data) — 'AAAA-MM-DD' sem usar toISOString
export function paraChave(data) {
  const d = new Date(data); // copia
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

// deChave('AAAA-MM-DD') — Date local sem interpretar como UTC
export function deChave(chave) {
  const ano = parseInt(chave.substring(0, 4));
  const mes = parseInt(chave.substring(5, 7)) - 1;
  const dia = parseInt(chave.substring(8, 10));
  return new Date(ano, mes, dia); // Date local, sem conversão UTC
}

// mesmoDia(a, b) — compara no fuso local
export function mesmoDia(a, b) {
  return paraChave(a) === paraChave(b);
}

// inicioDaSemana(data) — domingo 00:00:00.000 fuso local
export function inicioDaSemana(data) {
  const d = new Date(data); // copia
  d.setHours(0, 0, 0, 0);
  const diaSemana = d.getDay(); // 0=Domingo, 1=Segunda, ..., 6=Sábado
  if (diaSemana !== 0) {
    d.setDate(d.getDate() - diaSemana);
  }
  return d;
}

// fimDaSemana(data) — sábado 23:59:59.999 fuso local
export function fimDaSemana(data) {
  const d = new Date(data); // copia
  d.setHours(23, 59, 59, 999);
  const diaSemana = d.getDay();
  if (diaSemana !== 6) {
    d.setDate(d.getDate() + (6 - diaSemana));
  }
  return d;
}

// somarDias(data, n) — adiciona n dias (copia antes, nunca muta original)
export function somarDias(data, n) {
  const d = new Date(data); // copia
  d.setDate(d.getDate() + n);
  return d;
}

// diaDaSemana(data) — 0=Domingo a 6=Sábado
export function diaDaSemana(data) {
  return data.getDay();
}
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
