// Menu lateral — montado com createElement/appendChild.
// As páginas fazem: const menu = criarNavbar(); menuPai.appendChild(menu);
import {
  obterUsuarioAtual,
  encerrarSessao,
} from '../data/index.js';

const BASE = import.meta.env.BASE_URL;

export async function criarNavbar() {
  const usuario = await obterUsuarioAtual();

  const nome = usuario? `Olá, ${usuario.name.split(' ')[0]}`: 'Cadastro/Login';

  const linkEntrada = usuario ? 'perfil.html' : 'index.html';
  const menu = criarMenu(nome, linkEntrada);

  if (usuario) {
    const sair = document.createElement('button');
    sair.type = 'button';
    sair.textContent = 'Sair';
    sair.classList.add('cursor-pointer', 'hover:text-brand-ice');
    sair.addEventListener('click', async () => {
      sair.disabled = true;

      try {
        await encerrarSessao();
        window.location.href = `${BASE}index.html`;
      } catch {
        sair.disabled = false;
        sair.textContent = 'Tentar sair novamente';
      }
    });

    menu.appendChild(sair);
  }

  return menu;
}

function criarMenu(nome, linkEntrada) {
  const elementoMenu = document.createElement('header');
  elementoMenu.className = 'bg-brand-gray text-white h-screen w-64 flex flex-col py-8 px-6 shadow-md shrink-0';

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
    { texto: 'Perfil', destino: 'perfil.html' },
  ];

  for (const link of links) {
    const ancora = document.createElement('a');
    ancora.href = `${BASE}${link.destino}`;
    ancora.className = 'hover:text-brand-ice transition-colors';
    ancora.textContent = link.texto;
    navegacao.appendChild(ancora);
  }

  elementoMenu.appendChild(navegacao);

  const entrada = document.createElement('a');
  entrada.href = `${BASE}${linkEntrada}`;
  entrada.className = 'mt-auto text-sm font-medium hover:text-brand-ice transition-colors';
  entrada.textContent = nome;
  elementoMenu.appendChild(entrada);

  return elementoMenu;
}
