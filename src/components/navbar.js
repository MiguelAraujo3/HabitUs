// Navegação principal da aplicação.
// Desktop: menu lateral fixo à esquerda. Mobile: barra inferior fixa.
// Montado com createElement/appendChild (o projeto não usa React).
// As páginas fazem: const menu = await criarNavbar(); if (menu) menuPai.appendChild(menu);

import {
  obterUsuarioAtual,
} from '../data/index.js';
import { icone } from './icones.js';
import { obterIniciais } from '../utils/usuario.js';

const BASE = import.meta.env.BASE_URL;

// Telas de autenticação: a navegação principal não é montada nelas.
// Hoje o login e o cadastro vivem na mesma página (index.html); se a recuperação
// de senha entrar no projeto, basta acrescentar o arquivo a esta lista.
const PAGINAS_DE_AUTENTICACAO = ['index.html'];

// Itens do menu. Os ícones saem do catálogo SVG de ./icones.js (traço Lucide).
// "tambemEm" marca páginas filhas que mantêm o item em destaque (ex.: grupo).
const ITENS = [
  { texto: 'Hábitos', destino: 'habitos.html', icone: 'Home' },
  { texto: 'Feed', destino: 'feed.html', icone: 'Newspaper' },
  { texto: 'Grupos', destino: 'grupos.html', icone: 'Users', tambemEm: ['grupo.html', 'criar-grupo.html'] },
  { texto: 'Perfil', destino: 'perfil.html', icone: 'UserRound' },
];

// Classes utilitárias do Tailwind (escritas por extenso para o Tailwind encontrá-las).
const CLASSE_ITEM_ATIVO =
  'flex items-center gap-3 rounded-xl bg-brand-dark px-4 py-2 text-sm font-semibold text-white ' +
  'transition-all duration-300 ease-in-out active:scale-95';
const CLASSE_ITEM_INATIVO =
  'flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 ' +
  'transition-all duration-300 ease-in-out hover:bg-slate-100 hover:text-slate-900 active:scale-95';
const CLASSE_ITEM_BAIXO =
  'flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium ' +
  'transition-all duration-300 ease-in-out active:scale-95';
const CLASSE_CAIXA_ICONE_ATIVO =
  'inline-flex items-center justify-center rounded-full bg-(--lima) p-2 text-black';
const CLASSE_CAIXA_ICONE_INATIVO =
  'inline-flex items-center justify-center rounded-full p-2 text-slate-600';

// Monta a navegação da página atual.
// Devolve null nas telas de autenticação, para que a barra de navegação
// nunca apareça nelas.
export async function criarNavbar() {
  if (ehPaginaDeAutenticacao()) {
    return null;
  }

  const usuario = await obterUsuarioAtual();

  const lateral = criarMenuLateral(usuario);

  // A barra inferior é `fixed` e entra direto no <body>: assim ela aparece em
  // qualquer página, sem depender das classes do container #menu.
  document.body.appendChild(criarBarraInferior());

  return lateral;
}

// ---------- Menu lateral (desktop) ----------

function criarMenuLateral(usuario) {
  const elementoMenu = document.createElement('header');
  elementoMenu.className =
    'hidden md:flex h-screen w-64 shrink-0 flex-col bg-white px-6 py-8 shadow-md';

  // LOGO — estrutura e área no topo do menu mantidas como antes.
  const logo = document.createElement('div');
  logo.className = 'mb-10 text-xl font-bold tracking-widest text-brand-dark';
  logo.textContent = 'LOGO';
  elementoMenu.appendChild(logo);

  const navegacao = document.createElement('nav');
  navegacao.className = 'flex flex-col gap-2';
  navegacao.setAttribute('aria-label', 'Navegação principal');

  for (const item of ITENS) {
    navegacao.appendChild(criarItemLateral(item));
  }
  elementoMenu.appendChild(navegacao);

  // Rodapé do menu: cartão do usuário (leva ao perfil).
  const rodape = document.createElement('div');
  rodape.className = 'mt-auto';
  rodape.appendChild(usuario ? criarCartaoUsuario(usuario) : criarLinkEntrada());
  elementoMenu.appendChild(rodape);

  return elementoMenu;
}

// Cartão do usuário: avatar com iniciais + nome e @usuário.
// Clicar no cartão abre a página de perfil.
function criarCartaoUsuario(usuario) {
  const cartao = document.createElement('a');
  cartao.id = 'card-usuario';
  cartao.href = `${BASE}perfil.html`;
  cartao.className =
    'flex items-center gap-3 rounded-lg p-2 transition-colors duration-300 ease-in-out ' +
    'hover:bg-gray-100 active:scale-95';

  const avatar = document.createElement('span');
  avatar.id = 'usuario-avatar';
  avatar.className =
    'flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 ' +
    'text-sm font-bold text-blue-600';
  avatar.textContent = obterIniciais(usuario);
  cartao.appendChild(avatar);

  const informacoes = document.createElement('span');
  informacoes.className = 'flex min-w-0 flex-col';

  const nome = document.createElement('span');
  nome.id = 'usuario-nome';
  nome.className = 'truncate text-sm font-bold text-gray-900';
  nome.textContent = usuario.name;
  informacoes.appendChild(nome);

  const username = document.createElement('span');
  username.id = 'usuario-username';
  username.className = 'truncate text-xs text-slate-500';
  username.textContent = `@${usuario.username}`;
  informacoes.appendChild(username);

  cartao.appendChild(informacoes);

  return cartao;
}

// Sem sessão iniciada: convite para entrar na conta.
function criarLinkEntrada() {
  const entrada = document.createElement('a');
  entrada.id = 'card-usuario';
  entrada.href = `${BASE}index.html`;
  entrada.className =
    'flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-slate-600 ' +
    'transition-colors duration-300 ease-in-out hover:bg-gray-100 active:scale-95';
  entrada.textContent = 'Cadastro/Login';

  return entrada;
}

function criarItemLateral(item) {
  const ativo = ehPaginaAtual(item);

  const ancora = document.createElement('a');
  ancora.href = `${BASE}${item.destino}`;
  ancora.className = ativo ? CLASSE_ITEM_ATIVO : CLASSE_ITEM_INATIVO;
  if (ativo) {
    ancora.setAttribute('aria-current', 'page');
  }

  ancora.appendChild(icone(item.icone, { tamanho: 20, classe: 'shrink-0' }));

  const texto = document.createElement('span');
  texto.textContent = item.texto;
  ancora.appendChild(texto);

  return ancora;
}

// ---------- Barra inferior (mobile) ----------

function criarBarraInferior() {
  const barra = document.createElement('nav');
  barra.className =
    'fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around gap-1 md:hidden ' +
    'border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-4px_16px_rgb(0_0_0/0.06)]';
  barra.setAttribute('aria-label', 'Navegação principal');

  for (const item of ITENS) {
    barra.appendChild(criarItemInferior(item));
  }

  return barra;
}

function criarItemInferior(item) {
  const ativo = ehPaginaAtual(item);

  const ancora = document.createElement('a');
  ancora.href = `${BASE}${item.destino}`;
  ancora.className =
    `${CLASSE_ITEM_BAIXO} ${ativo ? 'text-brand-dark' : 'text-slate-500'}`;
  if (ativo) {
    ancora.setAttribute('aria-current', 'page');
  }

  // No mobile só o ícone ativo ganha o fundo arredondado colorido.
  const caixa = document.createElement('span');
  caixa.className = ativo ? CLASSE_CAIXA_ICONE_ATIVO : CLASSE_CAIXA_ICONE_INATIVO;
  caixa.appendChild(icone(item.icone, { tamanho: 22, classe: 'shrink-0' }));
  ancora.appendChild(caixa);

  const texto = document.createElement('span');
  texto.textContent = item.texto;
  ancora.appendChild(texto);

  return ancora;
}

// ---------- Utilidades ----------

// Nome do arquivo da página atual (ex.: "habitos.html").
function paginaAtual() {
  return window.location.pathname.split('/').pop();
}

function ehPaginaDeAutenticacao() {
  return PAGINAS_DE_AUTENTICACAO.includes(paginaAtual());
}

// O item fica ativo na própria página e nas páginas filhas declaradas em "tambemEm".
function ehPaginaAtual(item) {
  const pagina = paginaAtual();
  return pagina === item.destino || (item.tambemEm || []).includes(pagina);
}
