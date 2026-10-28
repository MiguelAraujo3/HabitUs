// Regras puras dos hábitos do dia, compartilhadas pela página Hábitos e pelo painel lateral.
// Nenhuma função altera dados nem lê o relógio: o dia da semana e a chave da data entram
// como argumento, então a mesma entrada sempre dá a mesma saída (fácil de testar).
//
// diaDaSemana: 0 = domingo ... 6 = sábado. chave: 'AAAA-MM-DD'.

// O hábito é do dia? Só os de "dias da semana" podem ficar de fora; os demais são sempre do dia.
export function ehDoDia(habito, diaDaSemana) {
  const f = habito.frequencia;
  if (f && f.tipo === 'dias-semana' && Array.isArray(f.dias) && f.dias.length) {
    return f.dias.includes(diaDaSemana);
  }
  return true;
}

// Só os hábitos do dia (filter)
export function habitosDoDia(habitos, diaDaSemana) {
  return habitos.filter((h) => ehDoDia(h, diaDaSemana));
}

// Conclusão do hábito no dia informado, ou null se ainda não foi marcado
export function conclusaoDoDia(habito, conclusoes, chave) {
  return conclusoes.find((c) => c.idHabito === habito.id && c.data === chave) || null;
}

// Quantos dos hábitos informados estão marcados no dia (reduce)
export function contarFeitos(habitos, conclusoes, chave) {
  return habitos.reduce((soma, h) => soma + (conclusaoDoDia(h, conclusoes, chave) ? 1 : 0), 0);
}
