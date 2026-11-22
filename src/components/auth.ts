import { obterUsuarioAtual } from '../data/index';

export async function exigirLogin(): Promise<boolean> {
  const usuario = await obterUsuarioAtual();

  if (usuario) {
    return true;
  }

  localStorage.setItem('destinoLogin', window.location.href);
  window.location.href = '/index.html';

  return false;
}