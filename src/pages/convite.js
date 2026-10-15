import '../styles/base.css';
import { showMenu } from '../components/navbar.js';

document.querySelector('#menu').innerHTML = showMenu();
document.querySelector('#app').innerHTML = '<h1>Convite</h1>';