import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';

function voltarParaUltimoDestino() {
  const destino = localStorage.getItem('destinoLogin');
  localStorage.removeItem('destinoLogin');
  window.location.href = destino || 'habitos.html';
}

const menu = criarNavbar();
document.querySelector('#menu').appendChild(menu);

function montarLogin() {
  document.querySelector('#app').innerHTML = `
  <div class="bg-brand-dark p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-blue">
    <div class="flex flex-col items-center justify-center mb-8">
      <h1 class="text-3xl font-bold text-white tracking-widest mb-2">LOGO</h1>
    </div>

    <form id="login" class="space-y-5">
      <div>
        <label class="block text-sm text-brand-ice mb-1">E-mail ou Usuário:</label>
        <input id="usermailOrUser" type="text" placeholder="seu@email.com ou usuario" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Senha:</label>
        <input id="passwd" type="password" placeholder="Sua senha" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <button type="submit" class="w-full py-3 mt-4 bg-brand-gray hover:bg-brand-light-gray text-brand-dark font-bold rounded-md transition-colors duration-300">
        ENTRAR
      </button>
      <div class="flex items-center justify-between mt-6 text-sm">
        <a href="#" class="text-brand-light-gray underline hover:text-brand-ice transition-colors">Esqueceu a senha?</a>
        <a href="#" id="linkCadastro" class="text-brand-light-gray underline hover:text-brand-ice transition-colors">Faça o seu registo</a>
      </div>
    </form>
  </div>
  `;

  const loginForm = document.getElementById('login');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const usermailOrUser = document.getElementById('usermailOrUser').value;
      const passwd = document.getElementById('passwd').value;

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      if (usuarios.some(usuario => (usuario.usermail === usermailOrUser || usuario.user === usermailOrUser) && usuario.passwd === passwd)) {
        const usuarioLogado = usuarios.find(usuario => (usuario.usermail === usermailOrUser || usuario.user === usermailOrUser));
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        alert('Login realizado com sucesso');
        voltarParaUltimoDestino();
        return;
      }
      else if (usuarios.some(usuario => usuario.usermail === usermailOrUser || usuario.user === usermailOrUser)) {
        alert('Senha incorreta');
        return;
      }
      alert('Usuário não cadastrado');
    });
  }

  const linkCadastro = document.getElementById('linkCadastro');
  if (linkCadastro) {
    linkCadastro.addEventListener('click', (e) => {
      e.preventDefault();
      montarCadastro();
    });
  }
}

function montarCadastro() {
  document.querySelector('#app').innerHTML = `
  <div class="bg-brand-dark p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-blue">
    <div class="flex flex-col items-center justify-center mb-8">
      <h1 class="text-3xl font-bold text-white tracking-widest mb-2">LOGO</h1>
    </div>

    <form id="cadastro" class="space-y-4">
      <div>
        <label class="block text-sm text-brand-ice mb-1">Nome:</label>
        <input id="nameid" type="text" placeholder="O seu nome completo" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors" required>
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">E-mail:</label>
        <input id="emailid" type="email" placeholder="seu@email.com" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors" required>
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Usuário:</label>
        <input id="userid" type="text" placeholder="letras, números ou _" pattern="^[a-zA-Z0-9_]+$" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors" required>
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Senha:</label>
        <input id="passwd" type="password" placeholder="A sua senha" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors" required>
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Confirmar Senha:</label>
        <input id="confirmpasswd" type="password" placeholder="Confirme a sua senha" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors" required>
      </div>
      <button type="submit" id="btnEnviar" class="w-full py-3 mt-6 bg-brand-gray hover:bg-brand-light-gray text-brand-dark font-bold rounded-md transition-colors duration-300">
        REGISTAR
      </button>
      <div class="flex justify-center mt-1 text-sm">
        <a href="#" id="linkLogin" class="text-brand-light-gray underline hover:text-brand-ice transition-colors">Já tem uma conta?</a>
      </div>
    </form>
  </div>
  `;

  const cadastroForm = document.getElementById('cadastro');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('nameid').value;
      const usermail = document.getElementById('emailid').value;
      const user = document.getElementById('userid').value;
      const passwd = document.getElementById('passwd').value;
      const confirmpasswd = document.getElementById('confirmpasswd').value;
      if (passwd !== confirmpasswd) {
        alert('As senhas não coincidem');
        return;
      }
      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      if (usuarios.some(usuario => usuario.user === user || usuario.usermail === usermail)) {
        alert('erro: usuário já cadastrado');
        return;
      }
      else if (usuarios.some(usuario => usuario.usermail === usermail)) {
        alert('erro: email já cadastrado');
      }
      const usuario = { username, usermail, user, passwd };
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('usuário cadastrado com sucesso');
      montarLogin();
    });
  }

  const linkLogin = document.getElementById('linkLogin');
  if (linkLogin) {
    linkLogin.addEventListener('click', (e) => {
      e.preventDefault();
      montarLogin();
    });
  }
}

montarLogin();