import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';

const autorizado = await exigirLogin();

if (autorizado) {
  const menu = await criarNavbar();
  document.querySelector('#menu').appendChild(menu);
  document.querySelector('#app').innerHTML = '<h1>Feed</h1>';
}
