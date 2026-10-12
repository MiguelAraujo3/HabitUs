// import 'style'
import { showMenu } from 'header'

document.querySelector('#menu').innerHTML = showMenu();

document.querySelector('#app').innerHTML = `
  <div class="bg-brand-dark p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-blue">
    <div class="flex flex-col items-center justify-center mb-8">
      <h1 class="text-3xl font-bold text-white tracking-widest mb-2">LOGO</h1>
    </div>

    <form class="space-y-4">
      <div>
        <label class="block text-sm text-brand-ice mb-1">Nome:</label>
        <input type="text" placeholder="O seu nome completo" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">E-mail:</label>
        <input type="email" placeholder="seu@email.com" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Usuário:</label>
        <input type="text" placeholder="letras, números ou _" pattern="^[a-zA-Z0-9_]+$" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Senha:</label>
        <input type="password" placeholder="A sua senha" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <div>
        <label class="block text-sm text-brand-ice mb-1">Confirmar Senha:</label>
        <input type="password" placeholder="Confirme a sua senha" class="w-full px-4 py-2 bg-brand-blue text-white border border-brand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light-gray placeholder-brand-light-gray transition-colors">
      </div>
      <button type="submit" class="w-full py-3 mt-6 bg-brand-gray hover:bg-brand-light-gray text-brand-dark font-bold rounded-md transition-colors duration-300">
        REGISTAR
      </button>
      <div class="flex justify-center mt-1 text-sm">
        <a href="../login/index.html" class="text-brand-light-gray underline hover:text-brand-ice transition-colors">Já tem uma conta?</a>
      </div>
    </form>
  </div>
`