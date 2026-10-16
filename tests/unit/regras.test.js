// Testes das regras de sequência e pontos — executados pelo tests/test-runner.js.
// Todos os dias usados são simulados com new Date local; nada marca o calendário real.

import {
  calcularMaiorSequencia,
  calcularPontos,
  calcularSequenciaDiaria,
  calcularSequenciaDiasDaSemana,
  calcularSequenciaVezesNaSemana,
} from '../../src/rules/streak.js';
import { inicioDaSemana } from '../../src/utils/datas.js';

let erros = 0;

function testar(nome, condicao, mensagem = '') {
  if (!condicao) {
    console.log(`  NOT OK: ${nome} ${mensagem}`);
    erros++;
  } else {
    console.log(`  OK: ${nome}`);
  }
}

// Chave AAAA-MM-DD de uma data local.
function chave(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// Avança `dias` dias para trás a partir de `data` e devolve a data resultante.
function avancarParaTrás(data, dias) {
  let cursor = new Date(data);
  for (let i = 0; i < dias; i++) {
    cursor.setDate(cursor.getDate() - 1);
  }
  return cursor;
}

// Data `diasAtrás` atrás de hoje.
function dataAnterior(diasAtrás) {
  return avancarParaTrás(new Date(), diasAtrás);
}

// Início (domingo) da semana a partir de uma data.
function inicioDaSemanaDe(data) {
  return inicioDaSemana(new Date(data));
}

// Os dias selecionados entre hoje e `maxDiasAtrás` atrás, do mais recente ao mais antigo.
function datasEscolhidas(maxDiasAtrás, diasSelecionados) {
  const encontradas = [];
  let cursor = new Date();
  for (let i = 0; i <= maxDiasAtrás; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const dia = cursor.getDay();
    if (diasSelecionados.includes(dia) && !encontradas.some((data) => chave(data) === chave(cursor))) {
      encontradas.push(new Date(cursor));
    }
  }
  return encontradas;
}

// ========== Sequência diária ==========

async function testarSequenciaDiaria() {
  console.log('--- Sequência diária ---');

  // Hoje, ontem e anteontem estão marcados: sequência atual = 3.
  {
    const ontem = avancarParaTrás(new Date(), 1);
    const anteontem = avancarParaTrás(new Date(), 2);
    const completados = [chave(anteontem), chave(ontem), chave(new Date())];
    const atual = calcularSequenciaDiaria(completados);
    testar('conta dias consecutivos a partir de hoje', atual === 3, `atual=${atual}`);
  }

  // Hoje ainda não foi marcado: a sequência conta a partir de ontem.
  {
    const ontem = avancarParaTrás(new Date(), 1);
    const completados = [chave(ontem)];
    const atual = calcularSequenciaDiaria(completados);
    testar('conta a partir de ontem quando hoje nao foi marcado', atual === 1, `atual=${atual}`);
  }

  // Ontem foi marcado, mas o dia anterior não faz parte da sequência: reinicia nesta marcação.
  {
    const doisDiasAtras = avancarParaTrás(new Date(), 2);
    const completados = [chave(doisDiasAtras), chave(new Date())];
    const atual = calcularSequenciaDiaria(completados);
    testar('reinicia quando um dia nao foi marcado', atual === 1, `atual=${atual}`);
  }
}

// ========== Sequência por dias da semana ==========

async function testarSequenciaDiasDaSemana() {
  console.log('--- Sequência por dias da semana ---');

  // Dias selecionados: segunda (1), quarta (3) e sexta (5).
  const dias = [1, 3, 5];
  // Marca os últimos dias selecionados, começando em hoje e indo para trás.
  const marcados = [];
  let cursor = new Date();
  for (let i = 0; i < 40 && marcados.length < 3; i++) {
    if (dias.includes(cursor.getDay())) marcados.push(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  const completados = marcados.map((dia) => chave(dia));
  const atual = calcularSequenciaDiasDaSemana(completados, dias);
  testar('conta os dias selecionados marcados', atual === 3, `atual=${atual}`);

  // Somente um dos dias selecionados foi marcado: a sequência atual é 1.
  const diasSimples = [1, 3];
  const somente = datasEscolhidas(30, diasSimples)[0];
  const completadosSimples = [chave(somente)];
  const atualSimples = calcularSequenciaDiasDaSemana(completadosSimples, diasSimples);
  testar('ignora dias selecionados que nao foram marcados', atualSimples === 1, `atual=${atualSimples}`);
}

// ========== Sequência por vezes na semana ==========

async function testarSequenciaVezesNaSemana() {
  console.log('--- Sequência por vezes na semana ---');

  // Meta de 3. Na semana corrente há 2 conclusões: a meta não conta.
  {
    const completados = [chave(dataAnterior(1)), chave(dataAnterior(2))];
    const atual = calcularSequenciaVezesNaSemana(completados, 3);
    testar('meta nao atingida nao conta', atual === 0, `atual=${atual}`);
  }

  // Meta de 3. Na semana corrente há 3 conclusões: conta a meta.
  {
    const completados = [
      chave(dataAnterior(1)),
      chave(dataAnterior(2)),
      chave(dataAnterior(3)),
    ];
    const atual = calcularSequenciaVezesNaSemana(completados, 3);
    testar('meta atingida conta a meta', atual === 3, `atual=${atual}`);
  }

  // Semana anterior completa (meta batida): conta mesmo sem marcações esta semana.
  {
    const semanaAnteriorMeta = dataNaSemanasAtras(1); // início da semana anterior
    const completados = [];
    for (let i = 0; i < 3; i++) {
      const data = new Date(semanaAnteriorMeta);
      data.setDate(data.getDate() + i);
      completados.push(chave(data));
    }
    const atual = calcularSequenciaVezesNaSemana(completados, 3);
    testar('semana anterior completa conta', atual === 3, `atual=${atual}`);
  }

  // Semana anterior com meta insatisfeita: reinicia.
  {
    const completados = [
      chave(dataNaSemanasAtras(1)),
      chave(dataNaSemanasAtras(2)),
    ];
    const atual = calcularSequenciaVezesNaSemana(completados, 3);
    testar('meta insatisfeita reinicia', atual === 0, `atual=${atual}`);
  }
}

// ========== Maior sequência e pontos ==========

async function testarMaiorSequenciaECoresPontos() {
  console.log('--- Maior sequência e pontos ---');

  // Habit diário: 5 dias consecutivos completados.
  {
    const completados = [];
    for (let i = 4; i >= 0; i--) {
      completados.push(chave(avancarParaTrás(new Date(), i)));
    }
    const maior = calcularMaiorSequencia(completados, { tipo: 'diaria' });
    testar('diaria: maior sequência é 5', maior === 5, `maior=${maior}`);
  }

  // Habit com vezes por semana (meta 2): duas semanas completas somam 4.
  {
    const completados = [];
    for (let semana = 1; semana <= 2; semana++) {
      const inicio = dataNaSemanasAtras(semana);
      for (let i = 0; i < 2; i++) {
        const dia = new Date(inicio);
        dia.setDate(dia.getDate() + i);
        completados.push(chave(dia));
      }
    }
    const maior = calcularMaiorSequencia(completados, { tipo: 'vezes-semana', vezes: 2 });
    testar('vezes-semana: maior é 4', maior === 4, `maior=${maior}`);
  }

  // Pontos: soma dos pontos das atividades concluídas.
  {
    const total = calcularPontos([
      { pontos: 5 },
      { pontos: 3 },
      { pontos: 10 },
    ]);
    testar('pontos somam', total === 18, `total=${total}`);
    testar('pontos de lista vazia somam 0', calcularPontos([]) === 0);
  }
}

// Executa todos os testes acima.
export async function executarRegras() {
  await testarSequenciaDiaria();
  await testarSequenciaDiasDaSemana();
  await testarSequenciaVezesNaSemana();
  await testarMaiorSequenciaECoresPontos();
  return erros;
}

// ========== Auxiliares ==========

// Data da `semanasAtrás` semana atrás a partir da semana corrente.
function dataNaSemanasAtras(semanasAtrás) {
  let cursor = inicioDaSemanaDe(new Date());
  for (let i = 0; i < semanasAtrás * 7; i++) {
    cursor.setDate(cursor.getDate() - 1);
  }
  return cursor;
}
