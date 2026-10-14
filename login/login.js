// import 'style'
import { showMenu } from "header";

document.querySelector('#menu').innerHTML = showMenu();

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
        <a href="../cadastro/index.html" class="text-brand-light-gray underline hover:text-brand-ice transition-colors">Faça o seu registo</a>
      </div>
    </form>
  </div>
`
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('login')) {
    const loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const usermailOrUser = document.getElementById('usermailOrUser').value
      const passwd = document.getElementById('passwd').value

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      if (usuarios.some(usuario => (usuario.usermail === usermailOrUser || usuario.user === usermailOrUser) && usuario.passwd === passwd)) {
        alert('Login realizado com sucesso');
        window.location.assign('../index.html');
        return;
      }
      else if (usuarios.some(usuario => usuario.usermail === usermailOrUser || usuario.user === usermailOrUser)){
        alert('Senha incorreta');
        return;
      }
      alert('Usuário não cadastrado');
    })
  }
})