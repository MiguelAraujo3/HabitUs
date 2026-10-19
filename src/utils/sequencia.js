// O valor semanal soma a meta por semana cumprida; divide pela meta para exibir semanas.
export function formatarSequencia(valor, frequencia) {
  if (frequencia.tipo === 'vezes-semana') {
    const meta = frequencia.vezes || 1; // mesma proteção de calcularSequencia
    const semanas = valor / meta;

    return `${semanas} ${semanas === 1 ? 'semana' : 'semanas'} × ${meta}`;
  }

  return `${valor} ${valor === 1 ? 'dia' : 'dias'}`;
}