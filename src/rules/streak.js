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
//   (dias fora da escala não contam nem quebram);
// - vezes na semana: ao atingir a meta na semana (domingo a sábado) soma a meta inteira;
//   perde se a semana termina abaixo da meta;
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

// Diária e dias da semana (diasPrevistos = null significa todos os dias)
function sequenciaPorDias(datas, diasPrevistos, hojeN) {
  const agendado = (n) => !diasPrevistos || diasPrevistos.includes(diaDaSemanaDeNum(n));

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

// "X vezes por semana": semanas de domingo a sábado
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
      let atual = acc.atual;
      if (i > 0 && s - semanas[i - 1] > 7) atual = 0; // houve semana(s) sem nenhuma marcação
      if (contagem.get(s) >= meta) {
        atual += meta; // meta atingida: soma a meta inteira
      } else if (s < semanaAtual) {
        atual = 0; // semana terminou abaixo da meta
      } // semana em curso abaixo da meta: segue pendente
      return { atual, maior: Math.max(acc.maior, atual) };
    },
    { atual: 0, maior: 0 }
  );

  // Uma semana inteira sem marcação entre a última registrada e a atual quebra a sequência
  const viva = semanaAtual - semanas[semanas.length - 1] <= 7;
  return { atual: viva ? resultado.atual : 0, maior: resultado.maior };
}

// Ponto de entrada geral: devolve { atual, maior } para qualquer frequência do modelo
// frequencia: { tipo: 'diaria' | 'dias-semana' | 'vezes-semana', dias?: number[], vezes?: number }
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
  const dias = tipo === 'dias-semana' && frequencia.dias && frequencia.dias.length ? frequencia.dias : null;
  return sequenciaPorDias(datas, dias, hojeN);
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