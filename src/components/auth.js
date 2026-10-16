// Guarda de login — impede o acesso a páginas internas sem sessão.
// A sessão é a mesma chave usada pelo navbar (localStorage 'usuarioLogado').

const CHAVE_SESSAO = 'usuarioLogado';
const CHAVE_DESTINO = 'destinoLogin';

// sessaoAtual() — devolve o objeto da sessão ou null quando não há sessão.
function sessaoAtual() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO));
  } catch (erro) {
    return null;
  }
}

// exigirLogin() — chamada no início de cada página interna.
// Se não houver sessão, guarda para onde voltar e volta para a página de login.
export function exigirLogin() {
  if (sessaoAtual()) {
    return true;
  }

  localStorage.setItem(CHAVE_DESTINO, window.location.href);
  window.location.href = 'index.html';
  return false;
}
