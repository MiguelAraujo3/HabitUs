// Regras puras de sequência e pontos — nenhuma função altera dados.
// Toda a lógica de sequências vive aqui (src/rules/), nunca no código de UI.

import { deChave, inicioDaSemana, paraChave } from '../utils/datas.js';

// Chave de conclusão: 'AAAA-MM-DD' (mesma chave usada pelo armazenamento).
function conclui(completes, chave) {
  return completes.some((data) => data === chave);
}

// Início (domingo) da semana em que a conclusão cai, como chave AAAA-MM-DD.
function chaveInicioDaSemana(data) {
  return paraChave(inicioDaSemana(deChave(data)));
}

// A meta (quantidade por semana) só conta quando atingida.
function metaAlcançada(concluidas, meta) {
  return concluidas >= meta;
}

// Sequência atual de um hábito diário: dias consecutivos terminando hoje
// (ou ontem, se hoje ainda não foi marcado).
export function calcularSequenciaDiaria(completes) {
  const hoje = paraChave(new Date());
  let sequencia = 0;
  let cursor = new Date();
  if (!conclui(completes, hoje)) {
    cursor.setDate(cursor.getDate() - 1); // hoje ainda não foi marcado: conta a partir de ontem
  }
  while (conclui(completes, paraChave(cursor))) {
    sequencia++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return sequencia;
}

// Sequência atual de um hábito com dias da semana escolhidos: só os dias
// selecionados contam, e só quebram a sequência quando um deles não é marcado.
export function calcularSequenciaDiasDaSemana(completes, diasSelecionados) {
  const hoje = new Date();
  let sequencia = 0;
  let cursor = new Date();
  if (!ehDiaEscolhido(diasSelecionados, hoje)) {
    cursor.setDate(cursor.getDate() - 1); // hoje não é um dia escolhido: conta a partir de ontem
  }
  while (true) {
    if (!ehDiaEscolhido(diasSelecionados, cursor)) {
      // O dia corrente não faz parte da sequência: segue contando atrás.
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (!conclui(completes, paraChave(cursor))) {
      break;
    }
    sequencia++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return sequencia;
}

function ehDiaEscolhido(diasSelecionados, data) {
  return diasSelecionados.includes(data.getDay());
}

// Sequência atual de um hábito com quantidades por semana: a meta só conta
// quando a semana atinge o alvo (a semana corrente conta se já atingiu).
export function calcularSequenciaVezesNaSemana(completes, meta) {
  const semanas = agruparSemanas(completes);
  let sequencia = 0;
  // As semanas são percorridas da mais recente para a mais antiga.
  for (const chaveSemana of Object.keys(semanas).sort().reverse()) {
    if (metaAlcançada(concluidasDaSemana(semanas, chaveSemana), meta)) {
      sequencia += meta;
    } else {
      break; // o streak reinicia a partir daqui
    }
  }
  return sequencia;
}

function concluidasDaSemana(semanas, chaveSemana) {
  return semanas[chaveSemana] || 0;
}

function agruparSemanas(completes) {
  const semanas = {};
  for (const data of completes) {
    const chave = chaveInicioDaSemana(data);
    semanas[chave] = (semanas[chave] || 0) + 1;
  }
  return semanas;
}

// Maior sequência: percorre todos os dias (ou semanas) desde a primeira conclusão.
export function calcularMaiorSequencia(completes, frequencia) {
  if (frequencia.tipo === 'vezes-semana') {
    const semanas = agruparSemanas(completes);
    let maior = 0;
    let sequencia = 0;
    // As semanas são percorridas da mais recente para a mais antiga.
    for (const chaveSemana of Object.keys(semanas).sort().reverse()) {
      const concluidas = semanas[chaveSemana] || 0;
      if (metaAlcançada(concluidas, frequencia.vezes)) {
        sequencia += frequencia.vezes;
        if (sequencia > maior) {
          maior = sequencia;
        }
      } else {
        break;
      }
    }
    return maior;
  }

  let maior = 0;
  let cursor = primeiroDia(completes);
  const hoje = new Date();
  while (cursor <= hoje) {
    const sequencia = sequenciaFinalizandoEm(cursor, frequencia, completes);
    if (sequencia > maior) {
      maior = sequencia;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return maior;
}

// Contagem da sequência que termina exatamente no dia `data`.
function sequenciaFinalizandoEm(data, frequencia, completes) {
  const chave = paraChave(data);
  let sequencia = 0;
  let cursor = new Date(data);
  if (frequencia.tipo === 'diaria') {
    while (conclui(completes, paraChave(cursor))) {
      sequencia++;
      cursor.setDate(cursor.getDate() - 1);
    }
  } else {
    while (true) {
      if (!ehDiaEscolhido(frequencia.dias, cursor)) {
        // O dia corrente não faz parte da sequência: segue contando atrás.
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      if (!conclui(completes, paraChave(cursor))) {
        break;
      }
      sequencia++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return sequencia;
}

// Soma dos pontos das atividades concluídas (pontos 1 a 10, definido em src/data/modelo.js).
export function calcularPontos(atividades) {
  return atividades.reduce((total, atividade) => total + atividade.pontos, 0);
}

function primeiroDia(completes) {
  let cursor = null;
  for (const data of completes) {
    if (cursor === null || data < cursor) {
      cursor = data;
    }
  }
  return cursor ? deChave(cursor) : new Date();
}
