export function lerLista(chave) {
  const dados = localStorage.getItem(chave);
  if (dados === null) return [];
  try {
    return JSON.parse(dados);
  } catch (erro) {
    return [];
  }
}

export function salvarLista(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}