import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

exigirLogin();

const menu = criarNavbar();
document.querySelector('#menu').appendChild(menu);
document.querySelector('#app').innerHTML = '<h1>Grupos</h1>';