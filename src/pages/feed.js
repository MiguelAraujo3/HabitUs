import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

const listaPostagens = document.querySelector('#lista-postagens');
const estadoVazio = document.querySelector('#estado-vazio');

function atualizarEstadoVazio() {
  const temPostagens = listaPostagens.children.length > 0;
  estadoVazio.hidden = temPostagens;
}

const autorizado = await exigirLogin();

if (autorizado) {
  const menu = await criarNavbar();
  document.querySelector('#menu').appendChild(menu);

  atualizarEstadoVazio();
}