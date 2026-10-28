import '../styles/base.css'; // Tailwind + cores "brand-*" (mesmo import das outras páginas)
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { obterUsuarioAtual } from '../data/index.js';
import * as repoHabitos from '../data/habitos.js';
import * as repoConclusoes from '../data/conclusoesHabito.js';
import { paraChave, hoje } from '../utils/datas.js';
import { formatarSequencia } from '../utils/sequencia.js';
import { calcularSequencia } from '../rules/streak.js';

const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const SVG_NS = 'http://www.w3.org/2000/svg';
const TAMANHO_MAX_NOME = 60;
const TAMANHO_MAX_DESCRICAO = 200;

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
  lapis: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  lixeira: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  outros: '<circle cx="12" cy="12" r="9"/>',
};

// Lista fixa de categorias (a ordem é a do select do formulário).
// "cor" são classes do Tailwind (escritas por extenso para o Tailwind encontrá-las).
const CATEGORIAS = {
  saude: { rotulo: 'Saúde', cor: 'bg-red-100 text-red-800' },
  esportes: { rotulo: 'Esportes e exercícios', cor: 'bg-lime-100 text-lime-900' },
  estudos: { rotulo: 'Estudos', cor: 'bg-blue-100 text-blue-800' },
  leitura: { rotulo: 'Leitura', cor: 'bg-purple-100 text-purple-800' },
  alimentacao: { rotulo: 'Alimentação', cor: 'bg-red-100 text-red-800' },
  sono: { rotulo: 'Sono', cor: 'bg-blue-100 text-blue-800' },
  mental: { rotulo: 'Bem-estar mental', cor: 'bg-purple-100 text-purple-800' },
  financas: { rotulo: 'Finanças', cor: 'bg-lime-100 text-lime-900' },
  organizacao: { rotulo: 'Organização e produtividade', cor: 'bg-cyan-100 text-cyan-800' },
  hobbies: { rotulo: 'Hobbies e criatividade', cor: 'bg-cyan-100 text-cyan-800' },
  outros: { rotulo: 'Outros', cor: 'bg-gray-200 text-gray-700' },
};

// Classes do Tailwind reaproveitadas (strings fixas, sem dados do usuário)
const CLASSE_CAMPO =
  'w-full rounded-xl border border-(--line) bg-white px-4 py-3 text-base text-brand-dark ' +
  'focus:border-brand-blue focus:outline-2 focus:outline-brand-blue aria-invalid:border-(--chama-ink)';
const CLASSE_ERRO = 'mt-1.5 text-sm text-(--chama-ink)';
const CLASSE_BTN_PRIMARIO =
  'flex-1 cursor-pointer rounded-xl bg-brand-blue px-5 py-3 text-base font-semibold text-white ' +
  'transition-colors hover:bg-(--azul-escuro) disabled:cursor-default disabled:opacity-60';
const CLASSE_BTN_SECUNDARIO =
  'cursor-pointer rounded-xl border border-(--line) bg-white px-5 py-3 text-base font-semibold ' +
  'transition-colors hover:bg-brand-ice';
const CLASSE_BTN_PERIGO =
  'flex-1 cursor-pointer rounded-xl bg-(--chama-ink) px-5 py-3 text-base font-semibold text-white ' +
  'transition hover:brightness-90 disabled:cursor-default disabled:opacity-60';
const CLASSE_MODAL =
  'm-auto max-h-[92vh] w-[min(32.5rem,92vw)] overflow-y-auto rounded-2xl bg-brand-ice p-0 ' +
  'text-brand-dark shadow-2xl backdrop:bg-black/45';

const CLASSE_CHECK =
  'grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border-2 p-0 ' +
  'text-brand-dark transition-colors active:scale-95';
const CLASSE_CHECK_FEITO = `${CLASSE_CHECK} border-(--lima) bg-(--lima)`;
const CLASSE_CHECK_PENDENTE = `${CLASSE_CHECK} border-brand-blue bg-transparent hover:bg-brand-ice`;

const CLASSE_ITEM =
  'relative flex items-start gap-4 border-b border-(--line) px-4 py-4 last:border-b-0';
const CLASSE_ITEM_FEITO =
  `${CLASSE_ITEM} bg-(--lima-suave) before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-(--lima)`;

const CLASSE_BTN_ACAO =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-brand-light-gray ' +
  'transition-colors hover:bg-(--line) hover:text-brand-dark';
const CLASSE_BTN_ACAO_PERIGO =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-brand-light-gray ' +
  'transition-colors hover:bg-(--chama-bg) hover:text-(--chama-ink)';

// ---------- Utilidades ----------

const $ = (id) => document.getElementById(id);

function hojeChave() {
  return paraChave(hoje());
}

// Ícone SVG. O conteúdo vem da constante ICONES (nunca de dados do usuário).
function svg(nomeIcone, classe = '') {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', nomeIcone === 'check' ? '2.8' : '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  if (classe) s.setAttribute('class', classe);
  s.innerHTML = ICONES[nomeIcone] || ICONES.outros;
  return s;
}

// Cria um elemento: el('h3', { classe, texto, attrs }, [filhos]). O texto entra por textContent.
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

// Categoria válida (um valor estranho gravado no storage cai em "outros")
function chaveCategoria(categoria) {
  return Object.hasOwn(CATEGORIAS, categoria) ? categoria : 'outros';
}

let usuarioAtual = null; // preenchido em iniciar(), depois do login

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
    return f.dias.includes(hoje().getDay());
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

function textoSequencia(seq, frequencia) {
  const atual = formatarSequencia(seq.atual, frequencia);
  const recorde = formatarSequencia(seq.maior, frequencia);
  return `Sequência: ${atual} · Recorde: ${recorde}`;
}

// Valida os campos do formulário. Devolve { campo: mensagem } (vazio = tudo certo).
function validarCampos({ nome, categoria, descricao }) {
  const erros = {};
  if (!nome) {
    erros.nome = 'Informe o nome do hábito.';
  } else if (nome.length > TAMANHO_MAX_NOME) {
    erros.nome = `O nome deve ter até ${TAMANHO_MAX_NOME} caracteres.`;
  }
  if (!Object.hasOwn(CATEGORIAS, categoria)) {
    erros.categoria = 'Escolha uma categoria.';
  }
  if (descricao.length > TAMANHO_MAX_DESCRICAO) {
    erros.descricao = `A descrição deve ter até ${TAMANHO_MAX_DESCRICAO} caracteres.`;
  }
  return erros;
}

// Ids de hábitos com marcação em andamento (evita duplo clique criar duas conclusões)
const emAndamento = new Set();

// Marca/desmarca a conclusão de hoje (no máximo uma por hábito por dia)
async function alternar(idHabito) {
  const habito = habitos.find((h) => h.id === idHabito);
  if (!habito || emAndamento.has(idHabito)) return;

  emAndamento.add(idHabito);
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
  } finally {
    emAndamento.delete(idHabito);
  }
  renderizar();
}

async function adicionarHabito({ nome, categoria, descricao }) {
  const habito = await repoHabitos.criar({
    idUsuario: idUsuarioAtual(),
    nome,
    categoria: chaveCategoria(categoria),
    descricao,
    frequencia: { tipo: 'diaria' },
  });
  habitos.push(habito);
  renderizar();
  return habito;
}

// Garante que o hábito existe e pertence ao usuário logado
async function buscarHabitoDoUsuario(id) {
  const habito = await repoHabitos.buscarPorId(id);
  if (!habito || habito.idUsuario !== idUsuarioAtual()) {
    throw new Error('Hábito não encontrado para este usuário.');
  }
  return habito;
}

// Edita só nome, categoria e descrição (a frequência não muda)
async function salvarEdicao(id, { nome, categoria, descricao }) {
  await buscarHabitoDoUsuario(id);
  const atualizado = await repoHabitos.atualizar(id, {
    nome,
    categoria: chaveCategoria(categoria),
    descricao,
  });
  if (!atualizado) throw new Error('Hábito não encontrado.');
  habitos = habitos.map((h) => (h.id === id ? atualizado : h));
  renderizar();
}

// Exclusão real: remove o hábito e todas as conclusões dele
async function excluirHabito(id) {
  await buscarHabitoDoUsuario(id);
  await repoHabitos.excluir(id);
  habitos = habitos.filter((h) => h.id !== id);
  conclusoes = conclusoes.filter((c) => c.idHabito !== id);
  renderizar();

  // O hábito já foi removido. Se a limpeza das conclusões falhar, sobram conclusões
  // órfãs, que carregar() ignora; por isso o erro só vai para o console.
  try {
    await repoConclusoes.excluirPorHabito(id);
  } catch (erro) {
    console.error('Hábito excluído, mas não foi possível limpar as conclusões:', erro);
  }
}

// ---------- Renderização ----------

function renderData() {
  const txt = hoje().toLocaleDateString('pt-BR', {
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
  $('progresso-barra').style.width = `${pct}%`; // valor dinâmico: precisa ser inline
  $('progresso-trilho').setAttribute('aria-valuenow', String(pct));
}

// Botões de editar e excluir (iguais no cartão do dia e em "Não é hoje")
function criarAcoes(h) {
  const editar = el(
    'button',
    {
      classe: CLASSE_BTN_ACAO,
      attrs: { type: 'button', 'aria-label': `Editar ${h.nome}`, title: 'Editar' },
    },
    [svg('lapis', 'size-4.5')]
  );
  editar.addEventListener('click', () => abrirFormulario(h));

  const excluir = el(
    'button',
    {
      classe: CLASSE_BTN_ACAO_PERIGO,
      attrs: { type: 'button', 'aria-label': `Excluir ${h.nome}`, title: 'Excluir' },
    },
    [svg('lixeira', 'size-4.5')]
  );
  excluir.addEventListener('click', () => abrirConfirmacao(h));

  return el('div', { classe: 'ml-auto flex shrink-0 gap-1' }, [editar, excluir]);
}

function criarItem(h) {
  const feito = feitoHoje(h);
  const chaveCat = chaveCategoria(h.categoria);
  const cat = CATEGORIAS[chaveCat];
  const seq = sequenciaDe(h);

  const botao = el(
    'button',
    {
      classe: feito ? CLASSE_CHECK_FEITO : CLASSE_CHECK_PENDENTE,
      attrs: {
        type: 'button',
        'aria-pressed': String(feito),
        'aria-label': `${feito ? 'Desmarcar' : 'Concluir'} ${h.nome}`,
      },
    },
    [svg('check', feito ? 'size-5.5 opacity-100' : 'size-5.5 opacity-0')]
  );
  botao.addEventListener('click', () => alternar(h.id));

  const rotuloSequencia = `Sequência atual: ${formatarSequencia(seq.atual, h.frequencia)}`;
  const chama = el(
    'span',
    {
      classe:
        'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--chama-bg) px-3 py-1 ' +
        'text-sm font-semibold text-(--chama-ink)',
      attrs: { role: 'img', title: rotuloSequencia, 'aria-label': rotuloSequencia },
    },
    [svg('chama', 'size-3.5'), el('span', { texto: String(seq.atual), attrs: { 'aria-hidden': 'true' } })]
  );

  const linha1 = el('div', { classe: 'flex items-center gap-3' }, [
    el('h3', { classe: 'min-w-0 flex-1 break-words text-lg font-semibold tracking-tight', texto: h.nome }),
    chama,
    criarAcoes(h),
  ]);

  const tag = el(
    'span',
    { classe: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cat.cor}` },
    [svg(chaveCat, 'size-3.5'), el('span', { texto: cat.rotulo })]
  );

  const textoMeta = (feito ? 'Feito hoje · ' : '') + textoSequencia(seq, h.frequencia);
  const meta = el(
    'div',
    { classe: 'mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-brand-light-gray' },
    [tag, el('span', { texto: textoMeta })]
  );

  const corpo = el('div', { classe: 'min-w-0 flex-1' }, [linha1, meta]);
  if (h.descricao) {
    corpo.appendChild(
      el('p', { classe: 'mt-2.5 break-words text-sm leading-snug text-brand-light-gray', texto: h.descricao })
    );
  }

  return el('li', { classe: feito ? CLASSE_ITEM_FEITO : CLASSE_ITEM, attrs: { 'data-id': h.id } }, [
    botao,
    corpo,
  ]);
}

function criarItemNaoHoje(h) {
  const dias = [...(h.frequencia?.dias || [])]
    .sort((a, b) => a - b)
    .map((d) => DIAS_ABREV[d])
    .join(', ');
  const seq = sequenciaDe(h);

  return el(
    'div',
    { classe: 'flex items-center gap-3 border-b border-(--line) px-4 py-4 last:border-b-0' },
    [
      el('div', { classe: 'min-w-0 flex-1' }, [
        el('h3', { classe: 'break-words text-base font-medium', texto: h.nome }),
        el('p', {
          classe: 'mt-1 text-sm text-brand-light-gray',
          texto: `Dias: ${dias} · ${textoSequencia(seq, h.frequencia)}`,
        }),
      ]),
      criarAcoes(h),
      el('span', { classe: 'hidden whitespace-nowrap text-sm font-medium text-brand-light-gray sm:inline', texto: 'Não é hoje' }),
    ]
  );
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
        el('li', {
          classe: 'px-5 py-7 text-center text-base text-brand-light-gray',
          texto: 'Nenhum hábito programado para hoje.',
        })
      );
    } else {
      lista.append(...deHoje.map(criarItem));
    }
  }

  // Seção "Não é hoje"
  $('secao-nao-hoje').hidden = foraHoje.length === 0;
  $('nao-hoje-titulo').textContent = `Não é hoje (${foraHoje.length})`;
  $('lista-nao-hoje').replaceChildren(...foraHoje.map(criarItemNaoHoje));
}

// ---------- Janela (modal) de criar/editar hábito, criada pelo JS ----------

let dialogo = null;
let dialogoExclusao = null;
let habitoEmEdicao = null; // null = criando; objeto = editando

function criarFormulario() {
  /** @type {HTMLDialogElement & { preparar?: (habito?: any) => void, focarNome?: () => void }} */
  const d = document.createElement('dialog');
  d.className = CLASSE_MODAL;
  d.setAttribute('aria-labelledby', 'dlg-titulo');

  // Estrutura fixa (sem dados do usuário), então innerHTML é seguro aqui.
  d.innerHTML = `
    <form id="form-habito" novalidate class="flex flex-col gap-4 px-6 pt-5 pb-6">
      <div class="flex items-center justify-between">
        <h2 id="dlg-titulo" class="text-xl font-bold">Novo hábito</h2>
        <button type="button" data-fechar aria-label="Fechar"
          class="cursor-pointer rounded-lg px-2 text-3xl leading-none text-brand-light-gray hover:text-brand-dark">&times;</button>
      </div>

      <div>
        <label for="campo-nome" class="mb-2 block text-[15px] font-semibold">Nome</label>
        <input id="campo-nome" name="nome" type="text" maxlength="${TAMANHO_MAX_NOME}" autocomplete="off"
          placeholder="Ex.: Correr 30 min" class="${CLASSE_CAMPO}">
        <p id="erro-nome" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <div>
        <label for="campo-categoria" class="mb-2 block text-[15px] font-semibold">Categoria</label>
        <select id="campo-categoria" name="categoria" class="${CLASSE_CAMPO}">
          <option value="">Selecione uma categoria</option>
        </select>
        <p id="erro-categoria" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <div>
        <label for="campo-descricao" class="mb-2 block text-[15px] font-semibold">Descrição (opcional)</label>
        <textarea id="campo-descricao" name="descricao" rows="2" maxlength="${TAMANHO_MAX_DESCRICAO}"
          class="${CLASSE_CAMPO} min-h-18 resize-y"></textarea>
        <p id="erro-descricao" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <fieldset id="grupo-frequencia" class="min-w-0 border-0 p-0">
        <legend class="mb-2 block p-0 text-[15px] font-semibold">Frequência</legend>
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-blue bg-(--lima-suave) px-4 py-3 text-base font-semibold">
          <input type="radio" name="frequencia" value="diaria" checked class="size-4.5 accent-brand-blue">
          Todos os dias
        </label>
      </fieldset>

      <p id="erro-geral" class="${CLASSE_ERRO}" role="alert" hidden></p>

      <div class="mt-1 flex justify-end gap-3">
        <button type="button" data-fechar class="${CLASSE_BTN_SECUNDARIO}">Cancelar</button>
        <button type="submit" id="btn-salvar-habito" class="${CLASSE_BTN_PRIMARIO}">Salvar hábito</button>
      </div>
    </form>`;

  document.body.appendChild(d);

  // Opções do select vêm da lista fixa CATEGORIAS
  /** @type {HTMLSelectElement} */
  const select = d.querySelector('#campo-categoria');
  for (const [chave, cat] of Object.entries(CATEGORIAS)) {
    const op = document.createElement('option');
    op.value = chave;
    op.textContent = cat.rotulo;
    select.appendChild(op);
  }

  /** @type {HTMLFormElement} */
  const form = d.querySelector('#form-habito');
  /** @type {HTMLInputElement} */
  const campoNome = d.querySelector('#campo-nome');
  /** @type {HTMLTextAreaElement} */
  const campoDescricao = d.querySelector('#campo-descricao');
  /** @type {HTMLButtonElement} */
  const botaoSalvar = d.querySelector('#btn-salvar-habito');
  const titulo = d.querySelector('#dlg-titulo');
  /** @type {HTMLFieldSetElement} */
  const grupoFrequencia = d.querySelector('#grupo-frequencia');
  /** @type {Record<string, HTMLElement>} */
  const campos = { nome: campoNome, categoria: select, descricao: campoDescricao };

  function mostrarErro(chave, mensagem) {
    /** @type {HTMLElement} */
    const p = d.querySelector(`#erro-${chave}`);
    p.textContent = mensagem;
    p.hidden = false;
    if (campos[chave]) campos[chave].setAttribute('aria-invalid', 'true');
  }

  function limparErros() {
    d.querySelectorAll('[id^="erro-"]').forEach((p) => {
      /** @type {HTMLElement} */ (p).hidden = true;
      p.textContent = '';
    });
    d.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
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

    const dados = {
      nome: campoNome.value.trim(),
      categoria: select.value,
      descricao: campoDescricao.value.trim(),
    };

    const erros = validarCampos(dados);
    const chavesComErro = Object.keys(erros);
    if (chavesComErro.length > 0) {
      for (const chave of chavesComErro) mostrarErro(chave, erros[chave]);
      campos[chavesComErro[0]].focus(); // leva o cursor ao primeiro campo com problema
      return;
    }

    botaoSalvar.disabled = true;
    try {
      if (habitoEmEdicao) {
        await salvarEdicao(habitoEmEdicao.id, dados);
      } else {
        await adicionarHabito(dados);
      }
      d.close();
    } catch (erro) {
      console.error(erro);
      mostrarErro('geral', 'Não foi possível salvar o hábito. Tente novamente.');
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  d.addEventListener('close', () => {
    habitoEmEdicao = null;
  });

  // Prepara o formulário: sem argumento = novo hábito; com hábito = edição
  d.preparar = (habito) => {
    habitoEmEdicao = habito;
    form.reset();
    limparErros();
    titulo.textContent = habito ? 'Editar hábito' : 'Novo hábito';
    botaoSalvar.textContent = habito ? 'Salvar alterações' : 'Salvar hábito';
    grupoFrequencia.hidden = Boolean(habito); // a frequência não é editável
    if (habito) {
      campoNome.value = habito.nome;
      select.value = chaveCategoria(habito.categoria);
      campoDescricao.value = habito.descricao || '';
    }
  };
  d.focarNome = () => campoNome.focus();

  return d;
}

function abrirFormulario(habito = null) {
  if (!dialogo) dialogo = criarFormulario();
  dialogo.preparar(habito);
  dialogo.showModal();
  dialogo.focarNome();
}

// ---------- Janela (modal) de confirmação da exclusão ----------

function criarConfirmacao() {
  /** @type {HTMLDialogElement & { preparar?: (habito?: any) => void, focarNome?: () => void }} */
  const d = document.createElement('dialog');
  d.className = `${CLASSE_MODAL} max-w-md`;
  d.setAttribute('aria-labelledby', 'dlg-excluir-titulo');

  // Estrutura fixa; o nome do hábito entra depois, via textContent
  d.innerHTML = `
    <div class="flex flex-col gap-4 px-6 pt-5 pb-6">
      <h2 id="dlg-excluir-titulo" class="text-xl font-bold">Excluir hábito?</h2>
      <p id="dlg-excluir-texto" class="leading-normal text-brand-light-gray"></p>
      <p id="erro-excluir" class="${CLASSE_ERRO}" role="alert" hidden></p>
      <div class="flex justify-end gap-3">
        <button type="button" data-cancelar autofocus class="${CLASSE_BTN_SECUNDARIO}">Cancelar</button>
        <button type="button" id="btn-confirmar-exclusao" class="${CLASSE_BTN_PERIGO}">Excluir</button>
      </div>
    </div>`;
  document.body.appendChild(d);

  const texto = d.querySelector('#dlg-excluir-texto');
  /** @type {HTMLElement} */
  const erro = d.querySelector('#erro-excluir');
  /** @type {HTMLButtonElement} */
  const botao = d.querySelector('#btn-confirmar-exclusao');
  let idAlvo = null;

  d.querySelector('[data-cancelar]').addEventListener('click', () => d.close());
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });

  botao.addEventListener('click', async () => {
    botao.disabled = true;
    try {
      await excluirHabito(idAlvo);
      d.close();
    } catch (e) {
      console.error(e);
      erro.textContent = 'Não foi possível excluir o hábito. Tente novamente.';
      erro.hidden = false;
    } finally {
      botao.disabled = false;
    }
  });

  d.preparar = (habito) => {
    idAlvo = habito.id;
    erro.hidden = true;
    erro.textContent = '';
    texto.textContent =
      `Tem certeza que deseja excluir "${habito.nome}"? ` +
      'O histórico de conclusões e o recorde deste hábito também serão apagados. ' +
      'Essa ação não pode ser desfeita.';
  };
  return d;
}

function abrirConfirmacao(habito) {
  if (!dialogoExclusao) dialogoExclusao = criarConfirmacao();
  dialogoExclusao.preparar(habito);
  dialogoExclusao.showModal();
}

// ---------- Inicialização ----------

async function iniciar() {
  const autorizado = await exigirLogin();
  if (!autorizado) return;

  usuarioAtual = await obterUsuarioAtual();
  if (!usuarioAtual) return;

  // Menu lateral (criarNavbar é async e devolve um elemento).
  // Se o menu falhar, a página continua funcionando e o erro aparece no console.
  try {
    const menu = await criarNavbar();
    if (menu) {
      $('menu').appendChild(menu);
    }
  } catch (erro) {
    console.error('Não foi possível montar o menu:', erro);
  }

  $('btn-novo-habito').addEventListener('click', () => abrirFormulario());
  $('btn-novo-habito-vazio').addEventListener('click', () => abrirFormulario());

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