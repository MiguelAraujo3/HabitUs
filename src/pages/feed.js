import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { getUserById } from '../data/index.js';
import * as repoPostagens from '../data/postagens.js';
import * as repoHabitos from '../data/habitos.js';

const listaPostagens = document.querySelector('#lista-postagens');
const estadoVazio = document.querySelector('#estado-vazio');

function atualizarEstadoVazio() {
  const temPostagens = listaPostagens.children.length > 0;
  estadoVazio.hidden = temPostagens;
}

async function carregarPostagens() {
  const postagens = await repoPostagens.listar();
  const ordenadas = [...postagens].sort(
    (a, b) => new Date(b.dataHora) - new Date(a.dataHora)
  );

  return Promise.all(
    ordenadas.map(async (postagem) => {
      const autor = await getUserById(postagem.idUsuario);
      const habito = await repoHabitos.buscarPorId(postagem.idHabito);
      return { ...postagem, autor, habito };
    })
  );
}

function criarElemento(tag, classes, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classes;
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function iniciais(nome) {
  return nome
    .trim()
    .split(' ')
    .filter((parte) => parte !== '')
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}

function criarCartaoPostagem(postagem) {
  const item = criarElemento('li', 'flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm');

  const cabecalho = criarElemento('div', 'flex items-center gap-3');
  const avatar = criarElemento(
    'div',
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800',
    iniciais(postagem.autor.name)
  );
  const quem = criarElemento('div', 'flex flex-col');
  quem.appendChild(criarElemento('span', 'text-sm font-semibold', postagem.autor.name));
  quem.appendChild(criarElemento('span', 'text-xs text-gray-500', `@${postagem.autor.username}`));
  cabecalho.appendChild(avatar);
  cabecalho.appendChild(quem);
  item.appendChild(cabecalho);

  const linhaHabito = criarElemento('div', 'flex items-center gap-2 text-xs');
  if (postagem.habito) {
  linhaHabito.appendChild(
    criarElemento('span', 'rounded-full bg-purple-100 px-2 py-0.5 font-medium capitalize text-purple-800', postagem.habito.categoria)
  );
    linhaHabito.appendChild(criarElemento('span', 'text-gray-600', postagem.habito.nome));
  } else {
    linhaHabito.appendChild(criarElemento('span', 'text-gray-500', 'Hábito removido'));
  }
  item.appendChild(linhaHabito);

  item.appendChild(criarElemento('p', 'text-sm', postagem.texto));

  return item;
}

function mostrarPostagens(postagens) {
  const cartoes = postagens.map(criarCartaoPostagem);
  listaPostagens.replaceChildren(...cartoes);
  atualizarEstadoVazio();
}

const autorizado = await exigirLogin();

if (autorizado) {
  const menu = await criarNavbar();
  document.querySelector('#menu').appendChild(menu);

  const postagens = await carregarPostagens();
  mostrarPostagens(postagens);
}