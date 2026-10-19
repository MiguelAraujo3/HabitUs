import '../styles/base.css';
import { showMenu } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

exigirLogin();

const menu = showMenu();
document.querySelector('#menu').appendChild(menu);

const parametros = new URLSearchParams(window.location.search);
const usuario = parametros.get('usuario');

let titulo = 'Perfil';
if (usuario) {
  titulo = `Perfil de ${usuario}`;
}
document.querySelector('#app').innerHTML = `<h1>${titulo}</h1>`;