import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { obterUsuarioAtual, updateUser, getHabitsByUser, encerrarSessao, getHabitStreak } from '../data/index.js';
import { obterIniciais } from '../utils/usuario.js';
import { formatarSequencia } from '../utils/sequencia.js';
import { getPostsByUser } from '../data/index.js';
import { criarCartaoPostagem } from '../components/postagem.js'


const autorizado = await exigirLogin();

if (autorizado) {
  let  usuarioAtual = await obterUsuarioAtual();
  const habitos = await getHabitsByUser(usuarioAtual.id);
  const postagens = await getPostsByUser(usuarioAtual.id);
  const habitosAtivos = habitos.filter((habito) => habito.ativo);
  const habitosComSequencia = [];
  for (const habito of habitos) {
    const sequencia = await getHabitStreak(habito.id);

    habitosComSequencia.push({...habito, sequencia,});
  }
  const menu = await criarNavbar();
  if (menu) {
    document.querySelector('#menu').appendChild(menu);
  }

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
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            id="editar-perfil"
            type="button"
            class="cursor-pointer rounded-[10px] border border-(--line) bg-brand-dark px-5 py-2.75 text-sm font-semibold text-white transition-colors hover:bg-[#303030]"
          >
            Editar perfil
          </button>
          <button
            id="sair-perfil"
            type="button"
            class="cursor-pointer rounded-[10px] border border-transparent bg-(--chama-ink) px-5 py-2.75 text-sm font-semibold text-white hover:brightness-90 disabled:opacity-60"
          >
            Sair
          </button>
        </div>        
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
      
        <section class="mt-8 border-t border-(--line) pt-6" aria-labelledby="titulo-postagens">
          <h3 id="titulo-postagens" class="mb-4 text-xl font-bold">
            Postagens
          </h3>

          <p id="postagens-vazias" class="text-sm text-brand-light-gray" hidden>
            Você ainda não publicou nenhuma postagem.
          </p>

          <ul id="lista-postagens-perfil" class="space-y-4"></ul>
        </section>
      </div>
    </section>
  `;
  app.querySelector('#total-habitos').textContent = habitosAtivos.length;
  function redenrizarPostagens() {
    const lista = app.querySelector('#lista-postagens-perfil');
    const cartoes = postagens.map(postagem => {
      const habito = habitos.find(
        habito => habito.id === postagem.idHabito
      );
      return criarCartaoPostagem({...postagem,
        autor: usuarioAtual,
        habito
      });
    });
    lista.replaceChildren(...cartoes);
    /** @type {HTMLElement} */ (app.querySelector('#postagens-vazias')).hidden = postagens.length > 0;
  }
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

  app.querySelector('#habito-recordista').textContent = 
  temRecorde ? recordista.nome  : 'Conclua um hábito para começar.';
  const listaHabitos = app.querySelector('#lista-habitos');
  /** @type {HTMLElement} */ (app.querySelector('#habitos-vazios')).hidden = habitosComSequencia.length > 0;
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
  redenrizarPostagens();
  /** @type {HTMLFormElement} */
  const formulario = app.querySelector('#form-perfil');
  /** @type {HTMLButtonElement} */
  const botaoEditar = app.querySelector('#editar-perfil');
  /** @type {HTMLButtonElement} */
  const botaoSair = app.querySelector('#sair-perfil');
  botaoSair.addEventListener('click', async () => {
    botaoSair.disabled = true;

    try {
      await encerrarSessao();
      window.location.href = `${import.meta.env.BASE_URL}index.html`;
    } catch {
      botaoSair.disabled = false;
      botaoSair.textContent = 'Tentar sair novamente'
    }
  })

  botaoEditar.addEventListener('click', () => {
    /** @type {HTMLInputElement} */ (formulario.elements.namedItem('name')).value = usuarioAtual.name;
    /** @type {HTMLInputElement} */ (formulario.elements.namedItem('username')).value = usuarioAtual.username;
    /** @type {HTMLTextAreaElement} */ (formulario.elements.namedItem('profileDescription')).value = usuarioAtual.profileDescription || '';

    app.querySelector('#mensagem-perfil').textContent = '';
    formulario.hidden = false;
    botaoEditar.hidden = true;
    /** @type {HTMLInputElement} */ (formulario.elements.namedItem('name')).focus();
  });
  app.querySelector('#cancelar-edicao').addEventListener('click', () => {
    formulario.hidden = true;
    botaoEditar.hidden = false;
    botaoEditar.focus();
  });
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const mensagem = app.querySelector('#mensagem-perfil');
    /** @type {HTMLButtonElement} */
    const botaoSalvar = formulario.querySelector('[type="submit"]');

    mensagem.textContent = '';
    botaoSalvar.disabled = true;

    try {
      await updateUser(usuarioAtual.id, {
        name: /** @type {HTMLInputElement} */ (formulario.elements.namedItem('name')).value,
        username: /** @type {HTMLInputElement} */ (formulario.elements.namedItem('username')).value,
        profileDescription: /** @type {HTMLTextAreaElement} */ (formulario.elements.namedItem('profileDescription')).value,
      });
      usuarioAtual = await obterUsuarioAtual();
      
      // O cartão do usuário no menu lateral acompanha as alterações do perfil.
      document.getElementById('usuario-nome')?.replaceChildren(usuarioAtual.name);
      document.getElementById('usuario-username')?.replaceChildren(`@${usuarioAtual.username}`);
      document.getElementById('usuario-avatar')?.replaceChildren(obterIniciais(usuarioAtual));
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
