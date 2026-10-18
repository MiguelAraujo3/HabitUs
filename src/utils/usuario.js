// Usa o nome do perfil; recorre ao username quando o nome estiver vazio.
// Aceita tambem o nome como texto e retorna '?' quando nao houver identificacao.
export function obterIniciais(usuario) {
  const nome = typeof usuario === 'string'
    ? usuario
    : usuario?.name?.trim() || usuario?.username || '';

  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(parte => parte[0])
    .join('')
    .toUpperCase() || '?';
}
