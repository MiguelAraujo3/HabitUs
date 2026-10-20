import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { getUserById, obterUsuarioAtual, getHabitsByUser } from '../data/index.js';
import * as repoPostagens from '../data/postagens.js';
import * as repoHabitos from '../data/habitos.js';

const listaPostagens = document.querySelector('#lista-postagens');
const estadoVazio = document.querySelector('#estado-vazio');

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

function criarElemento(tag, classes, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classes;
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function iniciais(nome) {
  return nome
    .trim()
    .split(' ')
    .filter((parte) => parte !== '')
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}

function formatarTempo(dataHora) {
  const segundos = Math.floor((Date.now() - new Date(dataHora)) / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) {
    return 'agora';
  }
  if (minutos < 60) {
    return `há ${minutos} min`;
  }
  if (horas < 24) {
    return `há ${horas} h`;
  }
  if (dias === 1) {
    return 'ontem';
  }
  if (dias < 7) {
    return `há ${dias} dias`;
  }
  return new Date(dataHora).toLocaleDateString('pt-BR');
}

function criarCartaoPostagem(postagem) {
  const item = criarElemento('li', 'flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm');

  const cabecalho = criarElemento('div', 'flex items-center gap-3');
  const avatar = criarElemento(
    'div',
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800',
    iniciais(postagem.autor.name)
  );
  const quem = criarElemento('div', 'flex flex-col');
  quem.appendChild(criarElemento('span', 'text-sm font-semibold', postagem.autor.name));
  quem.appendChild(criarElemento('span', 'text-xs text-gray-500', `@${postagem.autor.username} · ${formatarTempo(postagem.dataHora)}`));
  cabecalho.appendChild(avatar);
  cabecalho.appendChild(quem);
  item.appendChild(cabecalho);

  const linhaHabito = criarElemento('div', 'flex items-center gap-2 text-xs');
  if (postagem.habito) {
  linhaHabito.appendChild(
    criarElemento('span', 'rounded-full bg-purple-100 px-2 py-0.5 font-medium capitalize text-purple-800', postagem.habito.categoria)
  );
    linhaHabito.appendChild(criarElemento('span', 'text-gray-600', postagem.habito.nome));
  } else {
    linhaHabito.appendChild(criarElemento('span', 'text-gray-500', 'Hábito removido'));
  }
  item.appendChild(linhaHabito);

  item.appendChild(criarElemento('p', 'text-sm', postagem.texto));

  if (postagem.imagem) {
    const imagem = criarElemento('img', 'max-h-96 w-full rounded-lg object-cover');
    imagem.src = postagem.imagem;
    imagem.alt = `Imagem da postagem de ${postagem.autor.name}`;
    item.appendChild(imagem);
  }

  return item;
}

function mostrarPostagens(postagens) {
  const cartoes = postagens.map(criarCartaoPostagem);
  listaPostagens.replaceChildren(...cartoes);
  atualizarEstadoVazio();
}

let dialogo = null;

function criarDialogoPostagem() {
  const d = criarElemento('dialog', 'm-auto w-full max-w-md rounded-xl bg-white p-0 shadow-2xl backdrop:bg-black/45');
  const conteudo = criarElemento('div', 'p-6');

  const topo = criarElemento('div', 'mb-4 flex items-center justify-between');
  topo.appendChild(criarElemento('h2', 'text-xl font-bold', 'Nova postagem'));

  const botaoFechar = criarElemento('button', 'cursor-pointer text-2xl leading-none text-gray-500 hover:text-black', '×');
  botaoFechar.type = 'button';
  botaoFechar.addEventListener('click', () => d.close());
  topo.appendChild(botaoFechar);

  conteudo.appendChild(topo);

  const form = criarElemento('form', 'flex flex-col gap-4');
  form.noValidate = true;

  const rotuloHabito = criarElemento('label', 'text-sm font-medium', 'Hábito');
  rotuloHabito.htmlFor = 'campo-habito';
  const selectHabito = criarElemento('select', 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm');
  selectHabito.id = 'campo-habito';

  const rotuloTexto = criarElemento('label', 'text-sm font-medium', 'Texto');
  rotuloTexto.htmlFor = 'campo-texto';
  const campoTexto = criarElemento('textarea', 'w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm');
  campoTexto.id = 'campo-texto';
  campoTexto.rows = 4;
  campoTexto.placeholder = 'Como foi hoje?';

  const botaoPublicar = criarElemento('button', 'cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700', 'Publicar');
  botaoPublicar.type = 'submit';

  const erroHabito = criarElemento('p', 'text-sm text-red-700');
  const erroTexto = criarElemento('p', 'text-sm text-red-700');
  erroHabito.hidden = true;
  erroTexto.hidden = true;

  form.append(rotuloHabito, selectHabito, erroHabito, rotuloTexto, campoTexto, erroTexto, botaoPublicar);
  conteudo.appendChild(form);

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
      d.close();
      mostrarPostagens(await carregarPostagens());
    } catch (erro) {
      console.error(erro);
      erroTexto.textContent = 'Não foi possível publicar. Tente novamente.';
      erroTexto.hidden = false;
    } finally {
      botaoPublicar.disabled = false;
    }
  });

  d.appendChild(conteudo);

  d.addEventListener('click', (evento) => {
    if (evento.target === d) {
      d.close();
    }
  });

    d.preparar = async () => {
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

  document.body.appendChild(d);
  return d;
}

async function abrirDialogoPostagem() {
  if (!dialogo) {
    dialogo = criarDialogoPostagem();
  }
  await dialogo.preparar();
  dialogo.showModal();
}

const autorizado = await exigirLogin();

if (autorizado) {
  const menu = await criarNavbar();
  document.querySelector('#menu').appendChild(menu);

  const postagens = await carregarPostagens();
  mostrarPostagens(postagens);
  document.querySelector('#btn-nova-postagem').addEventListener('click', abrirDialogoPostagem);
}