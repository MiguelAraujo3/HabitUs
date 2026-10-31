// A sequência é sempre exibida em DIAS, qualquer que seja a frequência do hábito.
// Nos hábitos "X vezes por semana", cada semana cumprida soma a meta inteira
// (meta 4: 1 semana = 4 dias, 2 semanas = 8 dias), então o valor já vem em dias.
// A frequência em si ("4x por semana") aparece à parte, em rules/frequencia.ts (rotuloFrequencia).

/**
 * @param {number} valor sequência em dias
 * @param {unknown} [_frequencia] ignorado; mantido para não quebrar quem ainda chama com 2 argumentos (perfil.js)
 * @returns {string}
 */
export function formatarSequencia(valor, _frequencia) {
  return `${valor} ${valor === 1 ? 'dia' : 'dias'}`;
}
