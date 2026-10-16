import '../styles/base.css';
import { showMenu } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

exigirLogin();

const menu = showMenu();
document.querySelector('#menu').appendChild(menu);
document.querySelector('#app').innerHTML = '<h1>Criar Grupo</h1>';