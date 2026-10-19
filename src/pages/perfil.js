import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { obterUsuarioAtual, updateUser, getHabitsByUser, getHabitStreak } from '../data/index.js';
import { obterIniciais } from '../utils/usuario.js';
import { formatarSequencia } from '../utils/sequencia.js';


const autorizado = await exigirLogin();

if (autorizado) {
  let  usuarioAtual = await obterUsuarioAtual();
  const habitos = await getHabitsByUser(usuarioAtual.id);
  const habitosAtivos = habitos.filter((habito) => habito.ativo);
  const habitosComSequencia = [];
  for (const habito of habitos) {
    const sequencia = await getHabitStreak(habito.id);

    habitosComSequencia.push({...habito, sequencia,});
  }
  const menu = await criarNavbar();
  menu.classList.add('max-[700px]:w-full', 'max-[700px]:h-auto', 'max-[700px]:px-5', 'max-[700px]:py-[18px]', 'max-[700px]:gap-[18px]');
  menu.querySelector('div').classList.add('max-[700px]:mb-0');
  menu.querySelector('nav').classList.add('max-[700px]:flex-row', 'max-[700px]:flex-wrap', 'max-[700px]:gap-[18px]');
  document.querySelector('#menu').appendChild(menu);

  const parametros = new URLSearchParams(window.location.search);
  const usuario = parametros.get('usuario');

  const app = document.querySelector('#app');

  app.innerHTML = `
    <section class="mx-auto max-w-205 overflow-hidden rounded-3xl border border-(--line) bg-white shadow-[0_12px_40px_#00000006] max-[700px]:rounded-[18px]" aria-labelledby="titulo-perfil">
      <div class="min-h-35 bg-(--lima) px-9 py-7 text-[11px] font-extrabold tracking-[.16em] max-[700px]:min-h-30 max-[700px]:px-5 max-[700px]:py-6">
        <span>HABITUS · SEU ESPAÇO</span>
      </div>
      <div class="px-9 pb-9 max-[700px]:px-5 max-[700px]:pb-6">
        <div id="perfil-avatar" class="relative -mt-10.5 mb-6 grid size-22 place-items-center rounded-3xl border-[5px] border-white bg-brand-dark text-[28px] font-extrabold text-(--lima)" aria-hidden="true"></div>
        <p class="mb-2 text-[13px] text-brand-light-gray">Cada hábito conta uma história</p>
        <h1 id="titulo-perfil" class="mb-6 text-[clamp(26px,4vw,34px)] font-extrabold tracking-[-.04em]">Meu perfil</h1>
        <h2 id="perfil-nome" class="text-[22px] font-bold wrap-anywhere"></h2>
        <p id="perfil-username" class="mt-1 text-sm text-brand-blue wrap-anywhere"></p>
        <p id="perfil-descricao" class="mt-4.5 mb-6 leading-[1.7] whitespace-pre-wrap text-brand-light-gray wrap-anywhere"></p>
        <div class="mb-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-(--line) bg-brand-ice p-5">
          <p class="text-sm text-brand-light-gray">Hábitos ativos</p>
          <p id="total-habitos" class="mt-1 text-3xl font-bold"></p>
         </div>

        <div class="rounded-xl border border-(--line) bg-brand-ice p-5">
            <p class="text-sm text-brand-light-gray">Maior sequência</p>
            <p id="maior-sequencia" class="mt-1 text-2xl font-bold"></p>
            <p id="habito-recordista" class="mt-1 text-sm text-brand-light-gray wrap-anywhere"></p>
        </div>
        </div>
        <button id="editar-perfil" type="button" class="cursor-pointer rounded-[10px] border border-(--line) bg-brand-dark px-5 py-2.75 text-sm font-semibold text-white transition-colors hover:bg-[#303030]">Editar perfil</button>
        <form id="form-perfil" class="mt-7 border-t border-(--line) pt-7" hidden>
          <h3 class="text-xl font-bold">Editar meus dados</h3>
          <p class="mt-1.5 mb-6 text-sm text-brand-light-gray">Deixe seu perfil com a sua cara.</p>
          <div class="mb-4.5">
            <label for="editar-nome" class="mb-1.75 block text-sm font-semibold">Nome</label>
            <input id="editar-nome" name="name" maxlength="100" required
              class="block w-full rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white">
          </div>

          <div class="mb-4.5">
            <label for="editar-username" class="mb-1.75 block text-sm font-semibold">Nome de usuário</label>
            <input
              id="editar-username"
              name="username"
              minlength="3"
              maxlength="30"
              pattern="[a-zA-Z0-9_]{3,30}"
              required
              class="block w-full rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white"
            >
          </div>

          <div class="mb-4.5">
            <label for="editar-descricao" class="mb-1.75 block text-sm font-semibold">Descrição</label>
            <textarea
              id="editar-descricao"
              name="profileDescription"
              maxlength="500"
              class="block min-h-30 w-full resize-y rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white"
            ></textarea>
          </div>

          <p id="mensagem-perfil" role="status" class="mb-4.5 rounded-lg bg-(--chama-bg) p-3 text-sm text-(--chama-ink) empty:hidden"></p>

          <div class="flex flex-wrap gap-2.5">
            <button type="submit" class="cursor-pointer rounded-[10px] border border-brand-blue bg-brand-blue px-5 py-2.75 text-sm font-semibold text-white transition-colors hover:bg-(--azul-escuro) disabled:cursor-wait disabled:opacity-60">Salvar alterações</button>
            <button id="cancelar-edicao" type="button" class="cursor-pointer rounded-[10px] border border-(--line) bg-white px-5 py-2.75 text-sm font-semibold transition-colors hover:bg-brand-ice">Cancelar</button>
          </div>
        </form>
        <section class="mt-8 border-t border-(--line) pt-6" aria-labelledby="titulo-habitos">
          <h3 id="titulo-habitos" class="mb-4 text-xl font-bold">Hábitos</h3>
          <p id="habitos-vazios" class="text-sm text-brand-light-gray" hidden>
            Você ainda não criou hábitos.
          </p>
          <ul id="lista-habitos" class="space-y-3"></ul>
        </section>
      </div>
    </section>
  `;
  app.querySelector('#total-habitos').textContent = habitosAtivos.length;
  const recordista = habitosComSequencia.reduce((melhor, habito) => {
  if (!melhor) {
    return habito;
  }

  const atual = habito.sequencia;
  const anterior = melhor.sequencia;

  if (atual.longest > anterior.longest) {
    return habito;
  }

  const empatou = atual.longest === anterior.longest;
  const dataAtual = atual.longestAchievedAt || '';
  const dataAnterior = anterior.longestAchievedAt || '';

  if (empatou && dataAtual > dataAnterior) {
    return habito;
  }

  return melhor;
  }, null);
  const temRecorde = recordista && recordista.sequencia.longest > 0;

  app.querySelector('#maior-sequencia').textContent = temRecorde
  ? formatarSequencia(recordista.sequencia.longest, recordista.frequencia)
  : formatarSequencia(0, { tipo: 'diaria' });

  app.querySelector('#habito-recordista').textContent = temRecorde
  ? recordista.nome
  : 'Conclua um hábito para começar.';
  const listaHabitos = app.querySelector('#lista-habitos');
  app.querySelector('#habitos-vazios').hidden = habitosComSequencia.length > 0;
  for (const habito of habitosComSequencia) {
    const item = document.createElement('li');
    item.className ='rounded-xl border border-(--line) bg-brand-ice p-4';

    const nome = document.createElement('h4');
    nome.className = 'font-semibold wrap-anywhere';
    nome.textContent = habito.nome;
    const detalhes = document.createElement('p');
    detalhes.className = 'mt-1 text-sm text-brand-light-gray';

    const textoSequencia = formatarSequencia(
          habito.sequencia.current,
          habito.frequencia
    );

    detalhes.textContent = `Sequência atual: ${textoSequencia}`;

  item.append(nome, detalhes);
  listaHabitos.appendChild(item);
}

  app.querySelector('#perfil-avatar').textContent = obterIniciais(usuarioAtual);
  app.querySelector('#perfil-nome').textContent = usuarioAtual.name;
  app.querySelector('#perfil-username').textContent =`@${usuarioAtual.username}`;
  app.querySelector('#perfil-descricao').textContent = usuarioAtual.profileDescription || 'Você ainda não adicionou uma descrição.';

  const formulario = app.querySelector('#form-perfil');
  const botaoEditar = app.querySelector('#editar-perfil');

  botaoEditar.addEventListener('click', () => {
    formulario.elements.name.value = usuarioAtual.name;
    formulario.elements.username.value = usuarioAtual.username;
    formulario.elements.profileDescription.value = usuarioAtual.profileDescription || '';

    app.querySelector('#mensagem-perfil').textContent = '';
    formulario.hidden = false;
    botaoEditar.hidden = true;
    formulario.elements.name.focus();
  });
  app.querySelector('#cancelar-edicao').addEventListener('click', () => {
    formulario.hidden = true;
    botaoEditar.hidden = false;
    botaoEditar.focus();
  });
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const mensagem = app.querySelector('#mensagem-perfil');
    const botaoSalvar = formulario.querySelector('[type="submit"]');

    mensagem.textContent = '';
    botaoSalvar.disabled = true;

    try {
      await updateUser(usuarioAtual.id, {
        name: formulario.elements.name.value,
        username: formulario.elements.username.value,
        profileDescription: formulario.elements.profileDescription.value,
      });
      usuarioAtual = await obterUsuarioAtual();
      
      document.getElementById('saudacao-usuario').textContent = `Olá, ${usuarioAtual.name.split(' ')[0]}`
      app.querySelector('#perfil-avatar').textContent = obterIniciais(usuarioAtual);
      app.querySelector('#perfil-nome').textContent = usuarioAtual.name;
      app.querySelector('#perfil-username').textContent = `@${usuarioAtual.username}`;
      app.querySelector('#perfil-descricao').textContent = usuarioAtual.profileDescription || 'Você ainda não adicionou uma descrição.';
      formulario.hidden = true;
      botaoEditar.hidden = false;
      botaoEditar.focus();
    } catch(erro) {
      mensagem.textContent = erro.message;
    } finally {
      botaoSalvar.disabled = false;
    }
  })
}
