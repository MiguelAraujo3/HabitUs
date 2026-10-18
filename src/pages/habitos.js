import '../style.css'; // Tailwind + cores "brand-*" usadas pelo menu lateral
import '../styles/formulario-habito.css';
import { criarNavbar } from '../components/navbar.js';
import * as repoHabitos from '../data/habitos.js';
import * as repoConclusoes from '../data/conclusoesHabito.js';
import { paraChave, hoje } from '../utils/datas.js';
import { calcularSequencia } from '../rules/streak.js';
import { exigirLogin } from '../components/auth.js';
import { obterUsuarioAtual } from '../data/auth.js';


const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const SVG_NS = 'http://www.w3.org/2000/svg';

// Ícones (paths 24x24, estilo contorno)
const ICONES = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  chama: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  saude: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  esportes: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  estudos: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  leitura: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  alimentacao: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  sono: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  mental: '<path d="M12 22v-5"/><path d="M9 17h6"/><path d="M12 17c-3 0-5-2-5-5 0-2 1-3 2-4-1-1-1-3 1-4 1.5-1 3-.5 4 .5 1-1 2.5-1.5 4-.5 2 1 2 3 1 4 1 1 2 2 2 4 0 3-2 5-5 5z"/>',
  financas: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  organizacao: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  hobbies: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  outros: '<circle cx="12" cy="12" r="9"/>',
};

// Lista fixa de categorias (a ordem é a do select do formulário)
const CATEGORIAS = {
  saude: { rotulo: 'Saúde', fundo: '#fde8e6', texto: '#b3261e' },
  esportes: { rotulo: 'Esportes e exercícios', fundo: '#e9f9c4', texto: '#2f4a05' },
  estudos: { rotulo: 'Estudos', fundo: '#e1ebff', texto: '#1e4fb8' },
  leitura: { rotulo: 'Leitura', fundo: '#efdffb', texto: '#6a2b9a' },
  alimentacao: { rotulo: 'Alimentação', fundo: '#fde8e6', texto: '#b3261e' },
  sono: { rotulo: 'Sono', fundo: '#e1ebff', texto: '#1e4fb8' },
  mental: { rotulo: 'Bem-estar mental', fundo: '#efdffb', texto: '#7a2fa8' },
  financas: { rotulo: 'Finanças', fundo: '#e9f9c4', texto: '#2f4a05' },
  organizacao: { rotulo: 'Organização e produtividade', fundo: '#dff4f8', texto: '#0e6a80' },
  hobbies: { rotulo: 'Hobbies e criatividade', fundo: '#dff4f8', texto: '#0e6a80' },
  outros: { rotulo: 'Outros', fundo: '#ececea', texto: '#444444' },
};

// ---------- Utilidades ----------

const $ = (id) => document.getElementById(id);

function hojeChave() {
  return paraChave(hoje());
}

function plural(n, singular, pluralTxt) {
  return `${n} ${n === 1 ? singular : pluralTxt}`;
}

function svg(nomeIcone) {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', nomeIcone === 'check' ? '2.8' : '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = ICONES[nomeIcone] || ICONES.outros;
  return s;
}

function el(tag, opts = {}, filhos = []) {
  const e = document.createElement(tag);
  if (opts.classe) e.className = opts.classe;
  if (opts.texto != null) e.textContent = opts.texto;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) e.setAttribute(k, v);
  }
  for (const f of filhos) {
    if (f) e.appendChild(f);
  }
  return e;
}

let usuarioAtual = null;

function idUsuarioAtual() {
  return usuarioAtual.id;
}

// ---------- Estado ----------

let habitos = [];
let conclusoes = []; // só as conclusões dos hábitos do usuário

async function carregar() {
  const idUsuario = idUsuarioAtual();
  const todos = await repoHabitos.listar();
  habitos = todos.filter((h) => h.idUsuario === idUsuario && h.ativo !== false);

  const ids = new Set(habitos.map((h) => h.id));
  const todasConclusoes = await repoConclusoes.listar();
  conclusoes = todasConclusoes.filter((c) => ids.has(c.idHabito));
}

// ---------- Regras ----------

function ehDeHoje(h) {
  const f = h.frequencia;
  if (f && f.tipo === 'dias-semana' && f.dias && f.dias.length) {
    return f.dias.includes(new Date().getDay());
  }
  return true;
}

function conclusaoDeHoje(h) {
  const chave = hojeChave();
  return conclusoes.find((c) => c.idHabito === h.id && c.data === chave) || null;
}

function feitoHoje(h) {
  return conclusaoDeHoje(h) !== null;
}

function sequenciaDe(h) {
  const datas = conclusoes.filter((c) => c.idHabito === h.id).map((c) => c.data);
  return calcularSequencia(h.frequencia, datas, hojeChave());
}

function textoSequencia(seq) {
  return `Sequência: ${plural(seq.atual, 'dia', 'dias')} · Recorde: ${seq.maior}`;
}

// Marca/desmarca a conclusão de hoje (no máximo uma por hábito por dia)
async function alternar(idHabito) {
  const habito = habitos.find((h) => h.id === idHabito);
  if (!habito) return;

  try {
    const existente = conclusaoDeHoje(habito);
    if (existente) {
      await repoConclusoes.excluir(existente.id);
      conclusoes = conclusoes.filter((c) => c.id !== existente.id);
    } else {
      const nova = await repoConclusoes.criar({ idHabito, data: hojeChave() });
      conclusoes.push(nova);
    }
  } catch (erro) {
    console.error('Não foi possível salvar a alteração:', erro);
  }
  renderizar();
}

async function adicionarHabito({ nome, categoria, descricao }) {
  const habito = await repoHabitos.criar({
    idUsuario: idUsuarioAtual(),
    nome,
    categoria: CATEGORIAS[categoria] ? categoria : 'outros',
    descricao,
    frequencia: { tipo: 'diaria' },
  });
  habitos.push(habito);
  renderizar();
  return habito;
}

// ---------- Renderização ----------

function renderData() {
  const txt = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  $('data-hoje').textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
}

function renderProgresso(deHoje) {
  const total = deHoje.length;
  const feitos = deHoje.reduce((soma, h) => soma + (feitoHoje(h) ? 1 : 0), 0);
  const pct = total ? Math.round((feitos / total) * 100) : 0;
  $('progresso-texto').textContent = `${feitos} de ${total} feitos`;
  $('progresso-barra').style.width = `${pct}%`;
  $('progresso-trilho').setAttribute('aria-valuenow', String(pct));
}

function criarItem(h) {
  const feito = feitoHoje(h);
  const chaveCat = CATEGORIAS[h.categoria] ? h.categoria : 'outros';
  const cat = CATEGORIAS[chaveCat];
  const seq = sequenciaDe(h);

  const botao = el(
    'button',
    {
      classe: 'check',
      attrs: {
        type: 'button',
        'aria-pressed': String(feito),
        'aria-label': `${feito ? 'Desmarcar' : 'Concluir'} ${h.nome}`,
      },
    },
    [svg('check')]
  );
  botao.addEventListener('click', () => alternar(h.id));

  const chama = el('span', { classe: 'chama', attrs: { title: 'Sequência atual' } }, [
    svg('chama'),
    el('span', { texto: String(seq.atual) }),
  ]);

  const linha1 = el('div', { classe: 'habito-linha1' }, [
    el('h3', { classe: 'habito-nome', texto: h.nome }),
    chama,
  ]);

  const tag = el('span', { classe: 'tag' }, [svg(chaveCat), el('span', { texto: cat.rotulo })]);
  tag.style.backgroundColor = cat.fundo;
  tag.style.color = cat.texto;

  const textoMeta = (feito ? 'Feito hoje · ' : '') + textoSequencia(seq);
  const meta = el('div', { classe: 'habito-meta' }, [tag, el('span', { texto: textoMeta })]);

  const corpo = el('div', { classe: 'habito-corpo' }, [linha1, meta]);
  if (h.descricao) {
    corpo.appendChild(el('p', { classe: 'habito-desc', texto: h.descricao }));
  }

  return el('li', { classe: 'habito' + (feito ? ' feito' : ''), attrs: { 'data-id': h.id } }, [
    botao,
    corpo,
  ]);
}

function criarItemNaoHoje(h) {
  const dias = [...(h.frequencia.dias || [])]
    .sort((a, b) => a - b)
    .map((d) => DIAS_ABREV[d])
    .join(', ');

  return el('div', { classe: 'item-nao-hoje' }, [
    el('div', {}, [
      el('h3', { texto: h.nome }),
      el('p', { texto: `Dias: ${dias} · ${textoSequencia(sequenciaDe(h))}` }),
    ]),
    el('span', { texto: 'Não é hoje' }),
  ]);
}

function renderizar() {
  renderData();

  const deHoje = habitos.filter(ehDeHoje);
  const foraHoje = habitos.filter((h) => !ehDeHoje(h));
  const vazio = habitos.length === 0;

  renderProgresso(deHoje);

  // Estado vazio x lista
  $('estado-vazio').hidden = !vazio;
  $('cartao-lista').hidden = vazio;

  const lista = $('lista-habitos');
  lista.replaceChildren();
  if (!vazio) {
    if (deHoje.length === 0) {
      lista.appendChild(
        el('li', { classe: 'lista-vazia-hoje', texto: 'Nenhum hábito programado para hoje.' })
      );
    } else {
      lista.append(...deHoje.map(criarItem));
    }
  }

  // Seção "Não é hoje"
  $('secao-nao-hoje').hidden = foraHoje.length === 0;
  $('nao-hoje-titulo').textContent = `Não é hoje (${foraHoje.length})`;
  const contNao = $('lista-nao-hoje');
  contNao.replaceChildren(...foraHoje.map(criarItemNaoHoje));
}

// ---------- Formulário "Novo hábito" (janela criada pelo JS) ----------

let dialogo = null;

function criarFormulario() {
  const d = document.createElement('dialog');
  d.className = 'dlg-habito';
  d.setAttribute('aria-labelledby', 'dlg-titulo');

  // Estrutura fixa (sem dados do usuário), então innerHTML é seguro aqui.
  d.innerHTML =
    '<form id="form-novo-habito" novalidate>' +
    '<div class="dlg-topo">' +
    '<h2 id="dlg-titulo">Novo hábito</h2>' +
    '<button type="button" class="dlg-fechar" data-fechar aria-label="Fechar">&times;</button>' +
    '</div>' +
    '<div class="campo">' +
    '<label for="campo-nome">Nome</label>' +
    '<input id="campo-nome" name="nome" type="text" maxlength="60" placeholder="Ex.: Correr 30 min" autocomplete="off">' +
    '<p class="campo-erro" id="erro-nome" hidden></p>' +
    '</div>' +
    '<div class="campo">' +
    '<label for="campo-categoria">Categoria</label>' +
    '<select id="campo-categoria" name="categoria"><option value="">Selecione uma categoria</option></select>' +
    '<p class="campo-erro" id="erro-categoria" hidden></p>' +
    '</div>' +
    '<div class="campo">' +
    '<label for="campo-descricao">Descrição (opcional)</label>' +
    '<textarea id="campo-descricao" name="descricao" maxlength="200" rows="2"></textarea>' +
    '</div>' +
    '<fieldset class="campo">' +
    '<legend>Frequência</legend>' +
    '<label class="opcao-freq"><input type="radio" name="frequencia" value="diaria" checked> Todos os dias</label>' +
    '</fieldset>' +
    '<p class="campo-erro" id="erro-geral" hidden></p>' +
    '<div class="dlg-acoes">' +
    '<button type="button" class="dlg-sec" data-fechar>Cancelar</button>' +
    '<button type="submit" class="dlg-primario" id="btn-salvar-habito">Salvar hábito</button>' +
    '</div>' +
    '</form>';

  document.body.appendChild(d);

  // Opções do select vêm da lista fixa CATEGORIAS
  const select = d.querySelector('#campo-categoria');
  for (const [chave, cat] of Object.entries(CATEGORIAS)) {
    const op = document.createElement('option');
    op.value = chave;
    op.textContent = cat.rotulo;
    select.appendChild(op);
  }

  const form = d.querySelector('#form-novo-habito');
  const campoNome = d.querySelector('#campo-nome');
  const campoDescricao = d.querySelector('#campo-descricao');
  const botaoSalvar = d.querySelector('#btn-salvar-habito');

  function mostrarErro(idErro, campo, mensagem) {
    const p = d.querySelector('#' + idErro);
    p.textContent = mensagem;
    p.hidden = false;
    if (campo) campo.classList.add('invalido');
  }

  function limparErros() {
    d.querySelectorAll('.campo-erro').forEach((p) => {
      p.hidden = true;
      p.textContent = '';
    });
    d.querySelectorAll('.invalido').forEach((c) => c.classList.remove('invalido'));
  }

  // Fechar: botões X/Cancelar e clique no fundo escuro (Esc já funciona sozinho)
  d.querySelectorAll('[data-fechar]').forEach((b) => {
    b.addEventListener('click', () => d.close());
  });
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    limparErros();

    const nome = campoNome.value.trim();
    const categoria = select.value;
    const descricao = campoDescricao.value.trim();
    let primeiroInvalido = null;

    if (!nome) {
      mostrarErro('erro-nome', campoNome, 'Informe o nome do hábito.');
      primeiroInvalido = campoNome;
    }
    if (!CATEGORIAS[categoria]) {
      mostrarErro('erro-categoria', select, 'Escolha uma categoria.');
      primeiroInvalido = primeiroInvalido || select;
    }
    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }

    botaoSalvar.disabled = true;
    try {
      await adicionarHabito({ nome, categoria, descricao });
      d.close();
    } catch (erro) {
      console.error(erro);
      mostrarErro('erro-geral', null, 'Não foi possível salvar o hábito. Tente novamente.');
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  d.limpar = () => {
    form.reset();
    limparErros();
  };
  d.focarNome = () => campoNome.focus();
  return d;
}

function abrirFormulario() {
  if (!dialogo) dialogo = criarFormulario();
  dialogo.limpar();
  dialogo.showModal();
  dialogo.focarNome();
}

// ---------- Inicialização ----------

async function iniciar() {
  const autorizado = await exigirLogin();

  if (!autorizado) {
    return;
  } 

  usuarioAtual = await obterUsuarioAtual();

  if (!usuarioAtual) {
    return;
  }
  // Menu lateral (o navbar devolve um elemento, não uma string).
  // Se o menu falhar, a página continua funcionando e o erro aparece no console.
  try {
    $('menu').appendChild(await criarNavbar());
  } catch (erro) {
    console.error('Não foi possível montar o menu:', erro);
  }

  $('btn-novo-habito').addEventListener('click', abrirFormulario);
  $('btn-novo-habito-vazio').addEventListener('click', abrirFormulario);

  const toggle = $('nao-hoje-toggle');
  toggle.addEventListener('click', () => {
    const aberto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!aberto));
    $('lista-nao-hoje').hidden = aberto;
  });

  // Se a aba ficar aberta até virar o dia, atualiza ao voltar a ela
  let diaRenderizado = hojeChave();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && hojeChave() !== diaRenderizado) {
      diaRenderizado = hojeChave();
      renderizar();
    }
  });

  try {
    await carregar();
  } catch (erro) {
    console.error('Não foi possível carregar os hábitos:', erro);
    habitos = [];
    conclusoes = [];
  }
  renderizar();
}

iniciar();