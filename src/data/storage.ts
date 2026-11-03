export function lerLista<T = any>(chave: string): T[] {
  const dados = localStorage.getItem(chave);
  if (dados === null) return [];
  try {
    return JSON.parse(dados) as T[];
  } catch (erro) {
    return [];
  }
}

export function salvarLista<T>(chave: string, lista: T[]): void {
  localStorage.setItem(chave, JSON.stringify(lista));
}
