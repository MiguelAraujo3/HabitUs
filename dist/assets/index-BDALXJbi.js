import{i as e,n as t,t as n}from"./auth-CYePSG_H.js";/* empty css             */import{t as r}from"./navbar-Cuu2FhBJ.js";function i(){let e=localStorage.getItem(`destinoLogin`);localStorage.removeItem(`destinoLogin`),window.location.href=e||`habitos.html`}async function a(){if(await t()){window.location.replace(`/habit-tracker/habitos.html`);return}let e=await r();document.querySelector(`#menu`).appendChild(e),o()}function o(){document.querySelector(`#app`).innerHTML=`
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
  `;let e=document.getElementById(`login`);e&&e.addEventListener(`submit`,async t=>{t.preventDefault();let r=document.getElementById(`usermailOrUser`).value,a=document.getElementById(`passwd`).value,o=document.getElementById(`erro-login`),s=e.querySelector(`button[type="submit"]`);o.hidden=!0,o.textContent=``,s.disabled=!0;try{await n(r,a),i()}catch(e){o.textContent=e.code===`VALIDATION_ERROR`||e.code===`UNAUTHORIZED`?e.message:`Não foi possível entrar. Tente novamente.`,o.hidden=!1}finally{s.disabled=!1}});let t=document.getElementById(`linkCadastro`);t&&t.addEventListener(`click`,e=>{e.preventDefault(),s()})}function s(){document.querySelector(`#app`).innerHTML=`
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
  `;let t=document.getElementById(`cadastro`);t&&t.addEventListener(`submit`,async t=>{t.preventDefault();let r=document.getElementById(`nameid`).value,a=document.getElementById(`emailid`).value,o=document.getElementById(`userid`).value,s=document.getElementById(`passwd`).value,c=document.getElementById(`confirmpasswd`).value,l=document.getElementById(`erro-cadastro`),u=document.getElementById(`btnEnviar`);if(l.hidden=!0,l.textContent=``,s!==c){l.textContent=`As senhas não coincidem.`,l.hidden=!1;return}u.disabled=!0;let d=!1;try{let t=await e({name:r,username:o,email:a,password:s});d=!0,await n(t.email,s),i()}catch(e){let t=e.code===`VALIDATION_ERROR`||e.code===`ALREADY_EXISTS`;l.textContent=d?`Conta criada, mas não foi possível entrar. Acesse pelo formulário de login.`:t?e.message:`Não foi possível cadastrar. Tente novamente.`,l.hidden=!1}finally{u.disabled=!1}});let r=document.getElementById(`linkLogin`);r&&r.addEventListener(`click`,e=>{e.preventDefault(),o()})}await a();