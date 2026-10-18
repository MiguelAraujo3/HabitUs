const CHAVE_SESSAO = 'habitus_auth';

export async function iniciarSessao(userId) {
  localStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify({ userId })
  );
}

export async function obterSessao() {
  const texto = localStorage.getItem(CHAVE_SESSAO);
  
  if (!texto) {
    return null;
  }

  try {
    const sessao = JSON.parse(texto);

    if (typeof sessao?.userId !== 'string' || !sessao.userId) {
      return null
    }
    return { userId: sessao.userId};
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO)
}