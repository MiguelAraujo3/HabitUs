const CHAVE_SESSAO = 'habitus_auth';

export interface SessaoUsuario {
  userId: string;
}

export async function iniciarSessao(userId: string): Promise<void> {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ userId }));
}

export async function obterSessao(): Promise<SessaoUsuario | null> {
  const texto = localStorage.getItem(CHAVE_SESSAO);

  if (!texto) {
    return null;
  }

  try {
    const sessao = JSON.parse(texto);

    if (typeof sessao?.userId !== 'string' || !sessao.userId) {
      return null;
    }
    return { userId: sessao.userId };
  } catch {
    return null;
  }
}

export async function encerrarSessao(): Promise<void> {
  localStorage.removeItem(CHAVE_SESSAO);
}
