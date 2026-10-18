import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { entrar, createUser, obterUsuarioAtual } from '../data/index.js';
function voltarParaUltimoDestino() {
  const destino = localStorage.getItem('destinoLogin');
  localStorage.removeItem('destinoLogin');
  window.location.href = destino || 'habitos.html';
}

async function iniciarPagina() {
  const usuario = await obterUsuarioAtual();

  if (usuario) {
    window.location.replace(`${import.meta.env.BASE_URL}habitos.html`);
    return;
  }

  const menu = await criarNavbar();
  document.querySelector('#menu').appendChild(menu);
  montarLogin();
}

function montarLogin() {
  document.querySelector('#app').innerHTML = `
  <div class="auth-card p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-blue">
    <div class="flex flex-col items-center justify-center mb-8">
      <h1 class="text-3xl font-bold text-brand-dark tracking-widest mb-2">LOGO</h1>
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
      <p id="erro-login" role="alert" hidden></p>
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
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const identificador = document.getElementById('usermailOrUser').value;
      const senha = document.getElementById('passwd').value;
      const erroLogin = document.getElementById('erro-login');
      const botao = loginForm.querySelector('button[type="submit"]');

      erroLogin.hidden = true;
      erroLogin.textContent = '';
      botao.disabled = true;
     try {
      await entrar(identificador, senha);
      voltarParaUltimoDestino();
    } catch (erro) {
      const erroEsperado =
        erro.code === 'VALIDATION_ERROR' ||
        erro.code === 'UNAUTHORIZED';

      erroLogin.textContent = erroEsperado? erro.message: 'Não foi possível entrar. Tente novamente.';

      erroLogin.hidden = false;
    } finally {
      botao.disabled = false;
    }
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
  <div class="auth-card p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-blue">
    <div class="flex flex-col items-center justify-center mb-8">
      <h1 class="text-3xl font-bold text-brand-dark tracking-widest mb-2">LOGO</h1>
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
      <p id="erro-cadastro" role="alert" hidden></p>
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
  cadastroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('nameid').value;
    const email = document.getElementById('emailid').value;
    const username = document.getElementById('userid').value;
    const password = document.getElementById('passwd').value;
    const confirmacao = document.getElementById('confirmpasswd').value;

    const erroCadastro = document.getElementById('erro-cadastro');
    const botao = document.getElementById('btnEnviar');

    erroCadastro.hidden = true;
    erroCadastro.textContent = '';

    if (password !== confirmacao) {
      erroCadastro.textContent = 'As senhas não coincidem.';
      erroCadastro.hidden = false;
      return;
    }

    botao.disabled = true;
    let contaCriada = false;

    try {
      const usuario = await createUser({
        name,
        username,
        email,
        password,
      });

      contaCriada = true;

      await entrar(usuario.email, password);
      voltarParaUltimoDestino();
    } catch (erro) {
      const erroEsperado =
        erro.code === 'VALIDATION_ERROR' ||
        erro.code === 'ALREADY_EXISTS';

      if (contaCriada) {
        erroCadastro.textContent ='Conta criada, mas não foi possível entrar. Acesse pelo formulário de login.';
      } else {
        erroCadastro.textContent = erroEsperado? erro.message: 'Não foi possível cadastrar. Tente novamente.';
      }

      erroCadastro.hidden = false;
    } finally {
      botao.disabled = false;
    }
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

await iniciarPagina();
