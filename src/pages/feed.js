import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { getUserById, obterUsuarioAtual, getHabitsByUser } from '../data/index.js';
import * as repoPostagens from '../data/postagens.js';
import * as repoHabitos from '../data/habitos.js';
import { criarCartaoPostagem } from '../components/postagem.js';
import { criarElemento } from '../components/ui.js';

const listaPostagens = document.querySelector('#lista-postagens');
const estadoVazio = document.querySelector('#estado-vazio');
const telaFeed = listaPostagens.parentElement;

function atualizarEstadoVazio() {
  const temPostagens = listaPostagens.children.length > 0;
  estadoVazio.hidden = temPostagens;
}

async function carregarPostagens() {
  const postagens = await repoPostagens.listar();
  const ordenadas = [...postagens].sort(
    (a, b) => new Date(b.dataHora) - new Date(a.dataHora)
  );

  return Promise.all(
    ordenadas.map(async (postagem) => {
      const autor = await getUserById(postagem.idUsuario);
      const habito = await repoHabitos.buscarPorId(postagem.idHabito);
      return { ...postagem, autor, habito };
    })
  );
}

function mostrarPostagens(postagens) {
  const cartoes = postagens.map(criarCartaoPostagem);
  listaPostagens.replaceChildren(...cartoes);
  atualizarEstadoVazio();
}

let telaPostagem = null;

function criarTelaPostagem() {
  const tela = criarElemento('section', 'mx-auto flex w-full max-w-2xl flex-col gap-4');
  tela.hidden = true;

  // Barra do topo: ← Voltar + título
  const topo = criarElemento('div', 'relative flex items-center justify-center rounded-xl bg-white px-4 py-3 shadow-sm');
  const botaoVoltar = criarElemento('button', 'absolute left-4 cursor-pointer text-base font-medium text-blue-600 hover:underline', '← Voltar');
  botaoVoltar.type = 'button';
  botaoVoltar.addEventListener('click', fecharTelaPostagem);
  topo.appendChild(botaoVoltar);
  topo.appendChild(criarElemento('h2', 'text-sm font-semibold', 'Nova postagem'));
  tela.appendChild(topo);

  // Formulário
  const form = criarElemento('form', 'flex flex-col gap-4');
  form.noValidate = true;

  const rotuloHabito = criarElemento('label', 'text-sm font-medium', 'Hábito');
  rotuloHabito.htmlFor = 'campo-habito';
  const selectHabito = criarElemento('select', 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm');
  selectHabito.id = 'campo-habito';
  const erroHabito = criarElemento('p', 'text-sm text-red-700');
  erroHabito.hidden = true;

  const rotuloTexto = criarElemento('label', 'text-sm font-medium', 'Texto');
  rotuloTexto.htmlFor = 'campo-texto';
  const campoTexto = criarElemento('textarea', 'w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm');
  campoTexto.id = 'campo-texto';
  campoTexto.rows = 5;
  campoTexto.placeholder = 'Como foi hoje?';
  const erroTexto = criarElemento('p', 'text-sm text-red-700');
  erroTexto.hidden = true;

  const aviso = criarElemento('p', 'rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900', 'Postar não marca o hábito como cumprido. Para registrar, vá em ');
  const linkAviso = criarElemento('a', 'underline', 'Hábitos');
  linkAviso.href = `${import.meta.env.BASE_URL}habitos.html`;
  aviso.append(linkAviso, '.');

  const botaoPublicar = criarElemento('button', 'w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700', 'Publicar');
  botaoPublicar.type = 'submit';

  form.append(rotuloHabito, selectHabito, erroHabito, rotuloTexto, campoTexto, erroTexto, aviso, botaoPublicar);
  tela.appendChild(form);

  // Some o erro assim que a pessoa corrige o campo
  selectHabito.addEventListener('change', () => {
    erroHabito.hidden = true;
  });
  campoTexto.addEventListener('input', () => {
    erroTexto.hidden = true;
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erroHabito.hidden = true;
    erroTexto.hidden = true;

    const idHabito = selectHabito.value;
    const texto = campoTexto.value.trim();
    let valido = true;

    if (!idHabito) {
      erroHabito.textContent = 'Escolha um hábito.';
      erroHabito.hidden = false;
      valido = false;
    }
    if (!texto) {
      erroTexto.textContent = 'Escreva o texto da postagem.';
      erroTexto.hidden = false;
      valido = false;
    }
    if (!valido) {
      return;
    }

    botaoPublicar.disabled = true;
    try {
      const usuario = await obterUsuarioAtual();
      await repoPostagens.criar({ idUsuario: usuario.id, idHabito, texto, imagem: null });
      fecharTelaPostagem();
      mostrarPostagens(await carregarPostagens());
    } catch (erro) {
      console.error(erro);
      erroTexto.textContent = 'Não foi possível publicar. Tente novamente.';
      erroTexto.hidden = false;
    } finally {
      botaoPublicar.disabled = false;
    }
  });

  // Roda a cada abertura: limpa o formulário e recarrega os hábitos da pessoa
  tela.preparar = async () => {
    form.reset();
    erroHabito.hidden = true;
    erroTexto.hidden = true;

    const usuario = await obterUsuarioAtual();
    const habitos = await getHabitsByUser(usuario.id);

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione um hábito';

    const opcoes = habitos.map((habito) => {
      const opcao = document.createElement('option');
      opcao.value = habito.id;
      opcao.textContent = habito.nome;
      return opcao;
    });
    selectHabito.replaceChildren(placeholder, ...opcoes);
  };

  document.querySelector('#app').appendChild(tela);
  return tela;
}

async function abrirTelaPostagem() {
  if (!telaPostagem) {
    telaPostagem = criarTelaPostagem();
  }
  await telaPostagem.preparar();
  telaFeed.hidden = true;
  telaPostagem.hidden = false;
}

function fecharTelaPostagem() {
  telaPostagem.hidden = true;
  telaFeed.hidden = false;
}

const autorizado = await exigirLogin();

if (autorizado) {
  const menu = await criarNavbar();
  if (menu) {
    document.querySelector('#menu').appendChild(menu);
  }

  const postagens = await carregarPostagens();
  mostrarPostagens(postagens);
    document.querySelector('#btn-nova-postagem').addEventListener('click', abrirTelaPostagem);
}