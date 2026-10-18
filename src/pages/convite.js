import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

exigirLogin();

const menu = await criarNavbar();
document.querySelector('#menu').appendChild(menu);

const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get('codigo');

let titulo = 'Convite';
if (codigo) {
  titulo = `Convite ${codigo}`;
}
document.querySelector('#app').innerHTML = `<h1>${titulo}</h1>`;