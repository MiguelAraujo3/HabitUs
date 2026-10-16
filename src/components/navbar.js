// Menu lateral — montado com createElement/appendChild.
// As páginas fazem: const menu = showMenu(); menuPai.appendChild(menu);

export function showMenu() {
  const usuarioLogado = lerSessao();

  let nome = 'Cadastro/Login';
  let linkLogin = 'index.html';
  if (usuarioLogado && usuarioLogado !== null) {
    nome = `Olá, ${usuarioLogado.username.split(' ')[0]}`;
    linkLogin = 'perfil.html';
  }

  return criarMenu(nome, linkLogin);
}

function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
  } catch (erro) {
    return null;
  }
}

function criarMenu(nome, linkLogin) {
  const elementoMenu = document.createElement('header');
  elementoMenu.className = 'bg-brand-gray text-white fixed top-0 left-0 h-screen w-64 flex flex-col py-8 px-6 shadow-md z-50';

  const logo = document.createElement('div');
  logo.className = 'text-xl font-bold tracking-widest mb-10';
  logo.textContent = 'LOGO';
  elementoMenu.appendChild(logo);

  const navegacao = document.createElement('nav');
  navegacao.className = 'flex flex-col gap-6 text-sm font-medium';

  const links = [
    { texto: 'Hábitos', destino: 'habitos.html' },
    { texto: 'Feed', destino: 'feed.html' },
    { texto: 'Grupos', destino: 'grupos.html' },
    { texto: 'Criar Grupo', destino: 'criar-grupo.html' },
  ];

  for (const link of links) {
    const ancora = document.createElement('a');
    ancora.href = link.destino;
    ancora.className = 'hover:text-brand-ice transition-colors';
    ancora.textContent = link.texto;
    navegacao.appendChild(ancora);
  }

  elementoMenu.appendChild(navegacao);

  const entrada = document.createElement('a');
  entrada.href = linkLogin;
  entrada.className = 'mt-auto text-sm font-medium hover:text-brand-ice transition-colors';
  entrada.textContent = nome;
  elementoMenu.appendChild(entrada);

  return elementoMenu;
}
