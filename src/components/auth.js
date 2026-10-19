import { obterUsuarioAtual } from '../data/index.js';

export async function exigirLogin() {
  const usuario = await obterUsuarioAtual();

  if (usuario) {
    return true;
  }

  localStorage.setItem('destinoLogin', window.location.href);
  window.location.href = `${import.meta.env.BASE_URL}index.html`;

  return false;
}