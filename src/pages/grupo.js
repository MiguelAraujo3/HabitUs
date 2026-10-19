import '../styles/base.css';
import { showMenu } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

exigirLogin();

const menu = showMenu();
document.querySelector('#menu').appendChild(menu);

const parametros = new URLSearchParams(window.location.search);
const idGrupo = parametros.get('id');

let titulo = 'Grupo';
if (idGrupo) {
  titulo = `Grupo ${idGrupo}`;
}
document.querySelector('#app').innerHTML = `<h1>${titulo}</h1>`;