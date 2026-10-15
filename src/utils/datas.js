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