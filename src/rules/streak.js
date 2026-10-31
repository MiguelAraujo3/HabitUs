// Regras puras de sequência e pontos — nenhuma função altera dados.
// Toda a lógica de sequências vive aqui (src/rules/), nunca no código de UI.
//
// As datas são chaves 'AAAA-MM-DD'. Todas as funções de sequência aceitam a data de
// referência (`chaveHoje`) como último argumento; sem ela, usam o dia de hoje. Passando a
// data, a função é pura (mesma entrada, mesma saída), o que facilita os testes.
//
// Regras:
// - diária: soma 1 por dia seguido;
// - dias da semana: soma 1 por dia escolhido; perde se um dia escolhido passa sem marcação
//   (dias fora da escala não contam nem quebram). Se os dias foram trocados, a troca vale só
//   a partir do dia dela: o passado continua sendo calculado com os dias que valiam na época;
// - vezes na semana: soma 1 a cada dia marcado, até a meta da semana (domingo a sábado);
//   marcar além da meta não soma. Se a semana termina abaixo da meta, a sequência volta a 0.
//   O recorde guarda o maior valor já atingido, mesmo que a semana depois tenha falhado;
// - o dia (ou a semana) em curso nunca quebra a sequência: ainda dá tempo de marcar.

import { hoje, paraChave } from '../utils/datas.js';

const MS_DIA = 86400000;

// Número do dia (dias desde 1970, em UTC): evita erros de fuso/horário de verão ao contar dias
function numDia(chave) {
  const [ano, mes, dia] = chave.split('-').map(Number);
  return Math.round(Date.UTC(ano, mes - 1, dia) / MS_DIA);
}

function diaDaSemanaDeNum(n) {
  return new Date(n * MS_DIA).getUTCDay(); // 0 = domingo
}

function chaveDeHoje() {
  return paraChave(hoje());
}

// Devolve uma função que diz se um dia (número de dia) é previsto para o hábito.
// Na frequência "dias da semana", `dias` são os dias de hoje e `historico` guarda os dias
// antigos, se já foram trocados: [{ ate: 'AAAA-MM-DD', dias: [...] }]. Cada período vale até
// a data `ate` (inclusive); depois do último, valem os dias atuais.
function criarAgendamento(frequencia) {
  const tipo = frequencia ? frequencia.tipo : 'diaria';
  if (tipo !== 'dias-semana') return () => true; // diária: todo dia é previsto

  const anteriores = (frequencia.historico || [])
    .map((periodo) => ({ ate: numDia(periodo.ate), dias: periodo.dias }))
    .sort((a, b) => a.ate - b.ate);

  return (n) => {
    const periodo = anteriores.find((p) => n <= p.ate);
    const dias = periodo ? periodo.dias : frequencia.dias;
    // Sem dias (dado antigo): na prática é todo dia
    return !dias || dias.length === 0 || dias.includes(diaDaSemanaDeNum(n));
  };
}

// Diária e dias da semana: "agendado(n)" diz se o dia n é previsto
function sequenciaPorDias(datas, agendado, hojeN) {

  // Existe algum dia previsto estritamente entre a e b sem marcação?
  const temAgendadoEntre = (a, b) => {
    for (let n = a + 1; n < b; n++) {
      if (agendado(n)) return true;
    }
    return false;
  };

  const validas = datas.filter(agendado);
  if (validas.length === 0) return { atual: 0, maior: 0 };

  const resultado = validas.reduce(
    (acc, n, i) => {
      const continua = i > 0 && !temAgendadoEntre(validas[i - 1], n);
      const atual = continua ? acc.atual + 1 : 1;
      return { atual, maior: Math.max(acc.maior, atual) };
    },
    { atual: 0, maior: 0 }
  );

  // Só segue viva se nenhum dia previsto passou sem marcação desde a última conclusão
  const viva = !temAgendadoEntre(validas[validas.length - 1], hojeN);
  return { atual: viva ? resultado.atual : 0, maior: resultado.maior };
}

// "X vezes por semana": semanas de domingo a sábado.
// Cada dia marcado soma 1 na hora (até a meta da semana); marcar além da meta não soma.
// Semana que termina abaixo da meta zera a sequência, mas o recorde guarda o pico alcançado.
function sequenciaVezesNaSemana(datas, meta, hojeN) {
  const semanaDe = (n) => n - diaDaSemanaDeNum(n); // número do domingo da semana
  const semanaAtual = semanaDe(hojeN);

  const contagem = datas.reduce((mapa, n) => {
    const s = semanaDe(n);
    mapa.set(s, (mapa.get(s) || 0) + 1);
    return mapa;
  }, new Map());
  const semanas = [...contagem.keys()].sort((a, b) => a - b);

  const resultado = semanas.reduce(
    (acc, s, i) => {
      const marcadas = contagem.get(s);
      // Houve semana(s) sem nenhuma marcação entre a anterior e esta: a sequência tinha zerado
      const base = i > 0 && s - semanas[i - 1] > 7 ? 0 : acc.atual;
      const pico = base + Math.min(marcadas, meta); // soma 1 por marcação, até a meta
      const falhou = marcadas < meta && s < semanaAtual; // semana terminou abaixo da meta
      return { atual: falhou ? 0 : pico, maior: Math.max(acc.maior, pico) };
    },
    { atual: 0, maior: 0 }
  );

  // Uma semana inteira sem marcação entre a última registrada e a atual quebra a sequência
  const viva = semanaAtual - semanas[semanas.length - 1] <= 7;
  return { atual: viva ? resultado.atual : 0, maior: resultado.maior };
}

// Ponto de entrada geral: devolve { atual, maior } para qualquer frequência do modelo
// frequencia: { tipo: 'diaria' | 'dias-semana' | 'vezes-semana', dias?: number[], vezes?: number,
//   historico?: { ate: string, dias: number[] }[] }
export function calcularSequencia(frequencia, completes, chaveHoje = chaveDeHoje()) {
  const hojeN = numDia(chaveHoje);
  const datas = [...new Set(completes.map(numDia))]
    .filter((n) => n <= hojeN)
    .sort((a, b) => a - b);

  if (datas.length === 0) return { atual: 0, maior: 0 };

  const tipo = frequencia ? frequencia.tipo : 'diaria';
  if (tipo === 'vezes-semana') {
    return sequenciaVezesNaSemana(datas, frequencia.vezes || 1, hojeN);
  }
  return sequenciaPorDias(datas, criarAgendamento(frequencia), hojeN);
}

// Atalhos usados pelos testes e por quem só precisa de um dos números
export function calcularSequenciaDiaria(completes, chaveHoje = chaveDeHoje()) {
  return calcularSequencia({ tipo: 'diaria' }, completes, chaveHoje).atual;
}

export function calcularSequenciaDiasDaSemana(completes, diasSelecionados, chaveHoje = chaveDeHoje()) {
  return calcularSequencia({ tipo: 'dias-semana', dias: diasSelecionados }, completes, chaveHoje).atual;
}

export function calcularSequenciaVezesNaSemana(completes, meta, chaveHoje = chaveDeHoje()) {
  return calcularSequencia({ tipo: 'vezes-semana', vezes: meta }, completes, chaveHoje).atual;
}

export function calcularMaiorSequencia(completes, frequencia, chaveHoje = chaveDeHoje()) {
  return calcularSequencia(frequencia, completes, chaveHoje).maior;
}

// Soma dos pontos das atividades concluídas (pontos 1 a 10, definido em src/data/modelo.js).
export function calcularPontos(atividades) {
  return atividades.reduce((total, atividade) => total + atividade.pontos, 0);
}

export function calcularDataRecorde(
  frequencia,
  conclusoes,
  chaveHoje = chaveDeHoje()
) {
  const datas = [...new Set(conclusoes)]
    .filter((data) => data <= chaveHoje)
    .sort();

  const recorde = calcularSequencia(frequencia, datas, chaveHoje).maior;

  if (recorde === 0) {
    return null;
  }

  let dataRecorde = null;

  for (const data of datas) {
    const anteriores = datas.filter((dia) => dia < data);

    const antes = calcularSequencia(frequencia, anteriores, data).atual;
    const depois = calcularSequencia(frequencia, datas, data).atual;

    if (depois === recorde && antes < recorde) {
      dataRecorde = data;
    }
  }

  return dataRecorde;
}