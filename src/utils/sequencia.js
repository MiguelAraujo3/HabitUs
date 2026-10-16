// Cálculo de sequência de hábitos (funções puras).
// Não lê relógio, DOM nem storage: recebe a frequência do hábito, as datas
// de conclusão ('AAAA-MM-DD') e a data de referência, e devolve { atual, maior }.
//
// Regras:
// - diária: soma 1 por dia seguido;
// - dias-semana: soma 1 por dia previsto; perde se um dia previsto passa sem
//   marcação (dias fora da escala não contam nem quebram);
// - o dia em curso nunca quebra a sequência (ainda dá tempo de marcar).

const MS_DIA = 86400000;

// Número do dia (dias desde 1970, em UTC): evita erros de fuso/horário de verão
function numDia(chave) {
  const [ano, mes, dia] = chave.split('-').map(Number);
  return Math.round(Date.UTC(ano, mes - 1, dia) / MS_DIA);
}

function diaDaSemana(n) {
  return new Date(n * MS_DIA).getUTCDay(); // 0 = domingo
}

export function calcularSequencia(frequencia, datasConclusao, chaveHoje) {
  const hoje = numDia(chaveHoje);
  const diasPrevistos =
    frequencia && frequencia.tipo === 'dias-semana' && frequencia.dias && frequencia.dias.length
      ? frequencia.dias
      : null; // null = todos os dias

  const agendado = (n) => !diasPrevistos || diasPrevistos.includes(diaDaSemana(n));

  // Existe algum dia previsto estritamente entre a e b sem marcação?
  const temAgendadoEntre = (a, b) => {
    for (let n = a + 1; n < b; n++) {
      if (agendado(n)) return true;
    }
    return false;
  };

  const validas = [...new Set(datasConclusao.map(numDia))]
    .filter((n) => n <= hoje && agendado(n))
    .sort((a, b) => a - b);

  if (validas.length === 0) return { atual: 0, maior: 0 };

  let atual = 0;
  let maior = 0;
  validas.forEach((n, i) => {
    const continua = i > 0 && !temAgendadoEntre(validas[i - 1], n);
    atual = continua ? atual + 1 : 1;
    maior = Math.max(maior, atual);
  });

  // A sequência só segue viva se nenhum dia previsto passou sem marcação desde a última
  const viva = !temAgendadoEntre(validas[validas.length - 1], hoje);
  return { atual: viva ? atual : 0, maior };
}
